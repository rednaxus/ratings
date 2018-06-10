// @flow weak

/* eslint no-console:0 */
import React, { Component } from 'react'
import PropTypes      from 'prop-types'

import { Panel } from 'react-bootstrap'

import survey from '../../services/survey'

import {
  AnimatedView,
  Breadcrumb,
  Tokens,
  TokenCloud,
  TokenCategories,
  TokenCategoriesDetail
} from '../../components'

import { store } from '../../Root'


class TokensView extends Component {
  static propTypes= {
    actions: PropTypes.shape({
      enterTokensView: PropTypes.func,
      leaveTokensView: PropTypes.func
    })
  }

  constructor(props){
    super(props)
    //this.sections = survey.getSections()
    //let header = this.sections.map( ( section,idx) => ( { name: section.name, tablink: `tab-panel-${idx}`, isActive: !idx } ) )
    //this.state = { header }
//      mockHeader: [
 //       {name: 'Home', tablink: 'home', isActive: true},
 //       {name: 'About', tablink: 'about', isActive: false},
  //      {name: 'Profile', tablink: 'profile', isActive: false},
   //     {name: 'Contact', tablink: 'contact', isActive: false}
   //   ]
  //  }
  }

  componentWillReceiveProps(nextProps, nextState){
    this.props = nextProps
  }

  shouldComponentUpdate(){
    return true
  }

  componentWillMount() {
    const { actions: { enterTokensView } } = this.props
    enterTokensView()
  }

  componentDidMount() {
    const { actions: { fetchRoundsFinished } } = this.props
    fetchRoundsFinished()
  }

  componentWillUnmount() {
    const { actions: { leaveTokensView } } = this.props
    leaveTokensView()
  }

  render() {
    const { tokens, userAuth, rounds } = this.props

    //const { header } = this.state

    return (
      <AnimatedView>
        { userAuth.id ? <Breadcrumb path={["dashboard","tokens"]}></Breadcrumb> : '' }
        <div className="simpleContainer">
          <h2 className="gridH2">Covered Tokens</h2>
          <TokenCloud tokens={ tokens }/>
          {/*<Tokens { ...{ store } } />*/}
        </div>
        <TokenCategories tokens={ tokens } rounds={ rounds }/>
        <TokenCategoriesDetail tokens={ tokens } rounds={ rounds }/>
      </AnimatedView>
    );
  }
}

export default TokensView
