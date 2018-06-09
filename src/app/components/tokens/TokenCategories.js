
import React from 'react'

import { Panel } from 'react-bootstrap'

import survey from '../../services/survey'
import { tokenHistory } from '../../services/tokenomics'

let surveySections = survey.getSections()

const TokenCategories = ( { rounds, tokens } ) => {
  console.log('tokens',tokens)

  /*const data = tokens.map( token => {
    let count = token.price && token.price.marketCapUsd ? token.price.marketCapUsd / 1000000000: 10
    return { id: token.id, value: token.name, count: count } 
  })
  */
  let history = tokenHistory( rounds, tokens, 5 ) // last 5 
  console.log('history',history)
  return (
    <Panel className="panel-info">
      <Panel.Heading>
        Token Summaries--recent 5 rounds
      </Panel.Heading>
      <Panel.Body>
        <div className="row">
          <div className="col-md-1">token</div>
          { surveySections.map( section => <div className="col-md-1">{section.name}</div> ) }
        </div>
        { history.map( historyItem => 
          <div className="row">
            <div className="col-md-1">{tokens.find( token=> token.id == historyItem.token ).name }</div>
            { historyItem.sectionAverages[1].map( avg => <div className="col-md-1">{avg}</div> ) }
          </div>
        )}
      </Panel.Body>
    </Panel>

  )
}


export default TokenCategories
