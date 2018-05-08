// @flow weak

import { appConfig }  from '../../config';

import { 
  getRatingAgency as RatingAgency,
  getTokenERC20 as TokenERC20 
} from '../contracts'

import { getTokenInfo } from './ethplorer'

export const dataSource = function getData({
    pageIndex, pageSize
}) {
  console.log('in data source')
  return new Promise((resolve,reject) => {
    console.log(' beginning tokens fetch', pageSize, pageIndex )
    pageSize = pageSize || 5
    pageIndex = pageIndex || 0
    RatingAgency().then( (ratingAgency) => {
      ratingAgency.num_tokens().then( result => {
        var numTokens = result.toNumber()
        console.log("result was:",numTokens)
   
        var tokensData = []
        let max = Math.min( pageIndex + pageSize, numTokens )
        let numFetch = max - pageIndex
        for (var i = pageIndex; i < max; i++) {
          getTokenData( i ).then( token => { // idx, addr
            tokensData.push( token )
            console.log('got token with name',token.name)
            if (!--numFetch) {
              tokensData.sort( (a,b) => a.id - b.id)  
              //dispatch(tokensFetched( ))
              resolve( { data:tokensData, total:numTokens } ) // {numTokens: numTokens, data: tokensData });
            }
          })
          .catch( err => {
            console.error("Error on token fetch")
            reject( err )
          })
        }
      })
      .catch( err => { 
        console.error("Error from server:"  + err) 
        reject( err )
      })
    })
  })
}

export default dataSource

export const getTokenData = ( i ) => {
  return new Promise((resolve,reject) => {
    RatingAgency().then( (ratingAgency) => {
      ratingAgency.tokenInfo( i ).then( raToken => { // idx, addr
        let token = {id:raToken[0].toNumber(),address:raToken[1]}
        getTokenInfo( token.address ).then( info => {
          info.data.id = token.id
          resolve( info.data )
        }).catch(result => { 
          console.error("Error from ethplorer:"  + result) 
          reject(result)
        })
      }).catch(result => { 
        console.error("Error from server:"  + result) 
        reject(result)
      })
    })
  })
}

export const getTokenRounds = ( i, startAt = 0 ) => {
  return new Promise((resolve,reject) => {
    RatingAgency().then( (ratingAgency) => {
      ratingAgency.roundsForToken( i, startAt ).then( raToken => { // idx, addr
        //console.log('raToken',raToken)
        let num_rounds = raToken[0].toNumber()
        let raRounds = raToken[1]
        let rounds = []
        for (var j = 0; j < num_rounds; j++ )
          rounds.push(raRounds[j].toNumber())
        resolve( { id:+i, rounds:rounds } )
      }).catch(result => { 
        console.error("Error from server:"  + result) 
        reject(result)
      })
    })
  })
}
/*
export const getTokensData = () => { // not used any more

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


.error("Error from server:"  + result) 
        reject(result)
      })
    })

  })


}

*/