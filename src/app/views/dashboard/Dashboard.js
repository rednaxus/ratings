import React, { Component } from 'react'
import TokenListView from '../tokenList'
import UserStatus from '../../components/userStatus/UserStatus'

import { store } from '../../Root'

import AnalystMessages from '../../components/analysts/AnalystMessages'

import AnalystStat from '../analystStat'
import { AnimatedView } from '../../components'

class Dashboard extends Component {
  //constructor(props, { user }) {
  constructor(props) {
    super(props)
    //user = this.props
  }

  render() {
    const { userIsConnected, user } = this.props;
    const { currentView } = this.props;

    //const userFullName = `${userInfos.firstname} ${userInfos.lastname.toUpperCase()}`;
    console.log('props',this.props);
    return(
      <AnimatedView>
        <main className="container">
          <UserStatus user={ user.info.user }/>
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Analyst Dashboard</h1>
              <AnalystStat />
              <AnalystMessages { ...{ store } } />
            </div>
          </div>
        </main>
      </AnimatedView>
    )
  }
}

export default Dashboard