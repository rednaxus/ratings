import React, { Component } from 'react'
import Slide from 'react-rangeslider'

import 'react-rangeslider/lib/index.css'
//import Slide from 'react-input-range';
//import 'react-input-range/lib/css/index.css';

const precisionRound = (number, precision) => {
  var factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}

class Slider extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      volume: 0
    }
  }

  handleOnChange = (value) => {
    console.log('setting value',value)
    this.setState({
      volume: precisionRound(value,1)
    })
    if (this.props.onChange) this.props.onChange(value)
  }

  render() {
    let { volume } = this.state
    return (
      <Slide
        min={0}
        max={5}
        step={0.1}
        value={volume}
        orientation="horizontal"
        onChange={this.handleOnChange}
      />
    )
  }
}

export default Slider