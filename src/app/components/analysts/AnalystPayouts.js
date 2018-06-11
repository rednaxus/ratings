import React, { Component } from 'react'
import { Panel } from 'react-bootstrap'
import Wallet from '../analysts/wallet.js'


class AnalystPayouts extends Component {
  //constructor(props, { user }) {
  constructor(props) {
    super(props)
  }

  render() {
    const { analystPayouts } = this.props;
    return (
      <Panel className="panel-success card card-style">

        <Panel.Heading>
          <h4 className="card-title mt-3"><i className="fa fa-certificate"/>&nbsp;Veva Wallet</h4>
        </Panel.Heading>

        <Panel.Body className="card-text">

        { /* 
        <div>
          payouts =>
        </div>

          { analystPayouts.map( (payout,idx) =>
            <div className="row infoRow" key={idx}>

              <div className="card-text">a row for payouts {payout.id} blah blah {payout.tokens} </div>
            </div>
          )}

          <hr />
          */}
          <Wallet />
        </Panel.Body>

      </Panel>

    )
  }
}
export default AnalystPayouts
