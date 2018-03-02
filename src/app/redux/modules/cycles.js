// @flow weak

/* eslint no-console:0 */
/* eslint consistent-return:0 */
import moment               from 'moment';
import { appConfig }        from '../../config';
import {  fetchMockCyclesData } from '../../services';
import { getCyclesData, getCronInfo, pulseCron as pulse } from '../../services/API';

const REQUEST_CYCLES_DATA   = 'REQUEST_CYCLES_DATA'
const RECEIVED_CYCLES_DATA  = 'RECEIVED_CYCLES_DATA'
const ERROR_CYCLES_DATA     = 'ERROR_CYCLES_DATA'

const REQUEST_CRON_INFO   = 'REQUEST_CRON_INFO';
const RECEIVED_CRON_INFO  = 'RECEIVED_CRON_INFO';
const ERROR_CRON_INFO     = 'ERROR_CRON_INFO';

const PULSE_CRON = 'PULSE_CRON'
const RECEIVED_CRON = "RECEIVED_CRON"
const ERROR_CRON = 'ERROR_CRON'

const initialState = {
  isFetching: false,
  data:       [],
  croninfo:    0,
  cron:       "", 
  time:       null
};

const cycles = (state = initialState, action) => {
  switch (action.type) {

  case REQUEST_CYCLES_DATA:
    return { ...state, isFetching: action.isFetching, time: action.time }

  case RECEIVED_CYCLES_DATA:
    return { ...state, isFetching: action.isFetching, data: [...action.data], time: action.time }

  case ERROR_CYCLES_DATA:
    return { ...state, isFetching: action.isFetching, time: action.time }

  case REQUEST_CRON_INFO:
    return { ...state, time: action.time }

  case RECEIVED_CRON_INFO:
    return {...state, cronInfo: action.cronInfo, time: action.time }

  case ERROR_CRON_INFO:
    return {...state, time: action.time }

  default:
    return state;
  }
}
export default cycles

export const fetchCyclesDataIfNeeded = () => {
  return (dispatch, getState) => {
    console.log('fetch cycles data if needed')
    if (shouldFetchCyclesData(getState())) {
      return dispatch(fetchCyclesData());
    }
  }
}

const fetchCyclesData = () => {
  const request = (time = moment().format()) => {
    return { type: REQUEST_CYCLES_DATA, isFetching: true, time }
  }
  const success = (data, time = moment().format()) => {
    return { type: RECEIVED_CYCLES_DATA, isFetching: false, data, time }
  }
  const failure = (time = moment().format()) => { 
    return { type: ERROR_CYCLES_DATA, isFetching: false, time }
  }

  console.log('fetch cycles data')
  return dispatch => {
    dispatch(request())
      console.log('getting cycles data from api')
      getCyclesData()
      .then( data => dispatch(success(data)) )
      .catch( error => dispatch(failure(error)) )    
  }
}

const shouldFetchCyclesData = (state) => {
  return !state.cycles.isFetching
}


export const fetchCronInfo = () => {
  const request = (time = moment().format()) => {
    return { type: REQUEST_CRON_INFO, time }
  }
  const success = (cronInfo, time = moment().format()) => {
    return { type: RECEIVED_CRON_INFO, cronInfo, time }
  }
  const failure = (time = moment().format()) => {
    return { type: ERROR_CRON_INFO, time }
  }
  return dispatch => {
    dispatch(request())
    getCronInfo().then( cronInfo => dispatch(success(cronInfo)) )
    .catch( error => dispatch( failure(error) ) )
  }
}

export const pulseCron = () => {
  const request = (time = moment().format()) => {
    return { type: PULSE_CRON, time }
  }
  const success = (cron, time = moment().format()) => {
    return { type: RECEIVED_CRON, cron, time }
  }
  const failure = (time = moment().format()) => {
    return { type: ERROR_CRON, time }
  }
  return dispatch => {
    dispatch(request())
    console.log('pulsing cron')
    pulse().then( cron => {
      dispatch( success(cron) ) 
      console.log('dispatching fetchCronInfo')
      dispatch( fetchCronInfo() )
      dispatch( fetchCyclesDataIfNeeded() )
    })
    .catch( error => dispatch( failure(error) ) )
  }
}

export const cycleActions = {
  fetchCronInfo,
  pulseCron,
  fetchCyclesData
}
