// @flow weak

import React, { PureComponent } from 'react'
import PropTypes          from 'prop-types'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { Panel } from 'react-bootstrap'
import { isEmpty } from 'lodash'

import {
  AnimatedView,
  TokenSummary,
  Breadcrumb,
  BriefUpload
}                         from '../../components'

//import { submitSurvey } from '../../redux/modules/rounds'

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
    this.onSurveySubmit = this.onSurveySubmit.bind( this )
  }

  componentWillMount() {
    const { actions: { enterRound } } = this.props
    enterRound()
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    const { actions: { leaveRound } } = this.props
    leaveRound()
  }


  componentWillReceiveProps() {
    if (this.idx === +this.props.match.params.id) return

    this.idx = +this.props.match.params.id
    //console.log('component will receive props',this.idx)

    const { actions: { fetchRoundInfo, fetchRoundAnalystInfo } } = this.props
    //console.log('call fech round info',this.idx)
    fetchRoundInfo(this.idx, true)
    fetchRoundAnalystInfo(this.idx)
    //const { actions: { fetchTokenData, fetchTokenRounds } } = this.props
    //const { actions: { fetchRoundInfo, fetchRoundAnalystInfo, fetchTokenRounds } } = this.props
    //fetchRoundInfo( this.idx )
    //fetchRoundAnalystInfo( this.idx )
    //fetchTokenRounds( this.idx ) 

    //fetchTokenData( this.idx )

  }
  onBriefUpload( filehash ) {
    const { rounds, actions: { setRoundInfo } } = this.props
    let round = { ...rounds[ rounds.findIndex( round => round.id == this.idx ) ] }
    round.briefs[round.inround_id] = { timestamp:Math.round(+new Date() / 1000), filehash:filehash }
    round.analyst_status = config.STATUSES.indexOf('brief submitted')
    setRoundInfo( round )
    this.forceUpdate()
  }

  onSurveySubmit( round, roundAnalyst, pre, answers ){
    //console.log('on survey submit',round, roundAnalyst, pre, answers)
    const { actions: { submitSurvey } } = this.props
    submitSurvey( round, roundAnalyst, pre, answers )

  }

  render() {
    let i, token, round
    const { rounds, timestamp, tokens, user } = this.props
    //console.log('rounds are',rounds)
    i = rounds.findIndex( round => round.id == this.idx )
    //console.log('finding for id:',this.idx, 'found at',i)
    const fetching = () => <div>fetching...</div>
    if ( i == -1) {
      console.log('no round yet',this.idx)
      return fetching()
    }
    round = rounds[i]
    if (!round.analyst_status || !round.status ) {
      return fetching()
    }

    i = tokens.findIndex( token => token.id == round.covered_token )
    token = i == -1 ? {} : tokens[ i ]
    let analyst_status = config.STATUSES[round.analyst_status]
    let leadPosition = round.inround_id == 0 ? 'bull' : (round.inround_id == 1 ? 'bear' : '' )
    //console.log('analyst status is',round.analyst_status, analyst_status)
    //analyst_status = 'brief due' // testing
    const getActivity = (analyst_status) => {
      switch(analyst_status) {
        case 'brief due' :
          return (<BriefUpload round={ round.id } roundAnalyst={ round.inround_id } onComplete={ this.onBriefUpload } />)
        case 'brief submitted' :
          return ('') //<Brief edit={true} />)
        case 'pre survey due':
          return (
            <div>
              <div>Pre survey due <Moment from={timestamp*1000}>{1000*(config.cycleTime(round.cycle) + config.cyclePhaseTime(1))}</Moment></div>
              <JuristSurvey  
                round={ round.id } 
                pre={ true } 
                roundAnalyst={ round.inround_id }
                onFinish={ this.onSurveySubmit }
              />
            </div>
          )
        case 'pre survey submitted':
          return ('') //(<Brief />)
        case 'post survey due':
          return(
            <div>
              <div>Post survey due <Moment from={timestamp*1000}>{1000*(config.cycleTime(round.cycle) + config.cyclePhaseTime(2))}</Moment></div>
              <JuristSurvey 
                round={ round.id } 
                roundAnalyst={ round.inround_id } 
                pre={ false }
                onFinish={ this.onSurveySubmit }
              />
            </div> )
        case 'post survey submitted':
          return(<div>Round completion <Moment from={timestamp*1000}>{1000*(config.cycleTime(round.cycle) + config.cyclePhaseTime(2))}</Moment></div>)
      }
    }
    
    //console.log('appconfig',config)
    
    return(
      <AnimatedView>
        <Breadcrumb path={["dashboard","eval-round"]} />
        <div className="row">
          <div className="col-md-8"><h4>Evaluation Round</h4></div>         
          <div className="col-md-4 text-right text-green small">
            <Moment format="YYYY-MM-DD HH:MM" date={timestamp * 1000}/>
          </div>
        </div>
        <div className="row">
          <h4 className="text-center"></h4>  
        </div>
        <Panel className="card card-style panel-active-large">
          <Panel.Heading>
            <Panel.Title><strong className="text-gray">My status in round => <span className="text-black">{ analyst_status }&nbsp;{ round.inround_id < 2 ? `( ${leadPosition})`: '' }</span></strong></Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <div className="row">
              <div className="col-md-6">Round { this.idx } for token <Link to={"/token/"+token.id}><span>{ token.name }</span></Link> (<span className="text-danger">{ config.STATUSES[round.status] }</span>)</div>
              <div className="col-md-6">Analysts: {round.num_analysts}</div>
            </div>
            <div className="row">
              <div className="col-md-6">Start: <Moment className="bg-green" from={timestamp*1000} date={ new Date(config.cycleTime(round.cycle,true)) } /></div>
              <div className="col-md-6"> Finish: <Moment className="bg-red" from={timestamp*1000} date={ new Date(config.cycleTime(round.cycle+2,true)) } /></div>
            </div>
            <div className="row">             
              <div className="col-md-6">
                { 
                  round.briefs[0].timestamp ? 
                    <a 
                      href={ config.ipfsRepoDownload+round.briefs[0].filehash }
                      target="_blank"
                    >Bull brief submitted--
                      <Moment from={timestamp*1000}>{ round.briefs[0].timestamp*1000 }</Moment>
                    </a>
                    : <span>Bull brief <Moment from={timestamp*1000}>{1000*(config.cycleTime(round.cycle)+config.cyclePhaseTime(1))}</Moment></span>
                }
              </div>
              <div className="col-md-6">
                { 
                  round.briefs[1].timestamp ? 
                    <a 
                      href={ config.ipfsRepoDownload+round.briefs[1].filehash }
                      target="_blank"
                    >Bear brief submitted--
                      <Moment from={timestamp*1000}>{ round.briefs[1].timestamp*1000 }</Moment>
                    </a>
                    : <span>Bear brief <Moment from={timestamp*1000}>{1000*(config.cycleTime(round.cycle)+config.cyclePhaseTime(1))}</Moment></span>
                }
              </div> 
            </div>
            </Panel.Body>
          </Panel>
        <div>{ getActivity( analyst_status ) }</div>
        <TokenSummary token={token} format="small" />
      </AnimatedView>
    )
  }
}

export default Round
