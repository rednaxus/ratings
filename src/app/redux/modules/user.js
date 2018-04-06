import { combineReducers }  from 'redux'
import { push } from 'react-router-redux'
import { userService } from '../../services/API/users'
import auth            from '../../services/auth'
import { alertActions, fetchRoundInfo } from './actions'

const userConstants = {
  REGISTER_REQUEST: 'USERS_REGISTER_REQUEST',
  REGISTER_SUCCESS: 'USERS_REGISTER_SUCCESS',
  REGISTER_FAILURE: 'USERS_REGISTER_FAILURE',

  LOGIN_REQUEST: 'USERS_LOGIN_REQUEST',
  LOGIN_SUCCESS: 'USERS_LOGIN_SUCCESS',
  LOGIN_FAILURE: 'USERS_LOGIN_FAILURE',
  
  LOGOUT: 'USERS_LOGOUT',

  INFO_REQUEST: 'USERS_INFO_REQUEST',
  INFO_SUCCESS: 'USERS_INFO_SUCCESS',
  INFO_FAILURE: 'USERS_INFO_FAILURE',

  GETALL_REQUEST: 'USERS_GETALL_REQUEST',
  GETALL_SUCCESS: 'USERS_GETALL_SUCCESS',
  GETALL_FAILURE: 'USERS_GETALL_FAILURE',

  DELETE_REQUEST: 'USERS_DELETE_REQUEST',
  DELETE_SUCCESS: 'USERS_DELETE_SUCCESS',
  DELETE_FAILURE: 'USERS_DELETE_FAILURE'    
}

const getInfo = (user_id) => { // get from id
  const request = userInfo => { return { type: userConstants.INFO_REQUEST, userInfo } }
  const success = userInfo => { return { type: userConstants.INFO_SUCCESS, userInfo } }
  const failure = error => { return { type: userConstants.INFO_FAILURE, error } }

  return dispatch => {
    dispatch(request({ user_id }))
    userService.info(user_id).then( userInfo => {
      dispatch(success(userInfo))
      dispatch(push('/')) //history.push
    })
    .catch( error => {
      dispatch(failure(error))
      dispatch(alertActions.error(error))
    })
  }

}

export const refreshInfo = (deep = true) => { // get from id, deep means to get rounds too
  const request = userInfo => { return { type: userConstants.INFO_REQUEST, userInfo } }
  const success = userInfo => { return { type: userConstants.INFO_SUCCESS, userInfo } }
  const failure = error => { return { type: userConstants.INFO_FAILURE, error } }


  return (dispatch,getState) => {
    const user = getState().user
    const user_id = user.authentication && user.authentication.id ? user.authentication.id : 0
    dispatch( request( { user_id } ) )
    userService.info( user_id ).then( userInfo => {
      console.log('refreshInfo, got info',userInfo)
      if ( deep ) {
        userService.getAnalystRounds( userInfo ).then( rounds => {
          userInfo.rounds = rounds
          console.log('got rounds',rounds)
          rounds.scheduled.map( round => dispatch(fetchRoundInfo(round)) )
          rounds.active.map( round => dispatch(fetchRoundInfo(round)) )
          rounds.finished.map( round => dispatch(fetchRoundInfo(round)) )
          dispatch( success( userInfo ) )
        })
        .catch( error => {
          dispatch( failure( error ) )
        })
      }
      else dispatch( success( userInfo ) )
    })
    .catch( error => {
      dispatch( failure( error ) )
    })
  }
}

const login = (username, password) => {
  const request = user => { return { type: userConstants.LOGIN_REQUEST, user } }
  const success = user => { return { type: userConstants.LOGIN_SUCCESS, user } }
  const failure = error => { return { type: userConstants.LOGIN_FAILURE, error } }

  return dispatch => {
    dispatch(request({ username }))
    userService.login(username, password).then(
      user => {
        dispatch(success(user))
        dispatch(getInfo(user.id))
        //dispatch(push('/')) //history.push
      },
      error => {
        dispatch(failure(error))
        dispatch(alertActions.error(error))
      }
    )
  }

}

const logout = () => {
  userService.logout()
  return { type: userConstants.LOGOUT }
}

const register = (user,email,password) => {
  const request = (user) => { return { type: userConstants.REGISTER_REQUEST, user } }
  const success = (user) => { return { type: userConstants.REGISTER_SUCCESS, user } }
  const failure = (error) => { return { type: userConstants.REGISTER_FAILURE, error } }

  return dispatch => {
    dispatch(request(user))
    userService.register(user,email,password).then(
      user => { 
        dispatch(success());
        dispatch(alertActions.success('Registration successful'))
        dispatch(push('/login'))
      },
      error => {
        dispatch(failure(error))
        dispatch(alertActions.error(error))
      }
    )
  }
}

export const userActions = {
  login,
  logout,
  register,
  refreshInfo
}

let user = JSON.parse(localStorage.getItem('user'));
const initialAuthState = user ? { loggedIn: true, user } : {};

const authentication = (state = initialAuthState, action) => {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return { loggingIn: true, ...action.user }
    case userConstants.LOGIN_SUCCESS:
      return { loggedIn: true, ...action.user }
    case userConstants.LOGIN_FAILURE:
      return {}
    case userConstants.LOGOUT:
      return {}
    default:
      return state
  }
}

const initialInfoState = { infoFetching: false, user:{ info:{ id:0, showPicture:true, isConnected:true } } }
const info = (state = initialInfoState, action) => {
  switch (action.type) {
    case userConstants.INFO_REQUEST:
      return { } //infoFetching: true }
    case userConstants.INFO_SUCCESS:
      return { infoFetching: false, ...action.userInfo }
    case userConstants.INFO_FAILURE:
      return {}
    default:
      return state
  }
}

function registration(state = {}, action) {
  switch (action.type) {
    case userConstants.REGISTER_REQUEST:
      return { registering: true };
    case userConstants.REGISTER_SUCCESS:
      return {};
    case userConstants.REGISTER_FAILURE:
      return {};
    default:
      return state
  }
}


const reducer = combineReducers({
  authentication,
  registration,
  info
})

export default reducer
