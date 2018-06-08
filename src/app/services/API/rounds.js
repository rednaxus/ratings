// @flow weak
const config = require('../../config/appConfig')
const { bytes32FromIpfsHash, ipfsHashFromBytes32 } = require('../ipfs')
const { getRatingAgency, getAnalystRegistry } = require('../contracts')
const { hexToBytes, hexToBytesSigned, toHexString } = require('../utils')
const survey = require('../survey')

const s = '***'

module.exports = {
  getActiveRounds: ( analyst = -1 ) => new Promise( ( resolve, reject ) => {
    //console.log(`${s}get rounds active`)
    Promise.all( [ module.exports.getRoundsActive(), module.exports.getRounds() ] ).then( nums => {
      let [ num_active_rounds, num_rounds ] = nums
      //console.log( `${s}${num_active_rounds} active rounds and ${num_rounds} total rounds` ) 

      module.exports.getRoundsInfo( num_rounds - num_active_rounds, num_active_rounds ).then( rounds => {
        //console.log(`${s}got active rounds for analyst ${analyst}`,rounds)
        if (analyst == -1) {
          resolve( rounds )
          return
        }
        Promise.all(
          rounds.map( (round, idx) => module.exports.getRoundAnalystInfo( round.id, analyst ).then( roundAnalystInfo => 
            rounds[idx] = { ...round, ...roundAnalystInfo } 
          ))
        ).then( resolve( rounds ) )
      })
    })  
  }),

  getFinishedRounds: ( analyst = -1 ) => new Promise( ( resolve, reject ) => {
    Promise.all( [ module.exports.getRoundsActive(), module.exports.getRounds() ] ).then( nums => {
      let [ num_active_rounds, num_rounds ] = nums
      //console.log( `${s}${num_active_rounds} active rounds and ${num_rounds} total rounds` ) 

      module.exports.getRoundsInfo( 0, num_rounds - num_active_rounds ).then( rounds => {
        //console.log(`${s}got finished rounds for analyst ${analyst}`,rounds)
        if (analyst == -1) 
          return resolve( rounds )
        Promise.all(
          rounds.map( (round, idx) => module.exports.getRoundAnalystInfo( round.id, analyst ).then( roundAnalystInfo => 
            rounds[idx] = { ...round, ...roundAnalystInfo } 
          ))
        ).then( resolve( rounds ) )
      })
    })  
  }),

  getAllRounds: ( analyst = -1 ) => new Promise( ( resolve, reject ) => {
    Promise.all( [ module.exports.getRoundsActive(), module.exports.getRounds() ] ).then( nums => {
      let [ num_active_rounds, num_rounds ] = nums
      //console.log( `${s}${num_active_rounds} active rounds and ${num_rounds} total rounds` ) 

      module.exports.getRoundsInfo( 0, num_rounds ).then( rounds => {
        if (analyst == -1) return resolve( rounds )
        Promise.all(
          rounds.map( (round, idx) => module.exports.getRoundAnalystInfo( round.id, analyst ).then( roundAnalystInfo => {
            return { ...round, ...roundAnalystInfo }
          }) )
        ).then( rounds => {
          //console.log(`${s}got all rounds for analyst ${analyst}`,rounds)        
          resolve(rounds) 
        })
        .catch( reject )
      })
    })  
  }),

  getRoundInfo: ( round, deep = true ) => new Promise( (resolve,reject) => getRatingAgency().then( ra  => {
    const err = err => {
      console.error(`Error from server on getRoundInfo: ${err}` ) 
      reject( err )
    }
    ra.roundInfo( round ).then( rRound => { 
      var res = {
        id:             rRound[0].toNumber(), 
        cycle:          rRound[1].toNumber(),
        covered_token:  rRound[2].toNumber(),
        value:          rRound[3].toNumber(),
        status:         rRound[4].toNumber(),
        num_analysts:   rRound[5].toNumber()
      }
      //console.log('got round',res)
      let numFetch = 1
      ra.roundBriefs( round ).then( rBriefs => {
        //console.log('got briefs',round, rBriefs)
        res.briefs = [ // timestamp 0 if no brief submitted
          { timestamp: rBriefs[0].toNumber(), filehash: ipfsHashFromBytes32( rBriefs[1] ) },
          { timestamp: rBriefs[2].toNumber(), filehash: ipfsHashFromBytes32( rBriefs[3] ) }
        ]
        if ( !--numFetch ) resolve( res )
      }).catch ( err )
      if ( deep && res.num_analysts ) { // round analysts
        numFetch++
        let promises = new Array(res.num_analysts).fill().map( (_,a) => ra.roundAnalystId( round, a ) )
        Promise.all( promises ).then( analysts => {
          res.analysts = analysts.map( analyst => analyst.toNumber() )
          //console.log(`${s}round analysts: ${round_analysts.toString()}`)
          if ( !--numFetch ) resolve( res )
        }).catch( err )
      }
      if ( config.STATUSES[ res.status ] == 'finished' ){
        numFetch++
        module.exports.getRoundSummary( round ).then( rSummary => {
          res = { ...res, ...rSummary }
          if ( !--numFetch ) resolve( res )
        }).catch( err )
      }
    }).catch( err )
  })),

  getRoundsInfo: ( fromRound, num, deep=true ) => new Promise( ( resolve, reject ) => {
    Promise.all( new Array( num ).fill().map( (_,idx) => module.exports.getRoundInfo( fromRound + idx, deep ) ) ).then( resolve )
    .catch( err => {
      console.error(`Error from server on getRoundsInfo: ${err}` ) 
      reject( err )
    })
  }),

  getRoundSummary: ( round ) => new Promise( ( resolve,reject ) => getRatingAgency().then( ra  => {
    let surveyLength = survey.getElements().length
    ra.roundSummary( round ).then( rRound => { 
      let i = 0
      let res = {
        id:             round, 
        averages:       [ hexToBytes( rRound[i++], surveyLength ), hexToBytes( rRound[i++], surveyLength ) ],
        sways:          hexToBytesSigned( rRound[i++], surveyLength ),
        winner:         rRound[i++].toNumber()
      }
      res.averages.forEach( ( _, idx ) => res.averages[idx][1] &= 0x7f ) // strip submit bit
      //console.log('got round summary',res)
      resolve( res )
    }).catch( err => { 
      console.error("Error from server on getRoundSummary:"  + err) 
      reject( err )
    })
  })),

  // redundant?
  getRoundsSummary: ( token = -1 ) => new Promise( ( resolve, reject ) => getRatingAgency().then( ra  => {
    const err = err => {
      console.error(`Error from server on getRoundsInfo: ${err}` ) 
      reject( err )
    }
    Promise.all( [ module.exports.getRoundsActive(), module.exports.getRounds() ] ).then( nums => {
      let [ num_active_rounds, num_rounds ] = nums
      let num_finished_rounds = num_rounds - num_active_rounds
      console.log( `${s}${num_finished_rounds} finished rounds and ${num_rounds} total rounds` ) 

      Promise.all( 
        new Array( num_finished_rounds ).fill().map( (_,idx) => module.exports.getRoundInfo( idx, false ) ) 
      ).then( rounds => {
        console.log(`got round summaries`, rounds )
        resolve(rounds)
      }).catch( err )
    }).catch( err )
  })),

/*
  getRoundAnalysts: ( round ) => new Promise( (resolve, reject ) = getRatingAgency().then( ra ) => {
    roundsService.getRoundInfo( round ).then( roundInfo => { // need num_analysts
      //console.log(`${s}info for round ${round}`,roundInfo )
      let promises = []
      for (let a = 0; a < roundInfo.num_analysts; a++){
        promises.push( ra.roundAnalystId( round, a ) )
      }
      Promise.all( promises ).then( results => {
        let round_analysts = results.map
        results.forEach( (_,idx) => round_analysts.push( results[idx].toNumber() ) )
        console.log(`${s}round analysts: ${round_analysts.toString()}`)

  })
*/
 
  getRoundAnalystInfo: ( round, analyst=0 ) => new Promise( (resolve,reject) => {
    getRatingAgency().then( ra => {
      ra.roundAnalyst( round, analyst ).then( rRound => { 
        let answers = [0,0].map( ( _, idx ) => {
          a = hexToBytes( rRound[ idx + 2 ] )
          if (!a[1]) return [] 
          a[1] &= 0x7f
          return a
        })

        var res = {
          id:             round,
          analyst:        analyst,
          inround_id:     rRound[0].toNumber(), 
          analyst_status: rRound[1].toNumber(),
          answers
        }
        //console.log('got round analyst',res)
        resolve( res )
      })
      .catch( result => { 
        console.error("Error from server on getRoundAnalystInfo:"  + result) 
        reject( result )
      })
    })
  }),

  // get the index to the start of the active rounds (goes to the end)
  getRoundsActive: () => new Promise( ( resolve, reject ) => getRatingAgency().then( ra => ra.num_rounds_active().then( num_rounds_active => {
    //console.log(`${num_rounds_active} rounds active`)
    resolve( num_rounds_active.toNumber() )
  }).catch( reject ))),
      /*
      if ( !num_rounds_active ) resolve([])
      let promises = new Array( num_rounds_active ).fill().map( ( _, roundRef ) => ra.roundActive( roundRef ) )
      Promise.all( promises ).then( rounds => {
        console.log(`got active rounds ${rounds.toString()}`)
        resolve( rounds )
      }).catch( reject )
      */

  // get current number of rounds    
  getRounds: () => new Promise( ( resolve, reject ) => getRatingAgency().then( ra => ra.num_rounds().then( num_rounds => {
    //console.log(`${num_rounds} rounds`)
    resolve( num_rounds.toNumber() )
  }).catch( reject ))),

  // function submitBrief( uint16 _round, uint8 _analyst, address _file )
  submitRoundBrief: ( round, aref, filehash ) => new Promise( (resolve,reject) => getRatingAgency().then( ra => {
    console.log('submitting brief',round,aref,filehash)
    ra.roundBriefSubmit( round, aref, bytes32FromIpfsHash(filehash) ).then( result => {
      //console.log('submit brief result',result)
      resolve( 'done' )
    }).catch( err => { 
      console.error("Error submitting brief:"  + err ) 
      reject( err )
    })
  })),


  submitRoundSurvey : ( 
    round, 
    analystRef, // analyst ref in the round
    answers,  // can be either array or encoded with toHexString
    comment, 
    preOrPost = 0 
  ) => new Promise( (resolve,reject) => getRatingAgency().then( ra => {
      let _answers = answers instanceof Array ? toHexString( answers ): answers
      console.log(`submitting ${preOrPost==0 ? "pre-":"post-"} survey with answers ${answers} to round ${round}`)
      ra.roundSurveySubmit( round, analystRef, preOrPost, answers, comment ).then( result => {
        //console.log('submitted survey result',result)
        resolve( 'done' )
      })
      .catch( result => { 
        console.error("Error submitting survey:"  + result) 
        reject( result )
      })
    })
  ),



  dataSource: function getData({pageIndex, pageSize}) {
    return new Promise( (resolve,reject) => {
      const { store } = require('../../Root')
      console.log(' beginning rounds fetch')
      getRatingAgency().then( ra => {
        ra.num_rounds().then( result => {
          var numRounds = result.toNumber()
          console.log("number of rounds:",numRounds)
          var numFetch = 0
          var roundsData = []
          let user = store.getState().user.info
          let analyst = user && user.id ?  user.id : 0

          for (var i = 0; i < numRounds; i++) {
            getRoundInfo( i ).then( (res) => {
              roundsData.push(res)
              if (++numFetch === numRounds) {
                roundsData.sort( (a,b) => a.id - b.id)  
                resolve( { data:roundsData, total:numRounds } )
              }
            })
            .catch(result => { 
              console.error("Error from server:"  + result) 
              reject(result)
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
}



