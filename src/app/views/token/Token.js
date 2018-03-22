import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { Panel } from 'react-bootstrap'
import * as _ from 'lodash'

import { AnimatedView, TokenSummary } from '../../components'

class Token extends Component {

  componentWillReceiveProps(nextProps, nextState){
    this.props = nextProps
  }

  shouldComponentUpdate(){
    return true
  }

  componentDidMount() {
  }

  componentWillMount() {
    const { actions: { enterTokenView } } = this.props
    enterTokenView()
  }

  componentWillUnmount() {
    const { actions: { leaveTokenView } } = this.props
    leaveTokenView()
  }
  componentDidUpdate() {
    if (this.idx !== +this.props.match.params.token_id) {
      this.idx = +this.props.match.params.token_id
      const { actions: { fetchTokenData, fetchTokenRounds } } = this.props
      fetchTokenRounds( this.idx ) 
      fetchTokenData( this.idx )
    }
  }

  render() {
    const { currentView, tokens } = this.props
    let idx = _.findIndex(tokens.data,['id',+this.props.match.params.token_id])
    if (idx === -1) return(
      <div>fetching....</div>
    )
    let token = tokens.data[idx] 
    token.rounds = token.rounds || []
    let roundItems = token.rounds.map( round_id => <li><Link to={"/round/"+round_id}>{round_id}</Link></li> )
    console.log('props',this.props)
    console.log('token',tokens,idx,token)
    console.log('roundItems',roundItems)
    const tokenLink = (address) => "https://etherscan.io/address/"+token.address
    return(
      <AnimatedView>
        <div className="simpleContainer">
          <TokenSummary token={token} />
          { roundItems.length && 
          <Panel>
            <Panel.Heading>
              <Panel.Title>Token Rounds History</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <ul>{roundItems}</ul>
            </Panel.Body>
          </Panel>
          }
        </div>
      </AnimatedView>
    )
  }
}

export default Token