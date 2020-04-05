import React, { Component } from 'react'
import Monitor from './Monitor'
import Popa from './Popa'
import One from './One'
import { connect } from 'react-redux'
import { loadBoxes, loadAlbum } from "./loadData"


class App extends Component {
    componentDidMount() {
        loadAlbum(this.props.setAlbum)
        loadBoxes(this.props.setBoxes, this.props.pushGookles)
    }
    render() {
        if (Object.keys(this.props.boxes) == false || Object.keys(this.props.album) == false) {
            return(
                <div>loading</div>
            )
        } else {
            return (
                <div>
                    {/* <Monitor /> */}
                    <Popa />
                    <One />
                    {/* <Test/> */}
                    
                </div>
            )
        }
    }
}


const pushGookles = (payload) => ({
    type: "pushGookles",
    payload
})

const setAlbum = (payload) => ({
    type: "setAlbum",
    payload: {album: payload}
})

const setBoxes = (payload) => ({
    type: "setBoxes",
    payload: {boxes: payload}
})

const mapStateToProps = (state) => ({
    boxes: state.boxes,
    album: state.album
})

const mapDispatchToProps = dispatch => {
    return {
        setAlbum: data => {
            dispatch(setAlbum(data))
        },
        setBoxes: data => {
            dispatch(setBoxes(data))
        },
        pushGookles: data => {
            dispatch(pushGookles(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
