// @flow weak

/* eslint no-console:0 */
/* eslint consistent-return:0 */
import moment               from 'moment';
import { appConfig }        from '../../config';
import { getRoundInfo } from '../../services/API';

const REQUEST_ROUNDS_DATA   = 'REQUEST_ROUNDS_DATA'
const RECEIVED_ROUNDS_DATA  = 'RECEIVED_ROUNDS_DATA'
const ERROR_ROUNDS_DATA     = 'ERROR_ROUNDS_DATA'

const REQUEST_ROUND_INFO   = 'REQUEST_ROUND_INFO';
const RECEIVED_ROUND_INFO  = 'RECEIVED_ROUND_INFO';
const ERROR_ROUND_INFO     = 'ERROR_ROUND_INFO';


const initialState = {
  isFetching: false,
  data:       [], // rounds
  round: { status:0 }, 
  time:       null
};

const rounds = (state = initialState, action) => {
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
    return {...state, round: action.roundInfo, time: action.time }

  case ERROR_ROUND_INFO:
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
    dispatch(request())
    getRoundInfo(round).then( roundInfo => dispatch(success(roundInfo)) )
    .catch( error => dispatch( failure(error) ) )
  }
}


export const roundActions = {
  fetchRoundInfo
  //fetchRoundsData
}
