// @flow weak

/* eslint no-console:0 */
import React, { Component } from 'react'
import PropTypes      from 'prop-types'

import { AnimatedView } from '../../components'

import { store } from '../../Root'

import Analysts from '../../components/analysts/Analysts'

class AnalystsView extends Component {
  static propTypes= {
    actions: PropTypes.shape({
      enterAnalystsView: PropTypes.func,
      leaveAnalystsView: PropTypes.func
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
    const { actions: { enterAnalystsView } } = this.props
    enterAnalystsView()
  }

  componentWillUnmount() {
    const { actions: { leaveAnalystsView } } = this.props
    leaveAnalystsView()
  }

  render() {
    //const { analysts } = this.props
    return (
      <AnimatedView>
        <div className="simpleContainer">
          <h2 className="gridH2">Analysts</h2>
          <Analysts { ...{ store } } />
        </div>
      </AnimatedView>
    );
  }
}

export default AnalystsView