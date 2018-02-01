// @flow weak

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  AnimatedView,
  Panel,
  TokenList,
  TokenListItem
}                         from '../../components'

import { fetchTokensDataIfNeeded } from '../../redux/modules/tokens'
import { store } from '../../Root'

class TokenListView extends PureComponent {
  /* from old style react without redux
  state = {
    tokens: {
      numTokens: 2,
      data: [
        { 
          id: 0,
          name: 'Moolah0',
          addr: '0xxx'
        },
        {
          id: 1,
          name: 'Moolah1',
          addr: '0xxx'
        }  
      ]
    }
  }
  */
  
  componentWillMount() {
    const { actions: { enterTokenListView } } = this.props
    enterTokenListView()  
  }

  componentDidMount() {
    console.log('did mounts ')
    store.dispatch(fetchTokensDataIfNeeded())
  }
 
  componentWillUnmount() {
    const { actions: { leaveTokenListView } } = this.props
    leaveTokenListView()
  }

  onTokenListClick(event) {
      console.log('on token list click')
      event.preventDefault()
      store.dispatch(fetchTokensDataIfNeeded())
      // fetch
  }

  render() {
    const { tokens } = this.props;// state;

    return(
      <AnimatedView>
        <div className="row">
          {/*<a 
            href="#" 
            className="pure-link" 
            onClick={(event) => this.onTokenListClick(event)}
          >Fetch</a>*/}

          <div className="col-xs-8">
            <Panel
              hasTitle={true}
              title={'Token list'}
              sectionCustomClass="tasks-widget">
              <TokenList>
                {
                  tokens.data.map(
                    ({id, name, addr}, tokenIdx) => {
                      return (
                        <TokenListItem key={tokenIdx} id={id} name={name} addr={addr} />
                      )
                    }
                  )
                }
              </TokenList>
           </Panel>
          </div>
        </div>
      </AnimatedView>
    )
  }
}

TokenListView.propTypes= {
  actions: PropTypes.shape({
    enterTokenListView: PropTypes.func.isRequired,
    leaveTokenListView: PropTypes.func.isRequired
  })
};

export default TokenListView

/*

import { Link } from 'react-router-dom'

//import { Grid } from 'react-redux-grid'
//import Griddle from 'griddle-react';
// https://etherscan.io/token/0xf6f61f70ae1c4559459899300b17d2b2c77d39b5
const TokenList = ({ tokens, onTokenListClick }) => {
  console.log('tokens in component',tokens)
  return(
    <div>
      <a href="#" className="pure-link" onClick={(event) => onTokenListClick(event)}>Fetch</a>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{width: '10px'}}>#</th>
            <th style={{width: '200px'}}>Token Name</th>
            <th style={{width: '40px'}}>Etherscan</th>
          </tr>
        </thead>
        <tbody>
        { tokens.map(token => (
          <tr key={token.id}>
            <td>{token.id}</td>
            <td><Link to={"token/"+token.id}>{token.name}</Link></td>
            <td><a href={"https://etherscan.io/token/"+token.addr}><span className="badge bg.red">link</span></a></td>
          </tr>
         ))}
        </tbody>
      </table>
    </div>
  )
}
*/