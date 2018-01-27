import React, { PureComponent } from 'react'
import { AnimatedView } from '../../components'

export class RoundCycles extends PureComponent {

  render() {
    return(
      <AnimatedView>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Round Cycles (TBI placeholder)</h1>
            </div>
          </div>
          <div className="panel panel-default">
            <div className="panel-heading">
            Active Round
            </div>
            <div className="panel-body">
              <div>Past Rounds</div>
              <div>Future Rounds</div>
            </div>
          </div>
        </main>
      </AnimatedView>
    )
  }
}




export default RoundCycles