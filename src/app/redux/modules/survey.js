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
export const clearData = () => dispatch => {
  dispatch( { type: CLEAR_DATA } )
}

export const setData = (data) => dispatch => {
  dispatch( { type: SET_DATA, payload: data } )
}

export const setComplete = (isComplete) => dispatch => {
  dispatch( { type: SET_COMPLETE, payload: isComplete } )
}


