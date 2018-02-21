import React, { PureComponent } from 'react'

class UserStatus extends PureComponent {
  render() {
    const { user } = this.props
    const userFullName = `${user.firstname} ${user.lastname.toUpperCase()}`;
  	return (
        <div className="user-status-container">
          <div className="user-status">
            <div className="user-status-name">{ userFullName }</div>
            <div className="small">{ user.email }</div>
            <div className="user-info-box">reputation:{ user.reputation || "0" }</div>
            <div className="user-info-box">level:<span className="dog">{ user.level || "pawn" }</span></div>
          </div>
        </div>
   	)
  }
}

export default UserStatus
