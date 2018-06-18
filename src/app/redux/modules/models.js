/* eslint-disable default-case, no-shadow */
import { ORM, createReducer, createSelector, Model, many, fk, attr } from 'redux-orm'
import { PropTypes } from 'react'
import propTypesMixin from 'redux-orm-proptypes'
import {
  REQUEST_CYCLES_DATA,
  RECEIVED_CYCLES_DATA,
  ERROR_CYCLES_DATA,
  REQUEST_CRON_INFO,
  RECEIVED_CRON_INFO,
  ERROR_CRON_INFO,
  REQUEST_PULSE_CRON,
  RECEIVED_PULSE_CRON,
  ERROR_PULSE_CRON,
  REQUEST_CYCLE_SIGNUP,
  RECEIVED_CYCLE_SIGNUP,
  ERROR_CYCLE_SIGNUP,
  REQUEST_CYCLE_CONFIRM,
  RECEIVED_CYCLE_CONFIRM,
  ERROR_CYCLE_CONFIRM, 

  REQUEST_ROUNDS_FINISHED,
  RECEIVED_ROUNDS_FINISHED,
  ERROR_ROUNDS_FINISHED,
  REQUEST_ROUND_INFO,
  RECEIVED_ROUND_INFO,
  ERROR_ROUND_INFO,
  SET_ROUND_INFO,
  REQUEST_ROUND_ANALYST_INFO,
  RECEIVED_ROUND_ANALYST_INFO,
  ERROR_ROUND_ANALYST_INFO,
  REQUEST_SURVEY_SUBMIT,
  RECEIVED_SURVEY_SUBMIT,
  ERROR_SURVEY_SUBMIT,
  
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

const ValidatingModel = propTypesMixin(Model)
const s = '*****'



export class Cycle extends ValidatingModel {
  static reducer( action, Cycle, session ) {
    switch (action.type) {
    case REQUEST_CYCLES_DATA:
      break
    case RECEIVED_CYCLES_DATA:
      action.data.forEach( cycle => Cycle.upsert( cycle ) )
    case ERROR_CYCLES_DATA:
      break

    case REQUEST_CRON_INFO:
      break
    case RECEIVED_CRON_INFO:
      break

    case ERROR_CRON_INFO:
      break
    }
  }
}
Cycle.modelName = 'Cycle'
Cycle.fields = {
  id: attr()
}

export class Round extends ValidatingModel {
  static reducer( action, Round, session ) {
    const { type } = action

    switch (type) {

    case REQUEST_ROUNDS_FINISHED:
      break
    case RECEIVED_ROUNDS_FINISHED:
      //console.log(`${s}Receive rounds finished`)
      action.data.forEach( round => Round.upsert( round ) )
      break    
    case ERROR_ROUNDS_FINISHED:
      break
    case REQUEST_ROUND_INFO:
      break
    case RECEIVED_ROUND_INFO: 
    case SET_ROUND_INFO: 
      //console.log('round info action is',action)
      Round.upsert( action.roundInfo )
    case ERROR_ROUND_INFO:
      break
    case REQUEST_ROUND_ANALYST_INFO:
      break
    case RECEIVED_ROUND_ANALYST_INFO:
      Round.upsert( action.roundAnalystInfo )
      break
    case ERROR_ROUND_ANALYST_INFO:

    }
  }
}
Round.modelName = 'Round'
Round.fields = {
  id: attr(),
  covered_token: fk('Token')
}

export class Token extends ValidatingModel {
  static reducer( action, Token, session ) {
    const { type } = action
    switch (type) {

    case REQUEST_TOKENS_DATA:
      break
    case RECEIVED_TOKENS_DATA:
      console.log(`${s}tokens data`,action.data)
      action.data.forEach( token => Token.upsert( token ) )
      break
    case ERROR_TOKENS_DATA:
      break

    case REQUEST_TOKEN_DATA:
    case REQUEST_TOKEN_ROUNDS:
      break
    case RECEIVED_TOKEN_DATA: 
      Token.upsert( action.info )
      console.log(`${s}received token data`,action.info)
      break
    case RECEIVED_TOKEN_ROUNDS:
      console.log(`${s}received token rounds`)
      Token.upsert( action.info )
      break
    case ERROR_TOKEN_DATA:
    case ERROR_TOKEN_ROUNDS:
      console.log(`rtd`)
      break
    }
  }
}
Token.modelName = 'Token'
Token.fields = {
    id: attr(),
    name: attr(),
    rounds: many('Round','tokens')
}

export class SurveyQuestion extends ValidatingModel {
  static reducer( action, SurveyQuestion, session ) {
    const { type } = action
    switch (type) {

    }
  }
}
SurveyQuestion.modelName = 'SurveyQuestion'
SurveyQuestion.fields = {
    id: attr(),
    name: attr(),
    value: attr()
}

const orm = new ORM()

orm.register( Cycle, Round, Token, SurveyQuestion )




export default orm
