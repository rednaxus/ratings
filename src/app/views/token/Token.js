import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { Panel } from 'react-bootstrap'
import * as _ from 'lodash'

import { 
  AnimatedView, 
  TokenSummary, 
  Graph,
  Breadcrumb 
} from '../../components'

class Token extends Component {
  dummyGraphData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Pre-Review',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: [65, 59, 80, 81, 56, 55, 40]
      },
      {
        label: 'Post-Review',
        fillColor: 'rgba(151,187,205,0.2)',
        strokeColor: 'rgba(151,187,205,1)',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: [28, 48, 40, 19, 86, 27, 90]
      }
    ]
  }

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
      //fetchTokenRounds( this.idx ) 
      fetchTokenData( this.idx )
    }
  }

  render() {
    const { currentView, tokens } = this.props
    const { labels, datasets } = this.dummyGraphData

    let idx = _.findIndex(tokens.data,['id',+this.props.match.params.token_id])
    if (idx === -1) return(
      <div>fetching....</div>
    )
    let token = tokens.data[idx] 
    token.rounds = token.rounds || []
    let roundItems = token.rounds.map( (round_id,idx) => 
      <li key={idx}><Link to={"/round/"+round_id}>{round_id}</Link></li> 
    )
    console.log('props',this.props)
    console.log('token',tokens,idx,token)
    console.log('roundItems',roundItems)
    const tokenLink = (address) => "https://etherscan.io/address/"+token.address
    return(
      <AnimatedView>
        <Breadcrumb path={["dashboard","tokens",token.name]}></Breadcrumb>
        <div className="simpleContainer">
          <TokenSummary token={token} />
          { roundItems.length && 
          <Panel>
            <Panel.Heading>
              <Panel.Title>Token Ratings History</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <div>Evaluation Rounds</div>
              <ul>{roundItems}</ul>
              <Graph title="" labels={labels} datasets={datasets} />
            </Panel.Body>
          </Panel>
          || ""}
        </div>
      </AnimatedView>
    )
  }
}

export default Token