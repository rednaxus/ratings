// @flow weak

const { getRatingAgency: RatingAgency } = require('../contracts')

const { getTokenInfoExt } = require('./ethplorer')
const utils = require('../utils')

module.exports = {
  dataSource: function getData({
      pageIndex, pageSize
  }) {
    console.log('in data source')
    return new Promise((resolve,reject) => {
      console.log(' beginning tokens fetch', pageSize, pageIndex )
      pageSize = pageSize || 5
      pageIndex = pageIndex || 0
      RatingAgency().then( ra => {
        ra.num_tokens().then( result => {
          var numTokens = result.toNumber()
          console.log("result was:",numTokens)
     
          var tokensData = []
          let max = Math.min( pageIndex + pageSize, numTokens )
          let numFetch = max - pageIndex
          for (var i = pageIndex; i < max; i++) {
            module.exports.getTokenInfo( i ).then( token => { // idx, addr
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
  },

  /* 
  * add coverage for the token
  */
  coverToken: (name, address) => new Promise( ( resolve, reject ) => RatingAgency().then( ra => {
    console.log('covering token',name)
    ra.tokenCover( address, name, 0 ).then( result => { 
      console.log(`coverage added for token ${name} with address ${address}`)
      resolve( result )
    }).catch( reject )
  })),

  getTokenInfo: (i, full=true ) => new Promise( ( resolve, reject ) => RatingAgency().then( ra => {
    ra.tokenInfo( i ).then( raToken => { // idx, addr
      let web3 = utils.getWeb3()
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
      getTokenInfoExt( token.address ).then( info => {
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
  })),

  getTokensInfo: ( full = true ) => new Promise( ( resolve, reject ) => RatingAgency().then( ra => {
    const error = result => { 
      console.error("Error from server:"  + result) 
      reject( result )
    }
    ra.num_tokens().then( result => {
      let numTokens = result.toNumber()
      let numFetch = 0
      let tokens = []
      for (let i = 0; i < numTokens; i++) {
        ( itoken =>  module.exports.getTokenInfo( itoken, full ).then( token => {
            tokens[ itoken ] = token
            // console.log('got token with name',token.name,token.id)
            if (++numFetch === numTokens) {  
              resolve( tokens )
            }
          }).catch( error )
        )( i )
      }
    }).catch( error )
  })),
  
  getTokenRounds: ( i, startAt = 0 ) => new Promise( ( resolve, reject ) => RatingAgency().then( ra => {
    ra.roundsForToken( i, startAt ).then( r => { // idx, addr
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
  }))
  

}
