import React, { Component } from 'react'
import * as _ from 'lodash'

import { AnimatedView } from '../../components'

class Token extends Component {

  componentWillReceiveProps(nextProps, nextState){
    this.props = nextProps
  }

  shouldComponentUpdate(){
    return true
  }

  componentDidMount() {
    const { actions: { fetchTokenData } } = this.props
    fetchTokenData( this.props.match.params.token_id )
  }

  componentWillMount() {
    const { actions: { enterTokenView } } = this.props
    enterTokenView()
  }

  componentWillUnmount() {
    const { actions: { leaveTokenView } } = this.props
    leaveTokenView()
  }
  render() {
    const { currentView, tokens } = this.props
    let idx = _.findIndex(tokens.data,['id',+this.props.match.params.token_id])
    let token = idx === -1 ? { }: tokens.data[idx] 
    console.log('props',this.props)
    console.log('token',tokens,idx,token)
    return(
      <AnimatedView>
        <div className="simpleContainer">
          <h1>Token {token.name}</h1>
          <div>{token.address}</div>
        </div>
      </AnimatedView>
    )
  }
}

export default Token