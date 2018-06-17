
import moment               from 'moment'

import config from '../../config/appConfig'


import {
  REQUEST_CRON_INFO,
  RECEIVED_CRON_INFO,
  ERROR_CRON_INFO,

  REQUEST_PULSE_CRON,
  RECEIVED_PULSE_CRON,
  ERROR_PULSE_CRON
} from './actionTypes'

import {  
  getCronInfo, 
  pulseCron as pulse
} from '../../services/API'

const initialState = {
  isFetching: false,
  timestamp:    config.ZERO_BASE_TIME,
  time:       null
}

const cron = (state = initialState, action) => {
  switch (action.type) {

  case REQUEST_CRON_INFO:
    return { ...state, time: action.time }

  case RECEIVED_CRON_INFO:
    return {...state, timestamp: action.cronInfo, time: action.time }

  case ERROR_CRON_INFO:
    return {...state, time: action.time }

  default:
    return state
  }
}
export default cron



export const fetchCronInfo = () => {
  const request = (time = moment().format()) => ( { type: REQUEST_CRON_INFO, time } )
  const success = (cronInfo, time = moment().format()) => ( { type: RECEIVED_CRON_INFO, cronInfo, time } )
  const failure = (time = moment().format()) => ( { type: ERROR_CRON_INFO, time } )
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
      //dispatch( fetchCyclesData() )
    })
    .catch( error => dispatch( failure(error) ) )
  }
}
