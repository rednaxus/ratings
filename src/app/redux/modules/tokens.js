import { getRatingAgency as RatingAgency } from '../../services/contracts'
import { getTokenERC20 as TokenERC20 } from '../../services/contracts'

export const TOKENS_FETCHED = 'TOKENS_FETCHED'

const initialState = { tokens: { tokensData:[{id:'',name:''}], numTokens:0 } }

const tokens = (state = initialState, action) => {
  if ( action.type === TOKENS_FETCHED ) {
  	console.log('tokens fetch',action,state)
    return {...state,tokens:action.payload }
  }
  return state
}

const tokensFetched = tokens => {
  return {
    type: TOKENS_FETCHED,
    payload: tokens
  }
}

export const fetchTokens = () => 
  dispatch => 
    RatingAgency().then((ratingAgency) => {
      ratingAgency.apiTokenList()
      .then(result => {
        var tokenAddrs = JSON.parse(result)
        var numTokens = tokenAddrs.length
        //var tokensData = [{id:0,name:'a'},{id:1,name:'b'},{id:2,name:'c'},{id:3,name:'d'}]

        var tokensData = tokenAddrs.map((addr,i) => {
        	return {id:i,name:addr}
        })
        TokenERC20(tokensData[0].name).then((tokenERC20) => {
        	tokenERC20.name()
        	.then(result => {
        		console.log('got token with name',result)
        	})
        })
        console.log('tokens data',tokensData)
        console.log('result from server:',result)
        dispatch(tokensFetched({"numTokens": numTokens, "tokensData": tokensData } ))
      })
      .catch(result => { console.error("Error from server:"  + result); })
    })


export default tokens
