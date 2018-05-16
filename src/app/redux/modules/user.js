import { combineReducers }  from 'redux'
import { push } from 'react-router-redux'
import { userService } from '../../services/API/users'
import auth            from '../../services/auth'
import { 
  alertActions, 
  fetchRoundInfo, 
  fetchRoundAnalystInfo 
} from './actions'
//import Root from '../../Root'
import { store } from '../../Root'

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
  DELETE_FAILURE: 'USERS_DELETE_FAILURE',

  REFERRAL_SUBMIT_REQUEST: 'USERS_REFERRAL_SUBMIT_REQUEST',
  REFERRAL_SUBMIT_SUCCESS: 'USERS_REFERRAL_SUBMIT_SUCCESS',
  REFERRAL_SUBMIT_FAILURE: 'USERS_REFERRAL_SUBMIT_FAILURE'
}

const getInfo = (user_id) => { // get from id
  const request = userInfo => { return { type: userConstants.INFO_REQUEST, userInfo } }
  const success = userInfo => { return { type: userConstants.INFO_SUCCESS, userInfo } }
  const failure = error => { return { type: userConstants.INFO_FAILURE, error } }

  return dispatch => {
    dispatch(request({ user_id }))
    userService.info(user_id).then( userInfo => {
      dispatch(success(userInfo))
      //dispatch(push('/')) //history.push
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
    console.log('user',user)
    const user_id = user.authentication && user.authentication.id ? user.authentication.id : 0
    dispatch( request( { user_id } ) )
    return new Promise( (resolve,reject) => {
      const returnError = ( err ) => {
        dispatch( failure( err ) )
        reject( err )
      }
      const returnSuccess = ( userInfo ) => {
        dispatch( success( userInfo ) )
        resolve( userInfo )
      }
      userService.info( user_id ).then( userInfo => {
        console.log('refreshInfo, got info',userInfo)
        if ( !deep ) returnSuccess( userInfo )
        else {
          userService.getAnalystRounds( userInfo ).then( rounds => {
            userInfo.rounds = rounds
            let numFetches = 0
            let allRounds = [ ...rounds.active,...rounds.finished ]
            if ( !allRounds.length ) returnSuccess( userInfo )
            allRounds.forEach( round => {
              numFetches++
              fetchRoundInfo( round )( dispatch, getState ).then( roundInfo => {
                console.log('got round info', round, roundInfo )
                fetchRoundAnalystInfo( round, user_id )( dispatch, getState ).then( ( roundAnalystInfo ) => {
                  console.log('got round analyst info', round, roundAnalystInfo )
                  if ( !--numFetches ) returnSuccess( userInfo )
                })
              })
            })
          }).catch( returnError )
        }
      }).catch( returnError )
    })

  }
}

const login = ( email, password, reload = true ) => {
  const request = user => ( { type: userConstants.LOGIN_REQUEST, user } )
  const success = user => ( { type: userConstants.LOGIN_SUCCESS, user } )
  const failure = error => ( { type: userConstants.LOGIN_FAILURE, error } )

  return (dispatch,getState) => {
    dispatch(request({ email }))
    userService.login( email, password ).then(
      user => {
        dispatch(success( user ))

        //dispatch(getInfo(user.id))
        if (reload) {
          dispatch(push('/')) //history.push
          window.location.reload()
        }
        else refreshInfo()(dispatch,getState).then( userInfo => { 
          console.log('got user info',userInfo) 
        })
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

const register = ( email, password, regcode = '' ) => {
  const request = email => ( { type: userConstants.REGISTER_REQUEST, email } )
  const success = email => ( { type: userConstants.REGISTER_SUCCESS, email } )
  const failure = error => ( { type: userConstants.REGISTER_FAILURE, error } )

  return dispatch => {
    dispatch( request( email ) )
    userService.register( email, password, regcode ).then(
      email => { 
        dispatch( success( email ) );
        dispatch(alertActions.success('Registration successful'))
        dispatch( push('/login') )
      },
      error => {
        dispatch(failure(error))
        dispatch(alertActions.error(error))
      }
    )
  }
}

const referralSubmit = ( analyst, email, identity, regcode ) => {
  const request = user => ( { type: userConstants.REFERRAL_SUBMIT_REQUEST, user } )
  const success = user => ( { type: userConstants.REFERRAL_SUBMIT_SUCCESS, user } )
  const failure = error => ( { type: userConstants.REFERRAL_SUBMIT_FAILURE, error } )

  return dispatch => {
    dispatch( request( analyst ) )
    userService.referralSubmit( analyst, email, identity, regcode ).then(
      () => { 
        dispatch( alertActions.success( 'referral added' ) )
        dispatch( success() );
      },
      error => {
        dispatch( failure( error) )
        dispatch( alertActions.error( error ) )
      }
    )
  }
}
export const userActions = {
  login,
  logout,
  register,
  refreshInfo,
  referralSubmit
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

const initialInfoState = { infoFetching: false }
const info = (state = initialInfoState, action) => {
  switch (action.type) {
    case userConstants.INFO_REQUEST:
      console.log('info request',state)
      return { infoFetching: true } 
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
