import React, { Component } from 'react'
import config from '../../config/appConfig'

import { 
  AnimatedView, 
  Breadcrumb, 
  //UserStatus,
  AnalystRounds, AnalystPayouts, AnalystStat, AnalystReferrals
} from '../../components'

class Status extends Component {
  
  componentDidMount() {
    console.log('props',this.props)
    const {
      actions: {
        //fetchUserInfoDataIfNeeded,
        refreshInfo
      }
    } = this.props

    refreshInfo()
  }

  render() {
    const { currentView, userIsConnected, user, rounds, cronInfo, tokens } = this.props
    if ( user.id === undefined) return( '' )
    
    console.log('rounds',rounds)
    console.log('user',user)
    let user_rounds = !user.rounds ? [] : [ 
      //...user.rounds.scheduled,
      ...user.rounds.active,
      ...user.rounds.finished 
    ].map( round_id => _.find( rounds,['id',round_id] ) )

    console.log('user rounds',user_rounds)

    let payouts = !user.reward_events ? [] : _.filter( user.reward_events, reward => 
      config.reward_is_tokens(reward) 
    )
    console.log('payouts',user.reward_events,payouts)
    /*[
      { id:47, token:3, status:'completed', start:+new Date(), finish:+new Date() },
      { id:48, token:4, status:'in-process', start:+new Date(), finish:+new Date() }
    ]
    */
    /*
    let analystPayouts = [ // dummy data
      { id:2, tokens:5, timestamp:+new Date() }
    ]
    */
    console.log('props',this.props);
    return(
      <AnimatedView>
        <main className="container">
          <Breadcrumb path={["dashboard","status"]} />
          {/*<UserStatus user={ user }/>*/}
          <AnalystStat analyst={ user } />
          <div className="row">
            <div className="col-md-6">
              <AnalystRounds analystRounds={user_rounds} analystPayouts={payouts} tokens={tokens}/>
            </div>
            <div className="col-md-6">
              <AnalystPayouts analystPayouts={payouts}/>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <AnalystReferrals timestamp={ cronInfo } analyst={ user } />
            </div>
          </div>
        </main>
      </AnimatedView>
    )
  }
}

export default Status



/*

          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <img className="card-img-top" src="http://success-at-work.com/wp-content/uploads/2015/04/free-stock-photos.gif"/>
                <div className="card-block">
                  <figure className="profile">
                    <img src="http://success-at-work.com/wp-content/uploads/2015/04/free-stock-photos.gif" className="profile-avatar" alt=""/>
                  </figure>
                  <h4 className="card-title mt-3">User info</h4>
                  <div className="meta">
                    <a>Friends</a>
                  </div>
                  <div className="card-text">
                    Blah blah with some blah blah.
                  </div>
                </div>
                <div className="card-footer">
                  <small>Last updated 3 mins ago</small>
                  <button className="btn btn-secondary float-right btn-sm">show</button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <img className="card-img-top" 
                  src="https://cdn.history.com/sites/2/2014/02/redscare-H.jpeg"/>
                <div className="card-block">
                  <figure className="profile">
                    <img src="http://success-at-work.com/wp-content/uploads/2015/04/free-stock-photos.gif" className="profile-avatar" alt=""/>
                  </figure>
                  <h4 className="card-title mt-3">More info</h4>
                  <div className="meta">
                    <a>Friends</a>
                  </div>
                  <div className="card-text">
                    Blah blah also some blah blah
                  </div>
                </div>
                <div className="card-footer">
                  <small>Last updated 3 mins ago</small>
                  <button className="btn btn-secondary float-right btn-sm">show</button>
                </div>
              </div>
            </div>
          </div>
*/