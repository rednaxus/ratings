// @flow weak

import { getRatingAgency as RatingAgency } from '../contracts'
import { appConfig }        from '../../config'

import { store } from '../../Root'

export const getRoundInfo = ( round ) => {
  return new Promise( (resolve,reject) => {

    RatingAgency().then((ratingAgency) => {
      ratingAgency.roundInfo( round ).then( rRound => { 
        var res = {
          id:rRound[0].toNumber(), 
          cycle: rRound[1].toNumber(),
          covered_token: rRound[2].toNumber(),
          value: rRound[3].toNumber(),
          status: rRound[4].toNumber(),
          num_analysts: rRound[5].toNumber()
        }
        console.log('got round',res)
        resolve( res )
      })
      .catch(result => { 
        console.error("Error from server on fetchRoundInfo:"  + result) 
        reject(result)
      })
    })
    
  })
}



export const dataSource = function getData({
    pageIndex, pageSize
}) {
  return new Promise((resolve,reject) => {
    console.log(' beginning rounds fetch')
    RatingAgency().then((ratingAgency) => {
      ratingAgency.num_rounds()
      .then(result => {
        var numRounds = result.toNumber()
        console.log("number of rounds:",numRounds)
        var numFetch = 0
        var roundsData = []
        let user = store.getState().user.info.user
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
export default dataSource

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
