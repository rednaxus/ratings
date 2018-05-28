// @flow weak
const { bytes32FromIpfsHash, ipfsHashFromBytes32 } = require('../ipfs')
const { getRatingAgency, getAnalystRegistry } = require('../contracts')

const getRoundInfo = ( round, analyst=0 ) => new Promise( (resolve,reject) => {
  getRatingAgency().then( ratingAgency  => {
    ratingAgency.roundInfo( round ).then( rRound => { 
      var res = {
        id:             rRound[0].toNumber(), 
        cycle:          rRound[1].toNumber(),
        covered_token:  rRound[2].toNumber(),
        value:          rRound[3].toNumber(),
        status:         rRound[4].toNumber(),
        num_analysts:   rRound[5].toNumber()
      }
      console.log('got round',res)
      ratingAgency.roundBriefs( round ).then( rBriefs => {
        console.log('got briefs',round, rBriefs)
       
        res.briefs = [ // timestamp 0 if no brief submitted
          { timestamp: rBriefs[0].toNumber(), filehash: ipfsHashFromBytes32( rBriefs[1] ) },
          { timestamp: rBriefs[2].toNumber(), filehash: ipfsHashFromBytes32( rBriefs[3] ) }
        ]
        resolve( res )
      })
    })
    .catch( result => { 
      console.error("Error from server on getRoundInfo:"  + result) 
      reject( result )
    })
  })
})

const getRoundAnalystInfo = ( round, analyst=0 ) => new Promise( (resolve,reject) => {
  getRatingAgency().then((ratingAgency) => {
    ratingAgency.roundAnalyst( round, analyst ).then( rRound => { 
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
})

// function submitBrief( uint16 _round, uint8 _analyst, address _file )
const submitBrief = ( round, analyst, filehash ) => new Promise( (resolve,reject) => {
  getRatingAgency().then( ratingAgency => {
    console.log('submitting brief',round,analyst,filehash)
    ratingAgency.roundBriefSubmit( round, analyst, bytes32FromIpfsHash(filehash) ).then( result => {
      console.log('submit brief result',result)
      resolve( 'done' )
    })
    .catch( err => { 
      console.error("Error submitting brief:"  + err ) 
      reject( err )
    })
  })
})


/*    function submitSurvey(uint16 _round,
        uint8 _analyst, // analyst by round index
        uint8 _idx,              // pre (0), or post (1)
        bytes32 _answers,
        byte _qualitatives,
        uint8 _recommendation,
        bytes32 _comment
    )
*/

const submitRoundSurvey = ( 
  round, 
  roundAnalyst, 
  answers,
  comment, 
  preOrPost = 0 
) => {
  return new Promise( (resolve,reject) => {
    getRatingAgency().then( ratingAgency => {
      ratingAgency.roundSurveySubmit(
        round, 
        roundAnalyst,
        preOrPost, 
        answers, 
        comment
      ).then( result => {
        console.log('submit survey result',result)
        resolve( 'done' )
      })
      .catch( result => { 
        console.error("Error submitting survey:"  + result) 
        reject( result )
      })
    })

  })
}



const dataSource = function getData({
    pageIndex, pageSize
}) {
  return new Promise( (resolve,reject) => {
    console.log(' beginning rounds fetch')
    getRatingAgency().then((ratingAgency) => {
      ratingAgency.num_rounds().then( result => {
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
//export default dataSource

module.exports = {
  getRoundInfo,
  getRoundAnalystInfo,
  submitBrief,
  submitRoundSurvey,
  dataSource
}
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

