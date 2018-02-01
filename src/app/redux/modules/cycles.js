// @flow weak

/* eslint no-console:0 */
/* eslint consistent-return:0 */
import moment               from 'moment';
import { appConfig }        from '../../config';
import {  fetchMockCyclesData } from '../../services';
import { getCyclesData } from '../../services/API';


const REQUEST_CYCLES_DATA   = 'REQUEST_CYCLES_DATA';
const RECEIVED_CYCLES_DATA  = 'RECEIVED_CYCLES_DATA';
const ERROR_CYCLES_DATA     = 'ERROR_CYCLES_DATA';


const initialState = {
  isFetching: false,
  data:       [],
  time:       null
};

export default function cycles(state = initialState, action) {
  switch (action.type) {

  case REQUEST_CYCLES_DATA:
    return {
      ...state,
      isFetching: action.isFetching,
      time:       action.time
    };

  case RECEIVED_CYCLES_DATA:
    return {
      ...state,
      isFetching: action.isFetching,
      data:     [...action.data],
      time:       action.time
    };

  case ERROR_CYCLES_DATA:
    return {
      ...state,
      isFetching: action.isFetching,
      time:       action.time
    };

  default:
    return state;
  }
}

export function fetchCyclesDataIfNeeded() {
  return (dispatch, getState) => {
    console.log('fetch cycles data if needed')
    if (shouldFetchCyclesData(getState())) {
      return dispatch(fetchCyclesData());
    }
  };
}
function requestCyclesData(time = moment().format()) {
  return {
    type:       REQUEST_CYCLES_DATA,
    isFetching: true,
    time
  };
}
function receivedCyclesData(data, time = moment().format()) {
  return {
    type:       RECEIVED_CYCLES_DATA,
    isFetching: false,
    data,
    time
  };
}
function errorCyclesData(time = moment().format()) {
  return {
    type:       ERROR_CYCLES_DATA,
    isFetching: false,
    time
  };
}
function fetchCyclesData() {
  console.log('fetch cycles data')
  return dispatch => {
    dispatch(requestCyclesData());
    if (appConfig.DEV_MODE_ALT) {
      fetchMockCyclesData()
        .then(
          data => dispatch(receivedCyclesData(data))
        );
    } else {
      console.log('getting cycles data from api')
      getCyclesData()
      .then(
        data => dispatch(receivedCyclesData(data)))
      .catch(
        error => dispatch(errorCyclesData(error))
      );
    }
  };
}
function shouldFetchCyclesData(state) {
  const cyclesStore = state.cycles;
  console.log('should fetch',cyclesStore)
  // just check wether fetching (assuming data could be refreshed and should not persist in store)
  if (cyclesStore.isFetching) {
    return false;
  } else {
    return true;
  }
}
