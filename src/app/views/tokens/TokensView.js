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
  TabPanel            as TabPanelComponent,
  TabPanelHeader      as TabPanelHeaderComponent,
  TabPanelBody        as TabPanelBodyComponent,
  TabPanelBodyContent as TabPanelBodyContentComponent
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
    let sections = survey.getSections()
    let header = []
    sections.forEach( ( section,idx) => {
      header.push( { name: section, tablink: 'home', isActive: !idx } )
    })
    this.state = { header }
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

  componentWillUnmount() {
    const { actions: { leaveTokensView } } = this.props
    leaveTokensView()
  }

  render() {
    const { tokens, userAuth } = this.props

    console.log('auth',userAuth)

    const { header } = this.state

    return (
      <AnimatedView>
        { userAuth.id ? <Breadcrumb path={["dashboard","tokens"]}></Breadcrumb> : '' }
        <div className="simpleContainer">
          <h2 className="gridH2">Covered Tokens</h2>
          <TokenCloud tokens={ tokens }/>
          <Tokens { ...{ store } } />
        </div>
        <Panel>
          <TabPanelComponent>
            <TabPanelHeaderComponent tabItems={header}/>
            <TabPanelBodyComponent>
              <TabPanelBodyContentComponent id="home" isActive>
                <h3>
                  Home
                </h3>
              </TabPanelBodyContentComponent>
              <TabPanelBodyContentComponent id="about">
                <h3>
                  About
                </h3>
              </TabPanelBodyContentComponent>
              <TabPanelBodyContentComponent id="profile">
                <h3>
                  Profile
                </h3>
              </TabPanelBodyContentComponent>
            </TabPanelBodyComponent>
          </TabPanelComponent>
        </Panel>
      </AnimatedView>
    );
  }
}

export default TokensView