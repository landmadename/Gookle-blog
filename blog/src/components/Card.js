import React from 'react'
import styled from 'styled-components'
import { animated, interpolate } from "react-spring";
import { connect } from 'react-redux'
// import Parser from 'html-react-parser';

function Card(props) {
    const {wheight, wwidth} = props;
    const {face, i, x, y, rot, scale, bind} = props;

    return (
        <animated.div
            {...bind(i)}
            style={{
                transform: interpolate(
                    [x, y, rot, scale],
                    (x, y, r, s) => `translate3d(${x}px,${y}px,0)  rotateZ(${r}deg) scale(${s}) translate3d(-50%,-50%,0)`
                ),
                position: "absolute",
            }}
        >
            <img src={face} id={i} style={{
                width:"auto", 
                height:"auto", 
                maxWidth:wwidth<wheight ? wwidth*0.9 : wheight*0.8,
                maxHeight:wheight*0.8,
                filter:"drop-shadow(10px 11.5px 8px rgba(50, 50, 73, 0.6))"
                }} draggable="false"/>
        </animated.div>
    )
}


const mapStateToProps = (state) => ({
    wheight: state.wheight,
    wwidth: state.wwidth
})

export default connect(mapStateToProps)(Card)
