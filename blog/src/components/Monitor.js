import React from 'react'
import { connect } from 'react-redux'



function Monitor(props) {
    return (
        <h2 style={{ position: 'absolute'}}>
            {props.mx}
        </h2>
    )
}

const mapStateToProps = (state) => {
    return {
      mx: state.mx
    }
  }
export default connect(mapStateToProps)(Monitor)
