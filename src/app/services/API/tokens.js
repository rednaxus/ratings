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

export const getTokenData = (i, full=true ) => {
  return new Promise((resolve,reject) => {
    let web3 = window.web3
    RatingAgency().then( (ratingAgency) => {
      ratingAgency.tokenInfo( i ).then( raToken => { // idx, addr
        let i = 0
        let token = {
          id: raToken[ i++ ].toNumber(),
          address: raToken[ i++ ],
          name: web3.toAscii( raToken[ i++ ] ).replace(/\0/g,''),
          representative: raToken[ i++ ],
          timeperiod: raToken[ i++ ].toNumber(),
          timestamp: raToken[ i++ ].toNumber()
        }
        if ( !full ){
          resolve( token )
          return
        }
        getTokenInfo( token.address ).then( info => {
          //info.data.id = token.id
          resolve( { ...info.data, ...token } )
        }).catch( err => { 
          console.error("Error from ethplorer:"  + err ) 
          reject( err )
        })
      }).catch( err => { 
        console.error("Error from server:"  + err ) 
        reject( err )
      })
    })
  })
}

export const getTokenRounds = ( i, startAt = 0 ) => {
  return new Promise((resolve,reject) => {
    RatingAgency().then( (ratingAgency) => {
      ratingAgency.roundsForToken( i, startAt ).then( r => { // idx, addr
        //console.log('r',r)
        let num_rounds = r[0].toNumber()
        let raRounds = r[1]
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

export const getTokensData = ( full = true ) => new Promise( (resolve,reject) => {
  console.log(' beginning tokens fetch')
  RatingAgency().then( ratingAgency => {
    ratingAgency.num_tokens().then( result => {
      let numTokens = result.toNumber()
      console.log("result was:",numTokens)
      let numFetch = 0
      let tokens = []
      for (let i = 0; i < numTokens; i++) {
        ( itoken =>  getTokenData( itoken, full ).then( token => {
            tokens[ itoken ] = token
            console.log('got token with name',token.name,token.id)
            if (++numFetch === numTokens) {  
              resolve( tokens )
            }
          }).catch( error )
        )( i )
      }
    }).catch( error )
  })
  const error = result => { 
    console.error("Error from server:"  + result) 
    reject( result )
  }
})

