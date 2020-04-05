import React, { Component } from 'react'
import Decks from './Decks'
import Goo from './Goo.js'

export default class One extends Component {
    render() {
        console.log("One load")
        return (
            <div>
                <Decks />
                <Goo />
            </div>
        )
    }
}
