import React, { Component } from 'react'


class AnalystPayouts extends Component {
  //constructor(props, { user }) {
  constructor(props) {
    super(props)
  }

  render() {
    const { analystPayouts } = this.props;
    return (
      <div className="panel panel-success card card-style">

        <div className="panel-heading">
          <h4 className="card-title mt-3">Veva Tokens Earned</h4>
        </div>

        <div className="panel-body">
          { analystPayouts.map( (payout,idx) => 
            <div className="row infoRow" key={idx}>
              <div className="card-text">a row for payouts {payout.id} blah blah {payout.tokens} </div>
            </div>
          )}
        </div>

      </div>
 
    )
  }
}
export default AnalystPayouts
