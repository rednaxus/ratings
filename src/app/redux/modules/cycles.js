// @flow weak

/* eslint no-console:0 */
/* eslint consistent-return:0 */
import moment               from 'moment'

import { 
  getCyclesInfo, 
  getCronInfo, 
  pulseCron as pulse, 
  cycleSignup as signup,
  cycleConfirm as confirm
} from '../../services/API'
import { userActions } from './actions'

const REQUEST_CYCLES_DATA   = 'REQUEST_CYCLES_DATA'
const RECEIVED_CYCLES_DATA  = 'RECEIVED_CYCLES_DATA'
const ERROR_CYCLES_DATA     = 'ERROR_CYCLES_DATA'

const REQUEST_CRON_INFO     = 'REQUEST_CRON_INFO'
const RECEIVED_CRON_INFO    = 'RECEIVED_CRON_INFO'
const ERROR_CRON_INFO       = 'ERROR_CRON_INFO'

const REQUEST_PULSE_CRON    = 'REQUEST_PULSE_CRON'
const RECEIVED_PULSE_CRON   = 'RECEIVED_PULSE_CRON'
const ERROR_PULSE_CRON      = 'ERROR_PULSE_CRON'

const REQUEST_CYCLE_SIGNUP  = 'REQUEST_CYCLE_SIGNUP'
const RECEIVED_CYCLE_SIGNUP = 'RECEIVED_CYCLE_SIGNUP'
const ERROR_CYCLE_SIGNUP    = 'ERROR_CYCLE_SIGNUP'

const REQUEST_CYCLE_CONFIRM  = 'REQUEST_CYCLE_CONFIRM'
const RECEIVED_CYCLE_CONFIRM = 'RECEIVED_CYCLE_CONFIRM'
const ERROR_CYCLE_CONFIRM    = 'ERROR_CYCLE_CONFIRM'

const initialState = {
  isFetching: false,
  data:       [],
  cronInfo:    0,
  cron:       "", 
  time:       null
};

const getUser = (state) => state.user.info ? state.user.info.id : 0

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
  const request = (time = moment().format()) => ( { type: REQUEST_CYCLES_DATA, isFetching: true, time } )
  const success = (data, time = moment().format()) => ( { type: RECEIVED_CYCLES_DATA, isFetching: false, data, time } )
  const failure = (time = moment().format()) => ( { type: ERROR_CYCLES_DATA, isFetching: false, time } )

  console.log('fetch cycles data')
  return ( dispatch, getState ) => {
    dispatch(request())
    let user = getState().user
    let analyst = user.info ? user.info.id : 0
    console.log('getting cycles data from api',' for analyst',analyst)
    getCyclesInfo( analyst ).then( 
      data => dispatch( success( data ) ) 
    ).catch( err => dispatch( failure( err ) ) )    
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
  const request = (time = moment().format()) => ( { type: REQUEST_PULSE_CRON, time } )
  const success = (cron, time = moment().format()) => ( { type: RECEIVED_PULSE_CRON, cron, time } )
  const failure = (time = moment().format()) => ( { type: ERROR_PULSE_CRON, time } )  
  return dispatch => {
    dispatch(request())
    console.log('pulsing cron')
    pulse().then( cron => {
      dispatch( success(cron) ) 
      dispatch( fetchCronInfo() )
      dispatch( fetchCyclesData() )
    })
    .catch( error => dispatch( failure(error) ) )
  }
}

export const cycleSignup = ( cycle, role ) => {
  const request = (time = moment().format()) => ( { type: REQUEST_CYCLE_SIGNUP, time } )
  const success = (time = moment().format()) => ( { type: RECEIVED_CYCLE_SIGNUP, time } )
  const failure = (time = moment().format()) => ( { type: ERROR_CYCLE_SIGNUP, time } )
  return ( dispatch, getState ) => {
    dispatch(request())
    console.log('signing up')
    let analyst = getUser( getState() )
    signup( cycle, analyst, role ).then( result => {
      dispatch( success() ) 
      //dispatch( userActions.refreshInfo() )
      dispatch( fetchCyclesData() )
    })
    .catch( error => dispatch( failure(error) ) )
  }
}

export const cycleConfirm = ( cycle, role ) => {
  const request = (time = moment().format()) => ( { type: REQUEST_CYCLE_CONFIRM, time } )
  const success = (time = moment().format()) => ( { type: RECEIVED_CYCLE_CONFIRM, time } )
  const failure = (time = moment().format()) => ( { type: ERROR_CYCLE_CONFIRM, time } )
  return ( dispatch, getState ) => {
    dispatch(request())
    console.log('confirming')
    let analyst = getUser( getState() )
    confirm( cycle, analyst, role ).then( result => {
      dispatch( success() ) 
      //dispatch( userActions.refreshInfo() )
      dispatch( fetchCyclesData() )
    })
    .catch( error => dispatch( failure(error) ) )
  }
}

export const cycleActions = {
  fetchCronInfo,
  pulseCron,
  fetchCyclesData,
  cycleSignup,
  cycleConfirm
}
