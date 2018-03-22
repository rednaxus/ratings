// @flow weak

import React, { PureComponent } from 'react'
import PropTypes          from 'prop-types'
import Moment from 'react-moment'
import { Panel } from 'react-bootstrap'
import * as _ from 'lodash'

import {
  AnimatedView,
  TokenSummary
}                         from '../../components'
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
    const { actions: { fetchRoundInfo } } = this.props
    fetchRoundInfo( this.idx )
    //fetchTokenRounds( this.idx ) 

    //fetchTokenData( this.idx )

  }
  render() {
    const { round, tokens } = this.props
    if (!round) return <div>fetching...</div>
    let i = _.findIndex(tokens.data,['id',round.covered_token])
    let token = i == -1 ? {} : tokens.data[ i ]

    return(
      <AnimatedView>
        <Panel>
          <Panel.Heading><Panel.Title>Round</Panel.Title></Panel.Heading>
          <Panel.Body>
            <div>
              Round { this.idx } for token <span className="text-success">{ token.name }</span> with status <span className="text-danger">{ appConfig.STATUSES[round.status] }</span>
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
          </Panel.Body>
        </Panel>
      </AnimatedView>
    )
  }
}

export default Round
