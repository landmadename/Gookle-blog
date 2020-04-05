import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { useSpring, animated} from 'react-spring'

const PopaStyle = styled.div`
    position: absolute;
    border-radius: 10px;
    padding: 10px;
    width: ${props => props.wwidth - props.wheight * 0.1 - 20}px;
    height: ${props => props.wheight - props.wheight * 0.1 - 20}px;
    z-index: 100;
    transform: translate3d(
        ${props => props.wheight * 0.05}px,
        ${props => props.wheight * 0.05}px,
        0
    );
    background-color: white;
    box-shadow: 0 12.5px 30px 80px rgba(50, 50, 73, 0.6),
    0 10px 10px -10px rgba(50, 50, 73, 0.3);
`;


function Popa(props) {
    const {wheight, wwidth, pageUrl} = props;
    const [trans, setTrans] = useSpring(()=>({y:wheight*(-1.3)}))
    const [pageUrlToShow, setPageUrlToShow] = useState("")
    
    const transy = (y)=>`translate3d(0,${y}px,0)`

    const disappearOnPopstate = () => {
        if (props.pageUrl !== '') {
            props.setPageUrl('')
        } else {
            window.history.back()
        }
    }

    useEffect(() => {
        window.addEventListener("popstate", disappearOnPopstate, false)
        if (pageUrl === '') {
            setTrans(()=>({y:wheight*(-1.3)}))
            setPageUrlToShow('')
        } else {
            setPageUrlToShow(pageUrl)
            setTimeout(() => {
                setTrans(()=>({y:0}))
            }, 400)     
        }
        return () => {
            window.removeEventListener("popstate", disappearOnPopstate, false)
        }    
    }, [pageUrl])

    return (
        <animated.div
            style={{
                transform: trans.y.interpolate(transy),
                position: "absolute",
                zIndex: 100,
                width: wwidth,
                height: wheight
            }}
            onClick={()=>{
                props.setPageUrl('')
            }}
        >
            <PopaStyle
                wwidth={wwidth}
                wheight={wheight}               
            >
                <iframe 
                    style={{
                        height:"100%", 
                        width:"100%", 
                        border:"0px",
                        borderRadius:"10px"
                    }} 
                    src={pageUrlToShow}
                >

                </iframe>
            </PopaStyle>
        </animated.div>
    )
}


const setPageUrl = (payload) => ({
    type: "setPageUrl",
    payload
})

const mapStateToProps = (state) => ({
    wheight: state.wheight,
    wwidth: state.wwidth,
    pageUrl: state.pageUrl
})

const mapDispatchToProps = (dispatch) => {
    return {
        setPageUrl: (data) => {
            dispatch(setPageUrl(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Popa)
