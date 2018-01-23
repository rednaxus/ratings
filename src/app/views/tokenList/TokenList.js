import React from 'react'
//import { Grid } from 'react-redux-grid'
//import Griddle from 'griddle-react';

const TokenList = ({ tokens, onTokenListClick }) => {
	console.log('tokens in component',tokens)
  return(
  	<div className="panel panel-default">
  		<div className="panel-heading">number of tokens: {tokens.tokensData.length}</div>
  		<div className="panel-body">
		    <a href="#" className="pure-link" onClick={(event) => onTokenListClick(event)}>Fetch</a>
		    {/*<Griddle data={tokens.tokensData}/>*/}
			  <ul>
			  { tokens.tokensData.map(token => (
			  	<li key={token.id}>{token.name}</li>
			  ))}
			  </ul>
		  </div>
    </div>
  )
}

export default TokenList
/*
		    <li className="pure-menu-item">
		    </li>
*/
