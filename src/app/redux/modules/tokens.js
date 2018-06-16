// @flow weak

/* eslint no-console:0 */
/* eslint consistent-return:0 */
import moment from 'moment'
import * as _ from 'lodash'

//import {  fetchMockTokensData } from '../../services'
import { 
  getTokensInfo,
  getTokenInfo,
  getTokenRounds
} from '../../services/API'

import {
  REQUEST_TOKENS_DATA,
  RECEIVED_TOKENS_DATA,
  ERROR_TOKENS_DATA,
  REQUEST_TOKEN_DATA,
  RECEIVED_TOKEN_DATA,
  ERROR_TOKEN_DATA,
  REQUEST_TOKEN_ROUNDS,
  RECEIVED_TOKEN_ROUNDS,
  ERROR_TOKEN_ROUNDS
} from './actionTypes'

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
  case RECEIVED_TOKEN_DATA: 
    s = { data:[], ...state, time: action.time }
    i = _.findIndex(s.data,['id',action.info.id])
    if (i==-1)
      s.data.push( action.info ) // add
    else
      s.data[i] = {...s.data[i], ...action.info} // merge
    return s
  case RECEIVED_TOKEN_ROUNDS:
    s = { data:[], ...state, time: action.time }
    i = _.findIndex(s.data,['id',action.info.id])
    if (i==-1)
      s.data.push( action.info ) // add
    else 
      s.data[i].rounds = action.info.rounds // merge
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

const fetchTokensData = () => {
  const request = ( time = moment().format() ) => ({ type: REQUEST_TOKENS_DATA, isFetching: true, time })
  const received = ( data, time = moment().format() ) => ( { type: RECEIVED_TOKENS_DATA, isFetching: false, data, time } )
  const error = ( time = moment().format() ) => ( { type: ERROR_TOKENS_DATA, isFetching: false, time } )
  //console.log('fetch tokens data')
  return ( dispatch, getState ) => {
    //console.log('dispatching tokens request')
    dispatch( request() )
    //console.log('getting tokens data from api')
    return getTokensInfo( false ).then(
      data => {
        dispatch( received( data ) )
        return data
      }
    ).catch( err => dispatch( error( err ) ) )
  }
}

function shouldFetchTokensData( state ) {
  const tokensStore = state.tokens
  //console.log('should fetch',tokensStore)
  // just check wether fetching (assuming data could be refreshed and should not persist in store)
  return !tokensStore.isFetching
}

export const fetchTokenData = ( id, full=true ) => { // if full is set get all rounds as well
  const request = ( id, time = moment().format() ) => ( { type: REQUEST_TOKEN_DATA, id, time } )
  const receive = ( info, time = moment().format() ) => ( { type: RECEIVED_TOKEN_DATA, info, time } )
  const error = ( time = moment().format() ) => ( { type: ERROR_TOKEN_DATA, time } )

  //console.log('fetch token data',id)
  return ( dispatch, getState ) => {
    dispatch( request( id ) )
    if (full) dispatch( fetchTokenRounds( id ) )
    //console.log('getting token info from ethplorer')
    return getTokenInfo( id ).then( info => {
      dispatch( receive( info ) )
      return info
    })
    .catch( err => dispatch( error( err ) ) )
  }
}

export const fetchTokenRounds = ( id ) => {
  const request = ( id, time = moment().format() ) => ( { type: REQUEST_TOKEN_ROUNDS, id, time } )
  const receive = ( info, time = moment().format() ) => ( { type: RECEIVED_TOKEN_ROUNDS, info, time } )
  const error = ( time = moment().format() ) => ( { type: ERROR_TOKEN_ROUNDS, time } )
  //console.log('fetch token data',id)

  return ( dispatch, getState ) => {
    dispatch( request( id ) )
    //console.log('getting token info from ethplorer')
    return getTokenRounds( id ).then(
      info => {
        dispatch( receive( info ) )
        return info
      }
    ).catch( err => dispatch( error( err ) ) )
  }
}
