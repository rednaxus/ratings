// @flow weak

/* eslint no-console:0 */
import React, { Component } from 'react'
import PropTypes      from 'prop-types'

import { AnimatedView } from '../../components'

import { store } from '../../Root'

import Tokens from '../../components/tokens/Tokens'

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
    return (
      <AnimatedView>
        <div className="simpleContainer">
          <h2 className="gridH2">Tokens</h2>
          <Tokens { ...{ store } } />
        </div>
      </AnimatedView>
    );
  }
}

export default TokensView