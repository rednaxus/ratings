/*()
export const CLEAR_DATA = 'survey/CLEAR_DATA'
export const SET_DATA = 'survey/SET_DATA'
export const SET_COMPLETE = 'survey/SET_COMPLETE'


const initialState = {
  data: {},
  isComplete: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA:
      return { ...state, data: action.payload }
    case SET_COMPLETE:
      return { ...state, isComplete: action.payload }
    case CLEAR_DATA:
      return { ...state, data: {} }
    default:
      return state
  }
}

*/

import {
  SET_SURVEY_QUESTION_DATA,
  CLEAR_SURVEY_DATA
} from './actionTypes'

/*
export const clearData = () => dispatch => {
  dispatch( { type: CLEAR_DATA } )
}


*/

/*export const setData = (data) => dispatch => { // old way
  dispatch( { type: SET_DATA, payload: data } )
}
*/

export const clearQuestionData = () => dispatch => {
  dispatch( { type: CLEAR_SURVEY_DATA } )
}

export const setQuestionData = (num,val) => dispatch => {
  dispatch( { type: SET_SURVEY_QUESTION_DATA, questionData: { id: num, name: 'duh', value: val } } )
}

export const setComplete = () => dispatch => {
  dispatch( { type: SET_COMPLETE } )
}


