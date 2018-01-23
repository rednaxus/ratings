import { getRatingAgency as RatingAgency } from '../../services/contracts'

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
      ratingAgency.num_tokens()
      .then(result => {
        var numTokens = result.toNumber();
        console.log("result was:",numTokens);
        var tokensData = [{id:0,name:'a'},{id:1,name:'b'},{id:2,name:'c'},{id:3,name:'d'}]

        console.log('dummy tokens data',tokensData)
        dispatch(tokensFetched({"numTokens": numTokens, "tokensData": tokensData } ))
      })
      .catch(result => { console.error("Error from server:"  + result); })
    })


export default tokens
