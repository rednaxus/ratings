import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import * as _ from 'lodash'

import { AnimatedView, Panel } from '../../components'

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
    let title = "Token: "+ token.name + " => " + token.symbol
    const tokenLink = (address) => "https://etherscan.io/address/"+token.address
    return(
      <AnimatedView>
        <div className="simpleContainer">
          <Panel title={title} hasTitle={true} bodyBackGndColor={'#F4F5F6'}>
            <div className="row">
              <div className="col-md-4">
                { token.price &&   
                  <div>
                    <div>rate: <span className="price-data">{token.price.rate}</span></div>
                    <div>diff: <span className="price-data">{token.price.diff}</span></div>
                    <div>ts: <span className="price-data">{token.price.ts}</span></div>
                    <div>volume(24): <span className="price-data">{token.price.volume24h}</span></div>
                    <div>currency: <span className="price-data">{token.price.currency}</span></div>
                    <div>available supply: <span className="price-data">{token.price.availableSupply}</span></div>
                    <div>market cap: <span className="price-data">{token.price.marketCapUsd}</span></div>
                  </div>
                }
                </div>
              <div className = "col-md-4">      
                <div>Updated: <Moment className="token-data" format="YYYY-MM-DD HH:mm" date={new Date(token.lastUpdated*1000)} /></div>
                <div>Supply: <span className="token-data">{token.totalSupply}</span></div>
                <div>Transfers: <span className="token-data">{token.transfersCount}</span></div>
                <div>Holders: <span className="token-data">{token.holdersCount}</span></div>
                <div>Ops: <span className="token-data">{token.countOps}</span></div>
              </div>
              <div className = "col-md-4">
                <div><a className="small" href={tokenLink(token.address)}>{token.address}</a></div>
                <div><a href={token.description}>description</a></div>
              </div>
            </div>
          </Panel>
          <Panel title="Token Rounds History" hasTitle={true} bodyBackGndColor={'#F4F5F6'}>
            <div>Current status: </div>

          </Panel>
        </div>
      </AnimatedView>
    )
  }
}

export default Token