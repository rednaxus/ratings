// @flow weak

import React, { PureComponent } from 'react'
import PropTypes          from 'prop-types'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { Panel } from 'react-bootstrap'
import * as _ from 'lodash'

import {
  AnimatedView,
  TokenSummary,
  Breadcrumb,
  BriefUpload
}                         from '../../components'

//import JuristSurvey from '../../components/juristSurvey'
import { JuristSurvey } from '../../components'

import { appConfig } from '../../config'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
async function showResults(values) {
  await sleep(500); // simulate server latency
  window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`);
}

class Round extends PureComponent {
  static propTypes= {
    actions: PropTypes.shape({
      enterRound: PropTypes.func.isRequired,
      leaveRound: PropTypes.func.isRequired
    })
  };

  state = { path: ['round'] };

  componentWillMount() {
    const { actions: { enterRound } } = this.props
    enterRound()
  }

  componentWillUnmount() {
    const { actions: { leaveRound } } = this.props
    leaveRound()
  }

  componentDidUpdate() {
    if (this.idx === +this.props.match.params.id) return

    this.idx = +this.props.match.params.id
    //const { actions: { fetchTokenData, fetchTokenRounds } } = this.props
    const { actions: { fetchRoundInfo, fetchRoundAnalystInfo, fetchTokenRounds } } = this.props
    fetchRoundInfo( this.idx )
    fetchRoundAnalystInfo( this.idx )
    //fetchTokenRounds( this.idx ) 

    //fetchTokenData( this.idx )

  }
  render() {
    let i, token, round
    const { rounds, tokens } = this.props
    i = _.findIndex(rounds.data,['id',this.idx])
    round = i == -1 ? {}: rounds.data[ i ]
    if (_.isEmpty(round)) return <div>fetching...</div>
    i = _.findIndex(tokens.data,['id',round.covered_token])
    token = i == -1 ? {} : tokens.data[ i ]
    let analyst_status = appConfig.STATUSES[round.analyst_status]
    analyst_status = 'first survey due' // testing
    const getActivity = (analyst_status) => {
      switch(analyst_status) {
        case 'brief due' :
          return (<BriefUpload/>)
        case 'brief submitted' :
          return (<Brief edit={true} />)
        case 'first survey due':
          return (<BriefUpload/>)
          // return (<JuristSurvey onSubmit={showResults} />)
          //return (<JuristSurvey round={ round.id } pre={ true } roundAnalyst={ round.inround_id } />)
        case 'first survey submitted':
          return (<Brief />)
        case 'second survey due':
          return(
            <div>
              <div>Post survey due</div>
              {/*<JuristSurvey round={ round.id } roundAnalyst={ round.inround_id } pre={ false }/>*/}
            </div> )
        case 'second survey submitted':
          return(<div>Round completion at xxx</div>)
      }
    }

    return(
      <AnimatedView>
        <Breadcrumb path={["dashboard","eval-round"]} />
        <Panel>
          <Panel.Heading><Panel.Title>Evaluation Round</Panel.Title></Panel.Heading>
          <Panel.Body>
            <div>
              Round { this.idx } for token <Link to={"/token/"+token.id}><span className="text-success">{ token.name }</span></Link> with status <span className="text-danger">{ appConfig.STATUSES[round.status] }</span>
            </div>
            <div>
              Start: <Moment className="text-warning" format="YYYY-MM-DD HH:mm" date={ new Date(appConfig.cycleTime(round.cycle,true)) } />
            </div>
            <div>
              Finish: <Moment className="text-warning" format="YYYY-MM-DD HH:mm" date={ new Date(appConfig.cycleTime(round.cycle+4,true)) } />
            </div>
            <div>
              Number of analysts: {round.num_analysts}
            </div>
            <TokenSummary token={token} />
            <hr/>
            <div>
              Analyst status in round: { analyst_status } => { round.inround_id }
            </div>
            { getActivity( analyst_status ) }
          </Panel.Body>
        </Panel>


      </AnimatedView>
    )
  }
}

export default Round
