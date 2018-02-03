// @flow weak

/* eslint no-console:0 */
/* eslint consistent-return:0 */
import moment               from 'moment';
import { appConfig }        from '../../config';
import {  fetchMockCyclesData } from '../../services';
import { getCyclesData, getCronInfo } from '../../services/API';


const REQUEST_CYCLES_DATA   = 'REQUEST_CYCLES_DATA';
const RECEIVED_CYCLES_DATA  = 'RECEIVED_CYCLES_DATA';
const ERROR_CYCLES_DATA     = 'ERROR_CYCLES_DATA';

const REQUEST_CRON_INFO   = 'REQUEST_CRON_INFO';
const RECEIVED_CRON_INFO  = 'RECEIVED_CRON_INFO';
const ERROR_CRON_INFO     = 'ERROR_CRON_INFO';

const initialState = {
  isFetching: false,
  data:       [],
  croninfo:    0,
  time:       null
};

const cycles = (state = initialState, action) => {
  switch (action.type) {

  case REQUEST_CYCLES_DATA:
    return {
      ...state,
      isFetching: action.isFetching,
      time:       action.time
    }

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

  case REQUEST_CRON_INFO:
    return {
      ...state,
      time:       action.time
    }

  case RECEIVED_CRON_INFO:
    return {
      ...state,
      cronInfo: action.cronInfo,
      time:     action.time
    }

  case ERROR_CRON_INFO:
    return {
      ...state,
      time:   action.time
    }

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

const requestCyclesData = (time = moment().format()) => {
  return {
    type:       REQUEST_CYCLES_DATA,
    isFetching: true,
    time
  }
}

const receivedCyclesData = (data, time = moment().format()) => {
  return {
    type:       RECEIVED_CYCLES_DATA,
    isFetching: false,
    data,
    time
  }
}

const errorCyclesData = (time = moment().format()) => {
  return {
    type:       ERROR_CYCLES_DATA,
    isFetching: false,
    time
  }
}

const fetchCyclesData = () => {
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

const shouldFetchCyclesData = (state) => {
  const cyclesStore = state.cycles;
  console.log('should fetch',cyclesStore)
  // just check wether fetching (assuming data could be refreshed and should not persist in store)
  if (cyclesStore.isFetching) {
    return false;
  } else {
    return true;
  }
}


const requestCronInfo = (time = moment().format()) => {
  return {
    type:       REQUEST_CRON_INFO,
    time
  }
}

const receivedCronInfo = (cronInfo, time = moment().format()) => {
  return {
    type:       RECEIVED_CRON_INFO,
    cronInfo,
    time
  }
}

const errorCronInfo = (time = moment().format()) => {
  return {
    type:       ERROR_CRON_INFO,
    time
  }
}


export const fetchCronInfo = () => {
  console.log('fetch cron info')
  return dispatch => {
    dispatch(requestCronInfo())
    console.log('getting cron info from api')
    getCronInfo()
    .then(
      cronInfo => dispatch(receivedCronInfo(cronInfo)))
    .catch(
      error => dispatch(errorCronInfo(error))
    )
  }
}
