
import moment from 'moment'

import React from 'react'

import { Panel } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import {
  TabPanel,
  TabPanelHeader,
  TabPanelBody,
  TabPanelBodyContent
} from '../'

import survey from '../../services/survey'
import { tokenHistory } from '../../services/tokenomics'

const surveySections = survey.getSections()
const toDate = timestamp => moment(timestamp*1000).format('MM/DD/YY')

const TokenCategoriesDetail = ( { rounds, tokens } ) => {
  //console.log('tokens',tokens)

  /*const data = tokens.map( token => {
    let count = token.price && token.price.marketCapUsd ? token.price.marketCapUsd / 1000000000: 10
    return { id: token.id, value: token.name, count: count } 
  })
  */
  let header = surveySections.map( ( section,idx) => ( { name: section.name, tablink: `tab-panel-${idx}`, isActive: !idx } ) )
  let history = tokenHistory( rounds, tokens, 5 ) // last 5 
  //console.log('history',history)
  return (
    <Panel className="panel-info card card-style">
      <Panel.Heading className="card-title">Detail by group--recent 5 rounds</Panel.Heading>
      <Panel.Body className="card-text small">
        <TabPanel>
          <TabPanelHeader tabItems={header}/>
          <TabPanelBody>
          { surveySections.map( ( section, sIdx ) => 
            <TabPanelBodyContent key={sIdx} id={`tab-panel-${sIdx}`} isActive={sIdx==0}>
              <div className="row table-body small">
                <div className="col-md-1"><em>token</em></div> 
                { new Array(section.sectionLength).fill().map( ( _, aIdx ) => 
                  <div key={aIdx} className="col-md-1"><em>q{aIdx + section.startIndex}</em></div> 
                )}
              </div>
              <br/>
            { history.map( ( historyItem, idx ) => 
              <div key={idx} className="row table-body">
                <div className="col-md-1">
                  <Link to={ '/token/' + historyItem.token } >{ tokens.find( token=> token.id == historyItem.token ).name }</Link>
                </div>
                { new Array(section.sectionLength).fill().map( ( _, aIdx ) => 
                  <div key={aIdx} className="col-md-1">{historyItem.averages[1][aIdx + section.startIndex]}</div> 
                )}
              </div>
            )}
            </TabPanelBodyContent> ) }
          </TabPanelBody>
        </TabPanel>
      </Panel.Body>
    </Panel>

  )
}

export default TokenCategoriesDetail
