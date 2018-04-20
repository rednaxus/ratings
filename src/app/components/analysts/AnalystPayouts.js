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
          <h4 className="card-title mt-3">Veva Token Payouts</h4>
        </div>

        <div className="panel-body cardFlex">
          { analystPayouts.map( round => 
            <div className="row card-text glyphStyle">
              <div>a row for round {round.id}</div>
            </div>
          )}
          <div className="card-text infoRow">
            <div>blah blah</div>
          </div>
        </div>

        <div className="meta">
          <div className="card-footer buttonFlex">
            see something
          </div>
        </div>
      </div>
 
    )
  }
}
export default AnalystPayouts
