// @flow weak

/* eslint no-console:0 */
/* eslint consistent-return:0 */
import moment               from 'moment'

import { 
  getCyclesInfo,
  cycleSignup as signup,
  cycleConfirm as confirm
} from '../../services/API'
import { userActions } from './actions'
import {
  REQUEST_CYCLES_DATA,
  RECEIVED_CYCLES_DATA,
  ERROR_CYCLES_DATA,

  REQUEST_CYCLE_SIGNUP,
  RECEIVED_CYCLE_SIGNUP,
  ERROR_CYCLE_SIGNUP,

  REQUEST_CYCLE_CONFIRM,
  RECEIVED_CYCLE_CONFIRM,
  ERROR_CYCLE_CONFIRM
} from './actionTypes'

const initialState = {
  isFetching: false,
  data:       [],
  time:       null
}

const getUser = (state) => state.user.info ? state.user.info.id : 0

const cycles = (state = initialState, action) => {
  switch (action.type) {

  case REQUEST_CYCLES_DATA:
    return { ...state, isFetching: action.isFetching, time: action.time }

  case RECEIVED_CYCLES_DATA:
    return { ...state, isFetching: action.isFetching, data: [...action.data], time: action.time }

  case ERROR_CYCLES_DATA:
    return { ...state, isFetching: action.isFetching, time: action.time }

  default:
    return state;
  }
}
export default cycles

export const fetchCyclesDataIfNeeded = () => {
  return (dispatch, getState) => {
    //console.log('fetch cycles data if needed')
    if (shouldFetchCyclesData(getState())) {
      return dispatch(fetchCyclesData());
    }
  }
}

const fetchCyclesData = () => {
  const request = (time = moment().format()) => ( { type: REQUEST_CYCLES_DATA, isFetching: true, time } )
  const success = (data, time = moment().format()) => ( { type: RECEIVED_CYCLES_DATA, isFetching: false, data, time } )
  const failure = (time = moment().format()) => ( { type: ERROR_CYCLES_DATA, isFetching: false, time } )

  //console.log('fetch cycles data')
  return ( dispatch, getState ) => {
    dispatch(request())
    let user = getState().user
    let analyst = user.info ? user.info.id : 0
    //console.log('getting cycles data from api',' for analyst',analyst)
    getCyclesInfo( analyst ).then( 
      data => dispatch( success( data ) ) 
    ).catch( err => dispatch( failure( err ) ) )    
  }
}

const shouldFetchCyclesData = (state) => {
  return !state.cycles.isFetching
}




export const cycleSignup = ( cycle, role ) => {
  const request = (time = moment().format()) => ( { type: REQUEST_CYCLE_SIGNUP, time } )
  const success = (time = moment().format()) => ( { type: RECEIVED_CYCLE_SIGNUP, time } )
  const failure = (time = moment().format()) => ( { type: ERROR_CYCLE_SIGNUP, time } )
  return ( dispatch, getState ) => {
    dispatch(request())
    //console.log('signing up')
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
    //console.log('confirming')
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
  fetchCyclesData,
  cycleSignup,
  cycleConfirm
}
