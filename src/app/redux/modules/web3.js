const initialState = {
  //web3Instance: null,
  ethAddress: null
}

const web3 = (state = initialState, action) => {

  switch(action.type) {
  
  /* defunct now
  case 'WEB3_INITIALIZED':
    return {
    	...state, 
    	web3Instance: action.payload.web3Instance 
    }
	*/

  // from Web3Provider react-web3
  case 'web3/RECEIVE_ACCOUNT':
    return {
      ...state,
      ethAddress: action.address
    }

  case 'web3/CHANGE_ACCOUNT':
    return {
      ...state,
      ethAddress: action.address
    }
  }

  return state

}

export default web3
