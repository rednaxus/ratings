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
      volume: props.value || 0,
      max: props.max || 5,
      min: props.min || 0,
      step: props.step || 0.1
    }
  }

  handleOnChange = (value) => {
    //console.log('setting value',value)
    let oldValue = this.state.volume
    this.setState({
      volume: precisionRound(value,1)
    })
    if (this.props.onChange) this.props.onChange(value,oldValue)
  }

  render() {
    let { volume, max, min, step } = this.state
    //console.log('values for slider', max,min, step)
    return (
      <Slide
        min={min}
        max={max}
        step={step}
        value={volume}
        orientation="horizontal"
        onChange={this.handleOnChange}
      />
    )
  }
}

export default Slider