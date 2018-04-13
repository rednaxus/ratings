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
  Breadcrumb
}                         from '../../components'

import JuristSurvey from '../../components/juristSurvey'
import FileUploader from '../briefUpload/FileUploader'
import { appConfig } from '../../config'

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
            <div>
              Analyst status in round: {appConfig.STATUSES[round.analyst_status]}
            </div>
            <JuristSurvey />
            <FileUploader />
          </Panel.Body>
        </Panel>


      </AnimatedView>
    )
  }
}

export default Round
