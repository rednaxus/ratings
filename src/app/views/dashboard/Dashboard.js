import React, { Component } from 'react'
import Moment from 'react-moment'
import TokenListView from '../tokenList'
import UserStatus from '../../components/userStatus/UserStatus'

import { store } from '../../Root'

import AnalystMessages from '../../components/analysts/AnalystMessages'

import { AnimatedView, Breadcrumb } from '../../components'

class Dashboard extends Component {
  //constructor(props, { user }) {
  constructor(props) {
    super(props)
    //user = this.props
  }

  componentWillMount() {
    const { actions: { enterDashboard } } = this.props
    enterDashboard()
  }

  componentDidMount() { // Note: move these to app? or login
    const { actions: { fetchCyclesDataIfNeeded, fetchCronInfo, refreshUserInfo } } = this.props
    //fetchCyclesDataIfNeeded()
    fetchCronInfo()
    //refreshUserInfo()
  }

  componentWillUnmount() {
    const { actions: { leaveDashboard } } = this.props
    leaveDashboard()
  }

  shouldComponentUpdate() {
    return true;
    //return ( this.props.user.id !== undefined && !this.props.user.isFetching )
  }

  render() {
    const { user, tokens, rounds, cycles, cronInfo } = this.props
    const { currentView } = this.props
    //const userFullName = `${userInfos.firstname} ${userInfos.lastname.toUpperCase()}`;
    console.log('dashboard render',...user,...tokens,...rounds,...cycles)
    if ( user.id === undefined) return( '' )
    return(
      <AnimatedView>
        <main className="container">
          <div className="row">
            <div className="col-md-10 text-right text-green small">
              <Moment format="YYYY-MM-DD HH:MM" date={cronInfo}/>
            </div>
          </div>
          <AnalystMessages 
            user={ user } 
            cycles={ cycles } 
            tokens={ tokens } 
            rounds={ rounds } 
            timestamp={ cronInfo / 1000 }/>
          {/*<hr/>
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <img className="card-img-top" src="http://success-at-work.com/wp-content/uploads/2015/04/free-stock-photos.gif"/>
                <div className="card-block">
                  <figure className="profile">
                    <img src="http://success-at-work.com/wp-content/uploads/2015/04/free-stock-photos.gif" className="profile-avatar" alt=""/>
                  </figure>
                  <h4 className="card-title mt-3">New Sponsored Analyst!</h4>
                  <div className="meta">
                    <a>Name: Steven Jobs</a>
                  </div>
                  <div className="card-text">
                    Awesome! One of your referrals has joined. You will get X amount of their winnings, as well as Y amount of the winnings of any of their referrals! Keep up the good work——our system depends on analysts like you to grow a high-quality network.
                  </div>
                </div>
                <div className="card-footer">
                  <small>Last updated 3 mins ago</small>
                  <button className="btn btn-secondary float-right btn-sm">see more</button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <img className="card-img-top"
                  src="https://techcrunch.com/wp-content/uploads/2016/12/28577733713_c3c56181da_o.jpg?w=1390&crop=1"/>
                <div className="card-block">
                  <figure className="profile">
                    <img src="http://success-at-work.com/wp-content/uploads/2015/04/free-stock-photos.gif" className="profile-avatar" alt=""/>
                  </figure>
                  <h4 className="card-title mt-3">VEVA tokens available!</h4>
                  <div className="meta">
                    <a>4,000 VEVA</a>
                  </div>
                  <div className="card-text">
                    Nice work!  Your recent win as a BEAR analyst for Neo (NEO) has netted you 4,000 VEVA tokens!  These tokens are available in your account as of March 26, 2018. Your win total is now 16,000 VEVA... keep it up!
                  </div>
                </div>
                <div className="card-footer">
                  <small>Last updated 16 mins ago</small>
                  <button className="btn btn-secondary float-right btn-sm">go to account</button>
                </div>
              </div>
            </div>
          </div>
        */}
        </main>
      </AnimatedView>
    )
  }
}

export default Dashboard
