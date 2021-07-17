import React from 'react'
import { useState, useRef } from 'react'
import { useTrail, animated, config } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import { connect } from 'react-redux'
import './Goo.scss'



function Goo(props) {
    function handelDrag(e){
        let down = e.down
        let mx = e.movement[0]
        let tap = e.tap
        let span = 10
        const scale = down ? 0.6 : 1;
        if (tap) { 
            if (Date.now() - latestTapTime.current > 200) {
                set({ xAs: [mx, 1] }) 
                props.shiftLevel((props.level+1)%2)
            }
            latestTapTime.current = Date.now()
        } 
        if (true) {
            set({ 
                xAs: [down ? mx : wwidth*0.5, scale]
            })
            mx = down ? mx : wwidth*0.5
            if (parseInt(mx%span)===0 || mx===wwidth*0.5) {
                props.sendMx(parseInt((mx - wwidth*0.5)/span))
            }    
        }
    }

    const bind = useDrag(
        handelDrag,
        { 
            // axis: 'x', 
            initial: ()=>[parseInt(trail[0].xAs.getValue()[0]),580],
            filterTaps: false
        }
    )

    let wheight = window.innerHeight
    let wwidth = window.innerWidth
    const fast = { tension: 1200, friction: 40 }
    const slow = { mass: 1, tension: 1200-400, friction: 50 }
    const latestTapTime = useRef(Date.now())
    const trans = (x,s) => `translate3d(${x}px,${wheight*0.9}px,0) translate3d(-50%,-50%,0) scale(${s})`

    const [trail, set] = useTrail(6, () => ({ xAs: [wwidth*0.5, 1] , config: i => (i === 0 ? fast : slow)}))

    // useEffect(() => {
    //     let id = setInterval(() => {
    //         set({ xAs: [parseInt(trail[0].xAs.getValue()[0] - wwidth*0.25), 0.6] })
    //     }, 5000)
    //     return () => {
    //         clearInterval(id)
    //     }
    // }, [props.level])
    
    return (
        <div onMouseDown={()=>{
                set({ xAs: [parseInt(trail[0].xAs.getValue()[0]), 0.6] })}}
            onMouseLeave={()=>{
                set({ xAs: [parseInt(trail[0].xAs.getValue()[0]), 1] })}}
            >
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <filter id="goo">
                    <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="13" />
                    <feColorMatrix in="blur" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 25 -5" />
                </filter>
            </svg>
            <div className="hooks-main">
                {trail.map((props, index) => {
                    if (!index) {
                        return(
                            <animated.div {...bind(index)} key={index} style={{ 
                                transform: props.xAs.interpolate(trans) }} />  
                        )
                    } else {
                        return(
                            <animated.div key={index} style={{ transform: props.xAs.interpolate(trans) }} />
                        )
                    }
                })}
            </div>
        </div>
    )
}

const shiftLevel = (data) => ({
    type: "shiftLevel",
    payload: data
})


const mapDispatchToProps = (dispatch) => {
    return {
        sendMx: (mx) => {
            dispatch({
                type: "Mx",
                payload: {mx: mx}
            })
        },
        shiftLevel: (data) => {
            dispatch(shiftLevel(data))
        },
    }
}

const mapStateToProps = (state) => ({
    level: state.level,
})

export default connect(mapStateToProps, mapDispatchToProps)(Goo)
