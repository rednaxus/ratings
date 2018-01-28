import React from 'react'
import { Link } from 'react-router-dom'

//import { Grid } from 'react-redux-grid'
//import Griddle from 'griddle-react';
// https://etherscan.io/token/0xf6f61f70ae1c4559459899300b17d2b2c77d39b5
const TokenList = ({ tokens, onTokenListClick }) => {
	console.log('tokens in component',tokens)
  return(
  	<div>
	  	<div className="panel">
	  		<div className="panel-heading">number of tokens: {tokens.tokensData.length}</div>
	  		<div className="panel-body">
			    <a href="#" className="pure-link" onClick={(event) => onTokenListClick(event)}>Fetch</a>
			    {/*<Griddle data={tokens.tokensData}/>*/}
		      <table className="table table-striped">
		        <thead>
		          <tr>
		            <th style={{width: '10px'}}>#</th>
		            <th style={{width: '200px'}}>Token Name</th>
		            <th style={{width: '40px'}}>Etherscan</th>
		          </tr>
		        </thead>
		        <tbody>
		        { tokens.tokensData.map(token => (
		          <tr key={token.id}>
		            <td>{token.id}</td>
		            <td><Link to={"token/"+token.id}>{token.name}</Link></td>
		            <td><a href={"https://etherscan.io/token/"+token.addr}><span className="badge bg.red">link</span></a></td>
		          </tr>
		         ))}
		        </tbody>
		      </table>
			  </div>
	    </div>
		</div>
  )
}

export default TokenList

