// @flow weak

import { appConfig }  from '../../config';

import { 
  getRatingAgency as RatingAgency,
  getTokenERC20 as TokenERC20 
} from '../contracts'

export const getTokensData = () => {
  /*
  const url = `${getLocationOrigin()}/${appConfig.teamMates.data.API}`;
  const options = {...defaultOptions};

  fetch(url, options)
  .then(checkStatus)
  .then(parseJSON)
  .then(data => data)
  .catch(error => error);
  */

  return new Promise((resolve,reject) => {
    console.log(' beginning tokens fetch')

    RatingAgency()
    .then((ratingAgency) => {
      ratingAgency.num_tokens()
      .then(result => {
        var numTokens = result.toNumber();
        console.log("result was:",numTokens);
        var numFetch = 0
        var tokensData = []
        for (var i = 0; i < numTokens; i++) {
          ratingAgency.coveredTokenInfo(i).then( raToken => { // idx, addr
            var res = {id:raToken[0].toNumber(),addr:raToken[1]}
            console.log('got address',res)
            TokenERC20(res.addr).then( tokenERC20 => {
              tokenERC20.name().then( name => {
                res.name = name
                tokensData.push(res)
                console.log('got token with name',name)
                if (++numFetch === numTokens) {
                  tokensData.sort( (a,b) => a.id - b.id)  
                  //dispatch(tokensFetched( ))
                  resolve(tokensData) // {numTokens: numTokens, data: tokensData });
                }
              })
            })
          })
        }
      })
      .catch(result => { 
        console.error("Error from server:"  + result) 
        reject(result)
      })
    })

  })


}
