/* eslint-disable default-case, no-shadow */
import { ORM, createReducer, createSelector, Model, many, fk } from 'redux-orm'
import { PropTypes } from 'react'
import propTypesMixin from 'redux-orm-proptypes'
import {
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

export class Round extends ValidatingModel {
  static reducer( action, Round, session ) {
    const { data, type } = action
    switch (type) {
    case REQUEST_ROUNDS_FINISHED:
      console.log(`${s}Request rounds finished`)
      break
    case REQUEST_ROUND_INFO:
      console.log(`${s}Request round info`)
      break
    }
  }
}
Round.modelName = 'round'


export class Token extends ValidatingModel {
  static reducer( action, Token, session ) {
    const { data, type } = action
    switch (type) {

    case REQUEST_TOKENS_DATA:
      console.log(`rtd`)
      break
    case RECEIVED_TOKENS_DATA:
      console.log(`rtd`)
      break
    case ERROR_TOKENS_DATA:
      console.log(`rtd`)
      break

    case REQUEST_TOKEN_DATA:
    case REQUEST_TOKEN_ROUNDS:
      console.log(`rtd`)
      break
    case RECEIVED_TOKEN_DATA: 
      console.log(`rtd`)
      break
    case RECEIVED_TOKEN_ROUNDS:
      console.log(`rtd`)
      break
    case ERROR_TOKEN_DATA:
    case ERROR_TOKEN_ROUNDS:
      console.log(`rtd`)
      break
    }
  }
}
Token.modelName = 'token'

const orm = new ORM()

orm.register( Round, Token )

export default orm
