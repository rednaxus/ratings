// @flow weak

/* eslint no-console:0 */
/* eslint consistent-return:0 */
import moment               from 'moment';
import { appConfig }        from '../../config';
import {  fetchMockUsersData } from '../../services';
import { getUsersData } from '../../services/API';


const REQUEST_USERS_DATA   = 'REQUEST_USERS_DATA';
const RECEIVED_USERS_DATA  = 'RECEIVED_USERS_DATA';
const ERROR_USERS_DATA     = 'ERROR_USERS_DATA';


const initialState = {
  isFetching: false,
  data:       [],
  time:       null
};

export default function users(state = initialState, action) {
  switch (action.type) {

  case REQUEST_USERS_DATA:
    return {
      ...state,
      isFetching: action.isFetching,
      time:       action.time
    };

  case RECEIVED_USERS_DATA:
    return {
      ...state,
      isFetching: action.isFetching,
      data:     [...action.data],
      time:       action.time
    };

  case ERROR_USERS_DATA:
    return {
      ...state,
      isFetching: action.isFetching,
      time:       action.time
    };

  default:
    return state;
  }
}

export function fetchUsersDataIfNeeded() {
  return (dispatch, getState) => {
    console.log('fetch users data if needed')
    if (shouldFetchUsersData(getState())) {
      return dispatch(fetchUsersData());
    }
  };
}
function requestUsersData(time = moment().format()) {
  return {
    type:       REQUEST_USERS_DATA,
    isFetching: true,
    time
  };
}
function receivedUsersData(data, time = moment().format()) {
  return {
    type:       RECEIVED_USERS_DATA,
    isFetching: false,
    data,
    time
  };
}
function errorUsersData(time = moment().format()) {
  return {
    type:       ERROR_USERS_DATA,
    isFetching: false,
    time
  };
}
function fetchUsersData() {
  console.log('fetch users data')
  return dispatch => {
    dispatch(requestUsersData());
    if (appConfig.DEV_MODE_ALT) {
      fetchMockUsersData()
        .then(
          data => dispatch(receivedUsersData(data))
        );
    } else {
      console.log('getting users data from api')
      getUsersData()
      .then(
        data => dispatch(receivedUsersData(data)))
      .catch(
        error => dispatch(errorUsersData(error))
      );
    }
  };
}
function shouldFetchUsersData(state) {
  const usersStore = state.users;
  console.log('should fetch',usersStore)
  // just check wether fetching (assuming data could be refreshed and should not persist in store)
  if (usersStore.isFetching) {
    return false;
  } else {
    return true;
  }
}
