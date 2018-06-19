// @flow weak

import React      from 'react'
import PropTypes  from 'prop-types'
import Moment from 'react-moment'
import { Panel } from 'react-bootstrap'

const TokenSummary = ( { token } ) => {
	const tokenLink = (address) => "https://etherscan.io/address/"+token.address
  return (
	  <Panel className="card card-style panel-active">
	    <Panel.Heading>
	      <Panel.Title><strong className="text-success">{token.name}</strong> => {token.symbol}</Panel.Title>
	    </Panel.Heading>
	    <Panel.Body>
	      <div className="row">
	        <div className="col-md-4">
	          { token.price && 
	            <div>
	              <div>rate: <span className="price-data">{token.price.rate}</span></div>
	              <div>diff: <span className="price-data">{token.price.diff}</span></div>
	              <div>ts: <span className="price-data">{token.price.ts}</span></div>
	              <div>volume(24): <span className="price-data">{token.price.volume24h}</span></div>
	              <div>currency: <span className="price-data">{token.price.currency}</span></div>
	              <div>available supply: <span className="price-data">{token.price.availableSupply}</span></div>
	              <div>market cap: <span className="price-data">{token.price.marketCapUsd}</span></div>
	            </div>
	            || ""
	          }
	          </div>
	        <div className = "col-md-4">      
	          <div>Updated: <Moment className="token-data" format="YYYY-MM-DD HH:mm" date={new Date(token.lastUpdated*1000)} /></div>
						<div>Decimals: <span className="token-data">{token.decimals}</span></div>
	          <div>Supply: <span className="token-data">{token.totalSupply}</span></div>
	          <div>Transfers: <span className="token-data">{token.transfersCount}</span></div>
	          <div>Holders: <span className="token-data">{token.holdersCount}</span></div>
	          <div>Ops: <span className="token-data">{token.countOps}</span></div>
	        </div>
	        <div className = "col-md-4">
	          <div><a className="small" href={tokenLink(token.address)}>{token.address}</a></div>
	          <div>{token.description && <a href={token.description}>description</a>}</div>
	        </div>
	      </div> 
	    </Panel.Body>
	  </Panel>
  )
}

TokenSummary.propTypes = {
}

TokenSummary.defaultProps = {
  token: {}
}

export default TokenSummary





