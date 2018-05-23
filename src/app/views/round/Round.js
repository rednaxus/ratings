// @flow weak

import React, { PureComponent } from 'react'
import PropTypes          from 'prop-types'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { Panel } from 'react-bootstrap'
import * as _ from 'lodash'

import {
  AnimatedView,
  TokenSummary,
  Breadcrumb,
  BriefUpload
}                         from '../../components'

//import JuristSurvey from '../../components/juristSurvey'
import { JuristSurvey } from '../../components'

import config from '../../config/appConfig'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
async function showResults(values) {
  await sleep(500); // simulate server latency
  window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`);
}

class Round extends PureComponent {
  static propTypes= {
    actions: PropTypes.shape({
      enterRound: PropTypes.func.isRequired,
      leaveRound: PropTypes.func.isRequired
    })
  };

  state = { path: ['round'] };

  constructor( props ){
    super( props )
    this.onBriefUpload = this.onBriefUpload.bind( this )
  }

  componentWillMount() {
    const { actions: { enterRound } } = this.props
    enterRound()
  }

  componentWillUnmount() {
    const { actions: { leaveRound } } = this.props
    leaveRound()
  }


  componentWillReceiveProps() {
    if (this.idx === +this.props.match.params.id) return

    this.idx = +this.props.match.params.id
    console.log('component will receive props',this.idx)

    //const { actions: { fetchTokenData, fetchTokenRounds } } = this.props
    //const { actions: { fetchRoundInfo, fetchRoundAnalystInfo, fetchTokenRounds } } = this.props
    //fetchRoundInfo( this.idx )
    //fetchRoundAnalystInfo( this.idx )
    //fetchTokenRounds( this.idx ) 

    //fetchTokenData( this.idx )

  }
  onBriefUpload( filehash ) {
    const { rounds, actions: { setRoundInfo } } = this.props
    let round = {...rounds[_.findIndex(rounds,['id',this.idx])]}
    round.briefs[round.inround_id] = { timestamp:Math.round(+new Date() / 1000), filehash:filehash }

    setRoundInfo( round )
    this.forceUpdate()
  }

  render() {
    let i, token, round
    const { rounds, tokens, user } = this.props
    console.log('rounds are',rounds)
    i = _.findIndex(rounds,['id',this.idx])
    console.log('finding for id:',this.idx, 'found at',i)
    round = rounds[i] // == -1 ? {}: rounds[ i ]
    if (_.isEmpty(round)) {
      console.log('got empty round',round)
      return <div>fetching...</div>
    }
    i = _.findIndex(tokens,['id',round.covered_token])
    token = i == -1 ? {} : tokens[ i ]
    let analyst_status = config.STATUSES[round.analyst_status]
    let leadPosition = round.inround_id == 0 ? 'bull' : (round.inround_id == 1 ? 'bear' : '' )
    console.log('analyst status is',round.analyst_status, analyst_status)
    //analyst_status = 'brief due' // testing
    const getActivity = (analyst_status) => {
      switch(analyst_status) {
        case 'brief due' :
          return (<BriefUpload round={ round.id } roundAnalyst={ round.inround_id } onComplete={ this.onBriefUpload } />)
        case 'brief submitted' :
          return ('') //<Brief edit={true} />)
        case 'first survey due':
          return (
            <div>
              <div>Pre survey due by xxx</div>
              <JuristSurvey  
                round={ round.id } 
                pre={ true } 
                roundAnalyst={ round.inround_id }
                onSubmit={ showResults }
              />
            </div>
          )
        case 'first survey submitted':
          return ('') //(<Brief />)
        case 'second survey due':
          return(
            <div>
              <div>Post survey due by xxx</div>
              <JuristSurvey 
                round={ round.id } 
                roundAnalyst={ round.inround_id } 
                pre={ false }
              />
            </div> )
        case 'second survey submitted':
          return(<div>Round completion at xxx</div>)
      }
    }
    
    console.log('appconfig',config)
    
    return(
      <AnimatedView>
        <Breadcrumb path={["dashboard","eval-round"]} />
        <Panel>
          <Panel.Heading><Panel.Title>Evaluation Round</Panel.Title></Panel.Heading>
          <Panel.Body>
            <div>
              Round { this.idx } for token <Link to={"/token/"+token.id}><span className="text-success">{ token.name }</span></Link> with status <span className="text-danger">{ config.STATUSES[round.status] }</span>
            </div>
            <div className="row">
              <div className="col-md-4">Start: <Moment className="bg-green" format="YYYY-MM-DD HH:mm" date={ new Date(config.cycleTime(round.cycle,true)) } /></div>
              <div className="col-md-4"> Finish: <Moment className="bg-red" format="YYYY-MM-DD HH:mm" date={ new Date(config.cycleTime(round.cycle+4,true)) } /></div>
              <div className="col-md-4">Number of analysts: {round.num_analysts}</div>
            </div>
            <div className="row">
              <h2 className="text-center">My status in round => { analyst_status }&nbsp;{ round.inround_id < 2 ? `( ${leadPosition})`: '' }</h2>  
            </div>
            <div>{ getActivity( analyst_status ) }</div>
            <TokenSummary token={token} format="small" />
            <Panel>
              <Panel.Heading>Briefs submitted</Panel.Heading>
              <Panel.Body>
                <span>{ 
                  round.briefs[0].timestamp ? 
                    <a 
                      href={ config.ipfsRepoDownload+round.briefs[0].filehash }
                      target="_blank"
                    >Bull brief--
                      <Moment format="YYYY/MM/DD" date={ round.briefs[0].timestamp*1000 } />
                    </a>
                    : <span>Bull brief due by <Moment format="YYYY/MM/DD" /></span>
                }</span>
                <span className="pull-right">{ 
                  round.briefs[1].timestamp ? 
                    <a 
                      href={ config.ipfsRepoDownload+round.briefs[1].filehash }
                      target="_blank"
                    >Bear brief--
                      <Moment format="YYYY/MM/DD" date={ round.briefs[1].timestamp*1000 } />
                    </a>
                    : <span>Bear brief due by <Moment format="YYYY/MM/DD" /></span>
                }</span>
              </Panel.Body>
            </Panel>
            
          </Panel.Body>
        </Panel>


      </AnimatedView>
    )
  }
}

export default Round
