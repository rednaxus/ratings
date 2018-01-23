import React, { Component } from 'react'
import TokenList from '../tokenList'
import UserStatus from '../../components/userStatus/UserStatus'
import { AnimatedView } from '../../components'

class Dashboard extends Component {
  constructor(props, { userInfos }) {
    super(props)
    userInfos = this.props
  }

  render() {
    const { userInfos, userIsConnected } = this.props;
    const { currentView } = this.props;

    const userFullName = `${userInfos.firstname} ${userInfos.lastname.toUpperCase()}`;
    console.log('props',this.props);
    return(
      <AnimatedView>
        <main className="container">
          <UserStatus user={ userInfos }/>
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Dashboard</h1>
              <p><strong>Congratulations {userFullName}!</strong> Welcome to the <span className="dog">Veva Ratings Agency</span> smart contract.</p>
              <h2>Current Shares listed:</h2>
              <TokenList />
            </div>
          </div>
        </main>
      </AnimatedView>
    )
  }
}

export default Dashboard