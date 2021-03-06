import React, { PureComponent } from 'react'

class UserStatus extends PureComponent {
  render() {
    console.log('user status props',this.props)
    const { user } = this.props
    const userFullName = user.name
    //${user.firstname} /* ${user.lastname.toUpperCase()}`; */
  	return (
        <div className="user-status-container">
          <div className="user-status">
            <div className="user-status-name">{ userFullName }</div>
            <div className="small">{ user.email }</div>
            <div className="user-info-box">reputation:{ user.reputation || "0" }</div>
            <div className="user-info-box">level:<span className="dog">{ user.reputation >= 12 ? "lead" : "jurist" }</span></div>
          </div>
        </div>
   	)
  }
}

export default UserStatus
