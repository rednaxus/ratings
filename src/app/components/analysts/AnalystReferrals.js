import React, { Component } from 'react'


class AnalystReferrals extends Component {

  render() {
    const { analyst } = this.props
    return (
      <div className="panel panel-success card card-style">

        <div className="panel-heading">
          <h4 className="card-title mt-3">Referrals</h4>
        </div>

        <div className="panel-body">
          <div className="row">Referrals Made</div>
          { /*analystReferrals.map( (payout,idx) => 
            <div className="row infoRow" key={idx}>
              <div className="card-text">a row for payouts {payout.id} blah blah {payout.tokens} </div>
            </div>
          ) */}
          <div className="row">Referrals Joined</div>
          <div className="row">Referrals Available</div>

        </div>

      </div>
 
    )
  }
}

export default AnalystReferrals

