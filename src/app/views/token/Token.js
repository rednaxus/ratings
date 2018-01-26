import React, { Component } from 'react'
import { AnimatedView } from '../../components'

class Token extends Component {

  render() {
    const { currentView } = this.props;

    console.log('props',this.props);
    return(
      <AnimatedView>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Token Page for token {this.props.match.params.token_id}</h1>
            </div>
          </div>
        </main>
      </AnimatedView>
    )
  }
}

export default Token