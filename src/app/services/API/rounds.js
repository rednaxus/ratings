// @flow weak
const config = require('../../config/appConfig')
const { bytes32FromIpfsHash, ipfsHashFromBytes32 } = require('../ipfs')
const { getRatingAgency, getAnalystRegistry } = require('../contracts')
const { hexToBytes, hexToBytesSigned } = require('../utils')


module.exports = {
  getRoundInfo: ( round, analyst, deep = true ) => new Promise( (resolve,reject) => getRatingAgency().then( ra  => {
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
      console.log('got round',res)
      let numFetch = 1
      ra.roundBriefs( round ).then( rBriefs => {
        console.log('got briefs',round, rBriefs)
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

  getRoundSummary: ( round ) => new Promise( (resolve,reject) => {
    getRatingAgency().then( ra  => {
      ra.roundSummary( round ).then( rRound => { 
        let i = 0
        let res = {
          id:             round, 
          averages:       [ hexToBytes( rRound[i++] ), hexToBytes( rRound[i++] ) ],
          sways:          hexToBytesSigned( rRound[i++] ),
          winner:         rRound[i++].toNumber()
        }
        console.log('got round summary',res)
        resolve( res )
      }).catch( err => { 
        console.error("Error from server on getRoundSummary:"  + err) 
        reject( err )
      })
    })
  }),

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
        var res = {
          id:             round,
          analyst:        analyst,
          inround_id:     rRound[0].toNumber(), 
          analyst_status: rRound[1].toNumber()
        }
        console.log('got round analyst',res)
        resolve( res )
      })
      .catch( result => { 
        console.error("Error from server on getRoundAnalystInfo:"  + result) 
        reject( result )
      })
    })
  }),

  getRoundsActive: () => new Promise( ( resolve, reject ) => {
    getRatingAgency().then( ra => {
      ra.num_rounds_active().then( num_rounds_active => {
        console.log(`got ${num_rounds_active} rounds active`)
        if ( !num_rounds_active ) resolve([])
        let promises = new Array( num_rounds_active ).fill().map( ( _, roundRef ) => ra.roundActive( roundRef ) )
        Promise.all( promises ).then( rounds => {
          console.log(`got active rounds ${rounds.toString()}`)
          resolve( rounds )
        }).catch( reject )
      }).catch( reject )
    })
  }),

  // function submitBrief( uint16 _round, uint8 _analyst, address _file )
  submitRoundBrief: ( round, aref, filehash ) => new Promise( (resolve,reject) => getRatingAgency().then( ra => {
    console.log('submitting brief',round,aref,filehash)
    ra.roundBriefSubmit( round, aref, bytes32FromIpfsHash(filehash) ).then( result => {
      console.log('submit brief result',result)
      resolve( 'done' )
    })
    .catch( err => { 
      console.error("Error submitting brief:"  + err ) 
      reject( err )
    })
  })),


  submitRoundSurvey : ( 
    round, 
    analystRef, // analyst ref in the round
    answers,
    comment, 
    preOrPost = 0 
  ) => {
    return new Promise( (resolve,reject) => {
      getRatingAgency().then( ra => {
        ra.roundSurveySubmit(
          round, 
          analystRef,
          preOrPost, 
          answers, 
          comment
        ).then( result => {
          console.log('submitted survey result',result)
          resolve( 'done' )
        })
        .catch( result => { 
          console.error("Error submitting survey:"  + result) 
          reject( result )
        })
      })

    })
  },



  dataSource: function getData({
      pageIndex, pageSize
  }) {
    return new Promise( (resolve,reject) => {
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

//export default dataSource

/*module.exports = {
  getRoundInfo,
  getRoundAnalystInfo,
  getRoundSummary,
  submitBrief,
  submitRoundSurvey,
  dataSource
}
*.
/*
export const getCyclesData = () => {
  return new Promise((resolve,reject) => {
    //console.log(' beginning cycles fetch')

    RatingAgency()
    .then((ratingAgency) => {
      ratingAgency.num_cycles()
      .then(result => {
        var numCycles = result.toNumber();
        //console.log("result was:",numCycles);
        var numFetch = 0
        var cyclesData = []
        for (var i = 0; i < numCycles; i++) {
          ratingAgency.cycleInfo(i).then( rCycle => { // idx, addr
            var res = {
              id:rCycle[0].toNumber(),   
              timestart: rCycle[1].toNumber(),
              period: rCycle[2].toNumber(),
              status: rCycle[3].toNumber(),
              num_jurists_available: rCycle[4].toNumber(),
              num_jurists_assigned: rCycle[5].toNumber(),
              num_leads_available: rCycle[6].toNumber(),
              num_leads_assigned: rCycle[7].toNumber()
            }
            //console.log('got cycle',res)
            cyclesData.push(res)
            //console.log('got cycle starting',res.timestart)
            if (++numFetch === numCycles) {
              cyclesData.sort( (a,b) => a.id - b.id)  
              resolve(cyclesData)
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
*/

