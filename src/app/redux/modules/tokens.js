// @flow weak

/* eslint no-console:0 */
/* eslint consistent-return:0 */
import moment               from 'moment';
import { appConfig }        from '../../config';
import {  fetchMockTokensData } from '../../services';
import { getTokensData } from '../../services/API';


const REQUEST_TOKENS_DATA   = 'REQUEST_TOKENS_DATA';
const RECEIVED_TOKENS_DATA  = 'RECEIVED_TOKENS_DATA';
const ERROR_TOKENS_DATA     = 'ERROR_TOKENS_DATA';


const initialState = {
  isFetching: false,
  data:       [],
  time:       null
};

export default function tokens(state = initialState, action) {
  switch (action.type) {

  case 'REQUEST_TOKENS_DATA':
    return {
      ...state,
      isFetching: action.isFetching,
      time:       action.time
    };

  case 'RECEIVED_TOKENS_DATA':
    return {
      ...state,
      isFetching: action.isFetching,
      data:     [...action.data],
      time:       action.time
    };

  case 'ERROR_TOKENS_DATA':
    return {
      ...state,
      isFetching: action.isFetching,
      time:       action.time
    };

  default:
    return state;
  }
}


export function fetchTokensDataIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchTokensData(getState())) {
      return dispatch(fetchTokensData());
    }
  };
}
function requestTokensData(time = moment().format()) {
  return {
    type:       REQUEST_TOKENS_DATA,
    isFetching: true,
    time
  };
}
function receivedTokensData(data, time = moment().format()) {
  return {
    type:       RECEIVED_TOKENS_DATA,
    isFetching: false,
    data,
    time
  };
}
function errorTokensData(time = moment().format()) {
  return {
    type:       ERROR_TOKENS_DATA,
    isFetching: false,
    time
  };
}
function fetchTokensData() {
  return dispatch => {
    dispatch(requestTokensData());
    if (appConfig.DEV_MODE) {
      fetchMockTokensData()
        .then(
          data => dispatch(receivedTokensData(data))
        );
    } else {
      getTokensData()
      .then(
        data => dispatch(receivedTokensData(data)))
      .catch(
        error => dispatch(errorTokensData(error))
      );
    }
  };
}
function shouldFetchTokensData(state) {
  const tokensStore = state.tokens;
  // just check wether fetching (assuming data could be refreshed and should not persist in store)
  if (tokensStore.isFetching) {
    return false;
  } else {
    return true;
  }
}
