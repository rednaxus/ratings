// @flow weak

import axios  from 'axios';
import { 
  getRatingAgency as RatingAgency,
  getAnalystRegistry as AnalystRegistry
} from '../../services/contracts'

export const FETCH_MOCK = 'FETCH_MOCK';
export const FETCH      = 'FETCH';
export const FETCH_ETHER = 'FETCH_ETHER'
//
// FETCH_MOCK mode
// in any action just add fetch object like:
// {
//  fetch: {
//    type: 'FETCH_MOCK',
//    actionTypes: {
//      request: 'TYPE_FOR_REQUEST',
//      success: 'TYPE_FOR_RECEIVED',
//      fail: 'TYPE_FOR_ERROR',
//    },
//    mockResult: any
//  }
// }
//

// FETCH mode
// in any action just add fetch object like:
// {
//  fetch: {
//    type: 'FETCH',
//    actionTypes: {
//      request: 'TYPE_FOR_REQUEST',
//      success: 'TYPE_FOR_RECEIVED',
//      fail: 'TYPE_FOR_ERROR',
//    },
//    url: 'an url',
//    method: 'get',  // lower case, one of 'get', 'post'...
//    headers: {}     // OPTIONAL CONTENT like: data: { someprop: 'value ...}
//    options: {}     // OPTIONAL CONTENT like: Authorization: 'Bearer _A_TOKEN_'
//  }
// }
//
//
//
//
const fetchMiddleware = store => next => action => {
  if (!action.fetch) {
    return next(action);
  }

  if (!action.fetch.type ||
      !action.fetch.type === FETCH_MOCK ||
      !action.fetch.type === FETCH || 
      !action.fetch.type === FETCH_ETHER) {
    return next(action);
  }
  console.log('fetch middlewares',action)
  if (!action.fetch.actionTypes) {
    return next(action);
  }

  /**
   * fetch mock
   * @type {[type]}
   */
  if (action.fetch.type === FETCH_MOCK) {
    if (!action.fetch.mockResult) {
      throw new Error('Fetch middleware require a mockResult payload when type is "FETCH_MOCK"');
    }

    const {
      actionTypes: {request, success},
      mockResult
    } = action.fetch;

    // request
    console.log('dispatching with type:',request)
    store.dispatch({ type: request });

    // received successful for mock
    console.log('fetch middle resolve',mockResult)
    return Promise.resolve(
      store.dispatch({
        type:     success,
        payload:  mockResult
      })
    );
  }

  if (action.fetch.type === FETCH) {
    const {
      actionTypes: {request, success, fail},
      url,
      method,
      headers,
      options
    } = action.fetch;

    // request
    store.dispatch({ type: request });

    // fetch server (success or fail)
    // returns a Promise
    return axios.request({
      method,
      url,
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...headers
      },
      ...options
    })
      .then(data => store.dispatch({type: success, payload: data}))
      .catch(
        err => {
          store.dispatch({type: fail, error: err});
          return Promise.reject(err);
        }
      );
  }

  if (action.fetch.type === FETCH_ETHER) {
    const {
      actionTypes: {request, success, fail},
      url,
      method,
      headers,
      options
    } = action.fetch;

    // request
    store.dispatch({ type: request });
    
    let web3 = window.web3

    // fetch server (success or fail)
    // returns a Promise
    return new Promise((resolve,reject) => {

      AnalystRegistry().then( analystRegistry => {
        console.log('logging in with user',options.data.login,web3.fromAscii(options.data.login),web3.fromAscii(options.data.password))
        analystRegistry.login(
          web3.fromAscii(options.data.login),
          web3.fromAscii(options.data.password)
        ).then( response => {
          console.log('response',response)
          let id = response[0].toNumber()
          let email = web3.toAscii(response[1])
          let reputation = response[2].toNumber()
          let token_balance = response[3].toNumber()
          console.log('results',id,email,reputation,token_balance)
          store.dispatch( {
            type: success, 
            payload: { 
              token:'blah', 
              data: { 
                id: id, 
                login: options.data.login, 
                email: email, 
                reputation:reputation, 
                token_balance:token_balance 
              } 
            } 
          })
          //resolve('done')
        })
      })
    })
  }

  return next(action);
};

export default fetchMiddleware
