// @flow weak

import { getRatingAgency as RatingAgency } from '../contracts'
import { appConfig }        from '../../config';

export const getCronInfo = () => {
  return new Promise( (resolve,reject) => {
    //console.log(' beginning cycles fetch')

    RatingAgency().then((ratingAgency) => {
      ratingAgency.lasttime().then(result => {
        resolve(1000*result.toNumber())
      })
      .catch(result => { 
        console.error("Error from server on cron:"  + result) 
        reject(result)
      })
    })
    
  })
}

export const pulseCron = () => {
  return new Promise( (resolve,reject) => {
    //console.log(' beginning cycles fetch')

    RatingAgency().then((ratingAgency) => {
      ratingAgency.lasttime().then( result => {
        let lasttime = result.toNumber()
        console.log('pulsing cron from ' + lasttime + ' to '+ (lasttime+appConfig.CRON_INTERVAL))
        lasttime += appConfig.CRON_INTERVAL
        ratingAgency.cron(lasttime).then( cronResult => {
          console.log('cron result',cronResult)
          resolve( 1000*result.toNumber() )
        })
        .catch(result => { 
          console.error("Error cron on cron:"  + result) 
          reject(result)
        })
      })    
      .catch(result => { 
        console.error("Error lasttime on cron:"  + result) 
        reject(result)
      })
    })

  })
}

export const dataSource = function getData({
    pageIndex, pageSize
}) {
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
              resolve( { data:cyclesData, total:numCycles } )
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
