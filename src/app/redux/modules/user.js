import { combineReducers }  from 'redux'
import { push } from 'react-router-redux'
import { userService } from '../../services/API/users'
import auth            from '../../services/auth'
import { alertActions } from './actions'

const userConstants = {
  REGISTER_REQUEST: 'USERS_REGISTER_REQUEST',
  REGISTER_SUCCESS: 'USERS_REGISTER_SUCCESS',
  REGISTER_FAILURE: 'USERS_REGISTER_FAILURE',

  LOGIN_REQUEST: 'USERS_LOGIN_REQUEST',
  LOGIN_SUCCESS: 'USERS_LOGIN_SUCCESS',
  LOGIN_FAILURE: 'USERS_LOGIN_FAILURE',
  
  LOGOUT: 'USERS_LOGOUT',

  GETALL_REQUEST: 'USERS_GETALL_REQUEST',
  GETALL_SUCCESS: 'USERS_GETALL_SUCCESS',
  GETALL_FAILURE: 'USERS_GETALL_FAILURE',

  DELETE_REQUEST: 'USERS_DELETE_REQUEST',
  DELETE_SUCCESS: 'USERS_DELETE_SUCCESS',
  DELETE_FAILURE: 'USERS_DELETE_FAILURE'    
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
        dispatch(push('/')) //history.push
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
        dispatch(push('/login'))
        dispatch(alertActions.success('Registration successful'))
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
  register
}

let user = JSON.parse(localStorage.getItem('user'));
const initialAuthState = user ? { loggedIn: true, user } : {};

const authentication = (state = initialAuthState, action) => {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.LOGIN_FAILURE:
      return {};
    case userConstants.LOGOUT:
      return {};
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
  registration
})

export default reducer
