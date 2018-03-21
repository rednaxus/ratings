// @flow weak

/* eslint no-console:0 */
/* eslint consistent-return:0 */
import moment from 'moment'
import * as _ from 'lodash'

import { appConfig }        from '../../config'
//import {  fetchMockTokensData } from '../../services'
import { 
  getTokensData,
  getTokenData,
  getTokenRounds
} from '../../services/API'

const REQUEST_TOKENS_DATA   = 'REQUEST_TOKENS_DATA'
const RECEIVED_TOKENS_DATA  = 'RECEIVED_TOKENS_DATA'
const ERROR_TOKENS_DATA     = 'ERROR_TOKENS_DATA'

// ethplorer combined with veva
const REQUEST_TOKEN_DATA   = 'REQUEST_TOKEN_DATA' // getTokenInfo
const RECEIVED_TOKEN_DATA  = 'RECEIVED_TOKEN_DATA'
const ERROR_TOKEN_DATA     = 'ERROR_TOKEN_DATA'

const REQUEST_TOKEN_ROUNDS   = 'REQUEST_TOKEN_ROUNDS' // getTokenInfo
const RECEIVED_TOKEN_ROUNDS  = 'RECEIVED_TOKEN_ROUNDS'
const ERROR_TOKEN_ROUNDS     = 'ERROR_TOKEN_ROUNDS'

/*
getAddressInfo
getTxInfo
getTokenHistory
getAddressHistory
getAddressTransactions
getTop
getTopTokens
getTokenHistoryGrouped
getTokenPriceHistoryGrouped
*/

const initialState = {
  isFetching: false,
  data:       [],
  info: null,
  time:       null
}

export default function tokens(state = initialState, action) {
  let s, i

  switch (action.type) {

  case REQUEST_TOKENS_DATA:
    return {...state, isFetching: action.isFetching, time: action.time }
  case RECEIVED_TOKENS_DATA:
    return { ...state, isFetching: action.isFetching, data: [...action.data], time: action.time }
  case ERROR_TOKENS_DATA:
    return { ...state, isFetching: action.isFetching, time: action.time }


  case REQUEST_TOKEN_DATA:
  case REQUEST_TOKEN_ROUNDS:
    return {...state, time: action.time }
  case RECEIVED_TOKEN_DATA: // fix me
    s = { ...state, time: action.time }
    i = _.findIndex(s.data,['id',action.info.id])
    if (i==-1)
      s.data.push( action.info ) // add
    else
      s.data[i] = action.info // replace
    return s
  case RECEIVED_TOKEN_ROUNDS:
    s = { ...state, time: action.time }
    i = _.findIndex(s.data,['id',action.info.id])
    if (i==-1)
      s.data.push( action.info )
    else
      s.data[i].rounds = action.info.rounds
    return s
  case ERROR_TOKEN_DATA:
  case ERROR_TOKEN_ROUNDS:
    return { ...state, time: action.time }
  default:
    return state
  }
}

export function fetchTokensDataIfNeeded() {
  return (dispatch, getState) => {
    console.log('fetch tokens data if needed')
    if (shouldFetchTokensData(getState())) {
      return dispatch(fetchTokensData());
    }
  };
}

function requestTokensData(time = moment().format()) {
  return { type: REQUEST_TOKENS_DATA, isFetching: true, time }
}
function receivedTokensData(data, time = moment().format()) {
  return { type: RECEIVED_TOKENS_DATA, isFetching: false, data, time }
}
function errorTokensData(time = moment().format()) {
  return { type: ERROR_TOKENS_DATA, isFetching: false, time }
}

function fetchTokensData() {
  console.log('fetch tokens data')
  return dispatch => {
    dispatch( requestTokensData() )
    console.log('getting tokens data from api')
    getTokensData().then(
      data => dispatch( receivedTokensData(data) )
    ).catch(
      error => dispatch( errorTokensData(error) )
    )
  }
}

function shouldFetchTokensData(state) {
  const tokensStore = state.tokens;
  console.log('should fetch',tokensStore)
  // just check wether fetching (assuming data could be refreshed and should not persist in store)
  if (tokensStore.isFetching) {
    return false;
  } else {
    return true;
  }
}





export const fetchTokenData = ( id ) => {
  const request = ( id, time = moment().format() ) => {
    return { type: REQUEST_TOKEN_DATA, id, time }
  }
  const receive = ( info, time = moment().format() ) => {
    return { type: RECEIVED_TOKEN_DATA, info, time }
  }
  const error = ( time = moment().format() ) => {
    return { type: ERROR_TOKEN_DATA, time }
  }
  console.log('fetch token data',id)
  return dispatch => {
    dispatch( request( id ) )
    //console.log('getting token info from ethplorer')
    getTokenData( id ).then(
      info => dispatch( receive( info ) )
    ).catch(
      err => dispatch( error( err ) )
    )
  }
}

export const fetchTokenRounds = ( id ) => {
  const request = ( id, time = moment().format() ) => {
    return { type: REQUEST_TOKEN_ROUNDS, id, time }
  }
  const receive = ( info, time = moment().format() ) => {
    return { type: RECEIVED_TOKEN_ROUNDS, info, time }
  }
  const error = ( time = moment().format() ) => {
    return { type: ERROR_TOKEN_ROUNDS, time }
  }
  console.log('fetch token data',id)
  return dispatch => {
    dispatch( request( id ) )
    //console.log('getting token info from ethplorer')
    getTokenRounds( id ).then(
      info => dispatch( receive( info ) )
    ).catch(
      err => dispatch( error( err ) )
    )
  }
}