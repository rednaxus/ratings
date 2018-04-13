// @flow weak

/* eslint no-console:0 */
/* eslint consistent-return:0 */
import moment               from 'moment'
import * as _ from 'lodash'
import { appConfig }        from '../../config'
import { getRoundInfo, getRoundAnalystInfo } from '../../services/API'
import { fetchTokenData }  from './tokens'

//import { store } from '../../Root'

const REQUEST_ROUNDS_DATA   = 'REQUEST_ROUNDS_DATA'
const RECEIVED_ROUNDS_DATA  = 'RECEIVED_ROUNDS_DATA'
const ERROR_ROUNDS_DATA     = 'ERROR_ROUNDS_DATA'

const REQUEST_ROUND_INFO   = 'REQUEST_ROUND_INFO'
const RECEIVED_ROUND_INFO  = 'RECEIVED_ROUND_INFO'
const ERROR_ROUND_INFO     = 'ERROR_ROUND_INFO'

const REQUEST_ROUND_ANALYST_INFO   = 'REQUEST_ROUND_ANALYST_INFO'
const RECEIVED_ROUND_ANALYST_INFO  = 'RECEIVED_ROUND_ANALYST_INFO'
const ERROR_ROUND_ANALYST_INFO     = 'ERROR_ROUND_ANALYST_INFO'

const REQUEST_SURVEY_SUBMIT  = 'REQUEST_SURVEY_SUBMIT'
const RECEIVED_SURVEY_SUBMIT  = 'RECEIVED_SURVEY_SUBMIT'
const ERROR_SURVEY_SUBMIT     = 'ERROR_SURVEY_SUBMIT'

const initialState = {
  isFetching: false,
  data:       [], // rounds
  round: { status:0 }, 
  time:       null
};

const rounds = (state = initialState, action) => {
  let s, i

  switch (action.type) {

  case REQUEST_ROUNDS_DATA:
    return { ...state, isFetching: action.isFetching, time: action.time }
  case RECEIVED_ROUNDS_DATA:
    return { ...state, isFetching: action.isFetching, data: [...action.data], time: action.time }
  case ERROR_ROUNDS_DATA:
    return { ...state, isFetching: action.isFetching, time: action.time }

  case REQUEST_ROUND_INFO:
    return { ...state, time: action.time }
  case RECEIVED_ROUND_INFO: // fix me!!
    console.log('round info action is',action)
    s = { data:[], ...state, time: action.time }
    i = _.findIndex(s.data,['id',action.roundInfo.id])
    if (i==-1)
      s.data.push( action.roundInfo ) // add
    else
      s.data[i] = {...s.data[i], ...action.roundInfo} // merge
    return s
    //return {...state, round: action.roundInfo, time: action.time }
  case ERROR_ROUND_INFO:
    return {...state, time: action.time }

  case REQUEST_ROUND_ANALYST_INFO:
    return { ...state, time: action.time }
  case RECEIVED_ROUND_ANALYST_INFO:
    console.log('round analyst action is',action) 
    s = { data:[], ...state, time: action.time }
    i = _.findIndex(s.data,['id',action.roundAnalystInfo.id])
    if (i==-1)
      s.data.push( action.roundAnalystInfo ) // add
    else
      s.data[i] = {...s.data[i], ...action.roundAnalystInfo} // merge    
    return s
  case ERROR_ROUND_ANALYST_INFO:
    return {...state, time: action.time }

  default:
    return state;
  }
}
export default rounds

/*
export const fetchRoundsDataIfNeeded = () => {
  return (dispatch, getState) => {
    console.log('fetch rounds data if needed')
    if (shouldFetchRoundsData(getState())) {
      return dispatch(fetchRoundsData())
    }
  }
}

const fetchRoundsData = () => {
  const request = (time = moment().format()) => {
    return { type: REQUEST_ROUNDS_DATA, isFetching: true, time }
  }
  const success = (data, time = moment().format()) => {
    return { type: RECEIVED_ROUNDS_DATA, isFetching: false, data, time }
  }
  const failure = (time = moment().format()) => { 
    return { type: ERROR_ROUNDS_DATA, isFetching: false, time }
  }

  console.log('fetch rounds data')
  return dispatch => {
    dispatch(request())
      console.log('getting rounds data from api')
      getRoundsData()
      .then( data => dispatch(success(data)) )
      .catch( error => dispatch(failure(error)) )    
  }
}

const shouldFetchRoundsData = (state) => {
  return !state.rounds.isFetching
}

*/
export const fetchRoundInfo = ( round ) => {
  const request = (time = moment().format()) => {
    return { type: REQUEST_ROUND_INFO, time }
  }
  const success = (roundInfo, time = moment().format()) => {
    return { type: RECEIVED_ROUND_INFO, roundInfo, time }
  }
  const failure = (time = moment().format()) => {
    return { type: ERROR_ROUND_INFO, time }
  }
  return dispatch => {
    dispatch( request() )
    getRoundInfo(round).then( roundInfo => {
      dispatch( success( roundInfo ) ) 
      dispatch( fetchTokenData( roundInfo.covered_token ) )

    })
    .catch( error => dispatch( failure(error) ) )
  }
}

const getUser = (state) => state.user.info ? state.user.info.id : 0

export const fetchRoundAnalystInfo = ( round, analyst = -1 ) => {
  const request = (time = moment().format()) => {
    return { type: REQUEST_ROUND_ANALYST_INFO, time }
  }
  const success = (roundAnalystInfo, time = moment().format()) => {
    return { type: RECEIVED_ROUND_ANALYST_INFO, roundAnalystInfo, time }
  }
  const failure = (time = moment().format()) => {
    return { type: ERROR_ROUND_ANALYST_INFO, time }
  }
  return (dispatch,getState) => {
    dispatch( request() )
    getRoundAnalystInfo(round, analyst==-1 ? getUser(getState()) : analyst).then( roundAnalystInfo => {
      dispatch( success( roundAnalystInfo ) ) 
    })
    .catch( error => dispatch( failure(error) ) )
  }
}


const toHexString = (byteArray) => {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}
/*        uint8 _analyst, // analyst by round index
        uint8 _idx,              // pre (0), or post (1)
        bytes32 _answers,
        byte _qualitatives,
        uint8 _recommendation,
        bytes32 _comment
    )
*/
export const submitSurvey = ( round, analyst, pre, data ) => {
  const request = ( time = moment().format() ) => ( { type: REQUEST_SURVEY_SUBMIT, time } )
  const success = ( time = moment().format() ) => ( { type: RECEIVED_SURVEY_SUBMIT, time } )
  const failure = (time = moment().format()) => ( { type: ERROR_SURVEY_SUBMIT, time } )
  
  return (dispatch,getState) => {
    dispatch( request() )
    let bytes32 = toHexString( data )
    console.log('data',data,'bytes32',bytes32)
  }
}

export const roundActions = {
  fetchRoundInfo,
  fetchRoundAnalystInfo,
  submitSurvey
}
