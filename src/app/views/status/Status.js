import React, { Component } from 'react'

import { store } from '../../Root'

import AnalystStat from '../analystStat'

import { 
  AnimatedView, 
  Breadcrumb, 
  UserStatus 
} from '../../components'

class Status extends Component {

  render() {
    const { userIsConnected, user } = this.props;
    const { currentView } = this.props;

    //const userFullName = `${userInfos.firstname} ${userInfos.lastname.toUpperCase()}`;
    console.log('props',this.props);
    return(
      <AnimatedView>
        <main className="container">
          <Breadcrumb path={["dashboard","status"]} />
          <UserStatus user={ user.info.user }/>
          <AnalystStat />
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
        </main>
      </AnimatedView>
    )
  }
}

export default Status