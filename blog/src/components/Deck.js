import React from 'react'
import { connect } from 'react-redux'

import { useState, useEffect, useRef } from 'react'
import { useSpring, animated} from 'react-spring'
import { useDrag } from 'react-use-gesture'

import { loadGookles } from "./loadData"
import {createHaw} from './stick_of_haws'
import Card from './Card'
import './Deck.scss'



function Deck(props) {
    const {collectionName} = props;
    const {wheight, wwidth} = props;
    const {xIndex, yIndex, level} = props;
    const {debug} = props;

    const [active, setActive] = useState(yIndex >= 0)
    const [stick, setStick] = useState(() => new Set())
    const [gone] = useState(() => new Set());
    const [indexPosition, setIndexPosition] = useSpring(() => ({xy:[xIndex, (yIndex+level)]}))

    const mxNow = useRef(0)
    const indexNow = useRef(0)
    const pullDown = useRef(true)
    const from = {x: 10000000, rot: 0, scale: 1.1, y: 0 }
    const to = i => ({
        x: active ? wwidth * i: 0,
        y: 0,
        scale: 1,
        rot: -10 + Math.random() * 20,
        delay: i * 100
      });
    const transIndex = (x, y)=>`translate3d(
        ${wwidth * 0.5 + wwidth * (x)}px, 
        ${wheight * 0.5 + wheight * (y + debug)}px,
        0
        )`


    function updateGookles() {
        if (Object.keys(stick).length-1 - (-xIndex) < 2 && active) {
            console.log(stick)
            console.log('Load Gookles')
            loadGookles(collectionName, props.pushGookles, props.boxes, props.album, Object.keys(stick).length-1)
        }
    }

    const bind = useDrag(
        ({
          args: [index],
          down,
          tap,
          movement: [xDelta, yDelta],
          direction: [xDir, yDir],
          velocity
        }) => {
            if (tap) {
                console.log("hi")
                props.setPageUrl(stick[index].url)
            }
            console.log("start")
            const horizontalDir = xDir < 0 ? -1 : 1;
            const verticalDir = yDir < 0 ? -1 : 1;
            const leftGone = velocity > 0.2 && horizontalDir === -1
            const downGone = velocity > 0.2 && verticalDir === 1;
      
            indexNow.current = index
            if (!down && leftGone) {
                switch (yIndex) {
                    case -1:
                        props.moveDeck({collectionName:props.collectionName, index:-1, dir:"left"});
                        break;
                    case 0:
                        props.moveDeck({collectionName:props.collectionName, index:0, dir:"left"});
                        gone.add(index);
                        break;
                    case 1:
                        props.moveDeck({collectionName:props.collectionName, index:1, dir:"left"});
                        gone.add(index);
                        break;
                    default:
                        break;
                }
            }
            else if (!down && downGone){
                switch (yIndex) {
                    case -1:
                        pullDown.current = true
                        props.moveDeck({collectionName:props.collectionName, index:-1, dir:"down"});
                        setTimeout(() => {
                            props.shiftLevel(0)
                        }, 300);            
                        break;
                    case 0:
                        addToCollection({collectionName:props.collectionName, xIndex, fn:"plus", dir:"down"});
                        break;
                    case 1:
                        break;
                    default:
                        break;
                }
            }

            const isGone = gone.has(index);
            const x = down ? xDelta : active? (stick[indexNow.current].position) * wwidth : 0;
            const y = isGone ? -0 : down ? yDelta : 0;
            const rot = (isGone ? horizontalDir * 10 * velocity : 0);
            const scale = down ? 1.1 : 1;

            if (isGone) {
                gone.clear()
            }

            stick[index].set({
                x: x,
                y: y,
                rot: rot,
                scale: scale,
                delay: undefined,
                config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 }
                })
            },
            { initial: () => {
                if (yIndex === -1) {
                    return [0, 0]
                } else {
                    const posToId = {}
                    Object.keys(stick).map(i =>{ posToId[stick[i].position]=stick[i].id})
                    return [(stick[posToId[-xIndex]].position) * wwidth, 0]
                }
            } }
        )

    // 更新时加载gookle
    useEffect(() => {
        Object.keys(stick).map(i =>{
            stick[i].set(to(stick[i].position))
        })
        updateGookles()
    }, [active])

    // 更新时增加卡牌
    useEffect(() => {
        console.log('gookles updated!')
        const tempStick = Object.assign({}, stick)
        let updated = false
        props.gookles[collectionName].map(haw => {
            if (tempStick[haw.id] == null) {
                tempStick[haw.id] = 
                    new createHaw(
                        collectionName, 
                        Object.keys(tempStick).length-1,
                        haw.id, 
                        haw.url,
                        haw.face, 
                        from
                    )
                tempStick[haw.id].set(to(tempStick[haw.id].position))
                updated = true
            }
        })
        if (updated) {
            setStick(()=>tempStick)
        }
    }, [props.gookles])

    // 移动摇杆的时候，移动牌组
    useEffect(() => {
        if ((yIndex+level)===0 && props.mx!==0) {
            pullDown.current = false
            if (yIndex===-1) {
                const boxNames = []
                Object.keys(props.boxes).map(box => {
                    if (props.boxes[box].yIndex === -1) {
                        boxNames.push(box)
                    }
                })
                if (collectionName === boxNames[0]) {
                    if (props.mx > mxNow.current) {
                        props.moveDeck({collectionName:props.collectionName, index: yIndex, dir:"left"});
                    } else {
                        props.moveDeck({collectionName:props.collectionName, index: yIndex, dir:"right"});
                    }        
                }
            } else {
                if (props.mx > mxNow.current) {
                    props.moveDeck({collectionName:props.collectionName, index: yIndex, dir:"left"});
                } else {
                    props.moveDeck({collectionName:props.collectionName, index: yIndex, dir:"right"});
                }        
            }
        }
        mxNow.current = props.mx
    }, [props.mx])

    // 当 xIndex yIndex
    useEffect(() => {
        setActive(yIndex >= 0)
        setIndexPosition(() => ({xy:[xIndex, (yIndex+level)]}))
        updateGookles()

        // 当下拉牌组的时候刷新一下
        if (pullDown.current) {
            setTimeout(() => {
                setIndexPosition(() => ({xy:[xIndex+0.001, (yIndex+level)+0.001]}))
            }, 300);
            setTimeout(() => {
                setIndexPosition(() => ({xy:[xIndex, (yIndex+level)]}))
            }, 300);
        }
    }, [level, xIndex, yIndex])

    return Object.keys(stick).map(i => 
        <animated.div
            key={stick[i].id}
            style={{
                transform: indexPosition.xy.interpolate(transIndex) 
            }}
        >
            <Card 
                face={stick[i].face}
                url={stick[i].url}
                i={stick[i].id}
                x={stick[i].spring.animated.x}
                y={stick[i].spring.animated.y}
                rot={stick[i].spring.animated.rot}
                scale={stick[i].spring.animated.scale}
                bind={bind}
            >
            </Card>
        </animated.div>
    )
}





const setPageUrl = (payload) => ({
    type: "setPageUrl",
    payload
})

const pushGookles = (payload) => ({
    type: "pushGookles",
    payload
})

function moveDeck(data) {
    return {
        type: "moveDeck",
        payload: data
    }
}
  
function addToCollection(data) {
    console.log(data)
    return {
        type: "addToCollection",
        payload: data
    }
}

const shiftLevel = (data) => ({
    type: "shiftLevel",
    payload: data
})

const mapStateToProps = (state) => ({
    wheight: state.wheight,
    wwidth: state.wwidth,
    debug: state.debug,

    boxes: state.boxes,
    album: state.album,
    gookles: state.gookles,
    level: state.level,

    mx: state.mx
})

const mapDispatchToProps = (dispatch) => {
    return {
        pushGookles: data => {
            dispatch(pushGookles(data))
        },
        moveDeck: data => {
            dispatch(moveDeck(data))
        },
        addToCollection: data => {
            dispatch(addToCollection(data))
        },
        shiftLevel: (data) => {
            dispatch(shiftLevel(data))
        },
        setPageUrl: (data) => {
            dispatch(setPageUrl(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Deck)

