// @flow weak

/* eslint no-console:0 */
import React, { Component } from 'react'
import PropTypes      from 'prop-types'

import { AnimatedView } from '../../components'

import { store } from '../../Root'

import { Tokens, TokenCloud } from '../../components/tokens'


class TokensView extends Component {
  static propTypes= {
    actions: PropTypes.shape({
      enterTokensView: PropTypes.func,
      leaveTokensView: PropTypes.func
    })
  }

  constructor(props){
    super(props)
  }

  componentWillReceiveProps(nextProps, nextState){
    this.props = nextProps
  }

  shouldComponentUpdate(){
    return true
  }

  /*componentDidMount() {
    store.dispatch(fetchCronInfo())
  }
*/
  componentWillMount() {
    const { actions: { enterTokensView } } = this.props
    enterTokensView()
  }

  componentWillUnmount() {
    const { actions: { leaveTokensView } } = this.props
    leaveTokensView()
  }

  render() {
    const { tokens } = this.props
    return (
      <AnimatedView>
        <div className="simpleContainer">
          <h2 className="gridH2">Covered Tokens</h2>
          <TokenCloud tokens={ tokens }/>
          <Tokens { ...{ store } } />
        </div>
      </AnimatedView>
    );
  }
}

export default TokensView