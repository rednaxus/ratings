// @flow weak

/* eslint no-console:0 */
/* eslint consistent-return:0 */
import moment               from 'moment'
import { appConfig }        from '../../config'
import {  fetchMockTokensData } from '../../services'
import { getTokensData } from '../../services/API'
import { getTokenInfo } from '../../services/API'

const REQUEST_TOKENS_DATA   = 'REQUEST_TOKENS_DATA'
const RECEIVED_TOKENS_DATA  = 'RECEIVED_TOKENS_DATA'
const ERROR_TOKENS_DATA     = 'ERROR_TOKENS_DATA'

// from ethPlorer api
const REQUEST_TOKEN_INFO   = 'REQUEST_TOKEN_INFO' // getTokenInfo
const RECEIVED_TOKEN_INFO  = 'RECEIVED_TOKEN_INFO'
const ERROR_TOKEN_INFO     = 'ERROR_TOKEN_INFO'

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
  switch (action.type) {

  case REQUEST_TOKENS_DATA:
    return {...state, isFetching: action.isFetching, time: action.time }
  case RECEIVED_TOKENS_DATA:
    return { ...state, isFetching: action.isFetching, data: [...action.data], time: action.time }
  case ERROR_TOKENS_DATA:
    return { ...state, isFetching: action.isFetching, time: action.time }


  case REQUEST_TOKEN_INFO:
    return {...state, time: action.time }
  case RECEIVED_TOKEN_INFO: // fix me
    return { ...state, info: action.info, time: action.time }
  case ERROR_TOKEN_INFO:
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



const requestTokenInfo = ( tokenAddr, time = moment().format() ) => {
  return { type: REQUEST_TOKEN_INFO, tokenAddr, time }
}
const receivedTokenInfo = ( tokenAddr, info, time = moment().format() ) => {
  return { type: RECEIVED_TOKEN_INFO, tokenAddr, info, time }
}
const errorTokenInfo = ( tokenAddr, time = moment().format() ) => {
  return { type: ERROR_TOKEN_INFO, tokenAddr, time }
}

const fetchTokenInfo = ( tokenAddr ) => {
  console.log('fetch token info')
  return dispatch => {
    dispatch( requestTokenInfo() )
    console.log('getting token info from ethplorer')
    getTokenInfo( tokenAddr ).then(
      info => dispatch( receivedTokenInfo( tokenAddr, info ) )
    ).catch(
      error => dispatch( errorTokenInfo( error ) )
    )
  }
}
