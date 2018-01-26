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
	    {/*
	   	<div className="panel">
		    <header className="panel-heading">
		      Tokens Covered <span className="dog small pull-right">Number of tokens: {tokens.tokensData.length }</span>
		    </header>
		    <div className="panel-body">
		      <table className="table table-striped">
		        <thead>
		          <tr>
		              <th style={{width: '10px'}}>#</th>
		              <th>Task</th>
		              <th>Progress</th>
		              <th style={{width: '40px'}}>Label</th>
		          </tr>
		        </thead>
		        <tbody>
		          <tr>
		            <td>1.</td>
		            <td>Update software</td>
		            <td>
		              <div className="progress xs">
		                <div
		                  className="progress-bar progress-bar-danger"
		                  style={{width: '55%'}}>
		                </div>
		              </div>
		            </td>
		            <td><span className="badge bg-red">55%</span></td>
		          </tr>
		          <tr>
		            <td>2.</td>
		            <td>Clean database</td>
		            <td>
		              <div className="progress xs">
		                <div
		                  className="progress-bar progress-bar-yellow"
		                  style={{width: '70%'}}>
		                </div>
		              </div>
		            </td>
		            <td><span className="badge bg-yellow">70%</span></td>
		          </tr>
		          <tr>
		            <td>3.</td>
		            <td>Cron job running</td>
		            <td>
		              <div className="progress xs progress-striped">
		                <div
		                  className="progress-bar progress-bar-primary"
		                  style={{width: '30%'}}>
		                </div>
		              </div>
		            </td>
		            <td><span className="badge bg-light-blue">30%</span></td>
		          </tr>
		          <tr>
		            <td>4.</td>
		            <td>Fix and squish bugs</td>
		            <td>
		              <div className="progress xs progress-striped">
		                <div
		                  className="progress-bar progress-bar-success"
		                  style={{width: '90%'}}>
		                </div>
		              </div>
		            </td>
		            <td><span className="badge bg-green">90%</span></td>
		          </tr>
		        </tbody>
		      </table>

		    </div>
		  </div>
			*/}
		</div>
  )
}

export default TokenList
/*
		    <li className="pure-menu-item">
		    </li>
*/
