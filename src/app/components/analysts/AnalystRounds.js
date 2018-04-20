import React, { Component } from 'react'


class AnalystRounds extends Component {
  //constructor(props, { user }) {
  constructor(props) {
    super(props)
  }

  render() {
    const { analystRounds } = this.props;
    return (
      <div className="panel panel-info card card-style">

        <div className="panel-heading">
          <h4 className="card-title mt-3">Involvement</h4>
        </div>

        <div className="panel-body cardFlex">
          { analystRounds.map( round => 
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
            see round
          </div>
        </div>
      </div>
 
    )
  }
}
export default AnalystRounds
