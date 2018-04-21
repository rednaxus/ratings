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

        <div className="panel-body">
          { analystRounds.map( round => 
            <div className="row">
              <div className="card-text">a row for round {round.id}</div>
            </div>
          )}
        </div>

      </div>
 
    )
  }
}
export default AnalystRounds
