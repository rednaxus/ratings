// @flow weak

import React, { PureComponent } from 'react';
import PropTypes          from 'prop-types';
import {
  AnimatedView,
  Panel
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

  componentDidMount() {
    console.log('cycles component mounted')
    const { actions: { fetchRoundInfo } } = this.props
    fetchRoundInfo( this.props.match.params.id )
  }

  render() {
    const { match, location } = this.props
    const { round } = this.props
    var roundInfo = round ? round : { status:0 }
    console.log('props',this.props)

    return(
      <AnimatedView>
        <div className="row">
          <div className="col-xs-12">
            <Panel title="Round" hasTitle={true} bodyBackGndColor={'#F4F5F6'}>
              <div className="row">
                <div className="col-xs-12">
                  Round { match.params.id } with status <span className="red">{ appConfig.STATUSES[roundInfo.status] }</span>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </AnimatedView>
    )
  }
}

export default Round
