import React, { Component } from 'react'
import TokenListView from '../tokenList'
import UserStatus from '../../components/userStatus/UserStatus'
import AnalystStat from '../analystStat'
import { AnimatedView } from '../../components'

class Dashboard extends Component {
  constructor(props, { user }) {
    super(props)
    user = this.props
  }

  render() {
    const { userIsConnected, user } = this.props;
    const { currentView } = this.props;

    //const userFullName = `${userInfos.firstname} ${userInfos.lastname.toUpperCase()}`;
    console.log('props',this.props);
    return(
      <AnimatedView>
        <main className="container">
          { /*<UserStatus user={ user }/> take out until fixed*/ }
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Dashboard</h1>
              <AnalystStat />
            </div>
          </div>
        </main>
      </AnimatedView>
    )
  }
}

export default Dashboard