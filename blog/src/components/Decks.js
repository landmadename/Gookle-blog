import React, { Component } from 'react'
import Deck from './Deck'
import { connect } from 'react-redux'

class Decks extends Component {
    render() {
        console.log("Decks load")

        return Object.keys(this.props.boxes).map((name) => 
            <Deck 
                key={name}
                collectionName={name} 
                xIndex={this.props.boxes[name].xIndex} 
                yIndex={this.props.boxes[name].yIndex}
            />
        )

    }
}


const mapStateToProps = (state) => ({
    boxes: state.boxes
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Decks)
