// @flow weak

import { getRatingAgency as RatingAgency } from '../contracts'
import { appConfig }        from '../../config'

import { store } from '../../Root'

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

export const cycleSignup = ( cycle, analyst, lead = false ) => new Promise( (resolve,reject) => {
  RatingAgency().then((ratingAgency) => {
    ratingAgency.addAvailability( cycle, analyst, lead ).then( result => {
      resolve( result ) // transaction, so only resolve is important
    })    
    .catch(result => { 
      console.error("Error on addAvailability:"  + result) 
      reject(result)
    })
  })

})


export const getCycleInfo = ( cycle, analyst = 0) => new Promise( (resolve, reject ) => {
  RatingAgency().then((ratingAgency) => {
    ratingAgency.cycleInfo( cycle, analyst ).then( rCycle => { // idx, addr
      let timestart = rCycle[1].toNumber()
      let res = {
        id:rCycle[0].toNumber(),   
        timestart: timestart,
        timefinish: timestart+rCycle[2].toNumber(),
        status: rCycle[3].toNumber(),
        num_jurists_available: rCycle[4].toNumber(),
        num_jurists_assigned: rCycle[5].toNumber(),
        num_leads_available: rCycle[6].toNumber(),
        num_leads_assigned: rCycle[7].toNumber(),
        analyst_status: rCycle[8].toNumber()
      }
      //console.log('got cycle',res)
      resolve( res )
    })
    .catch(result => { 
      console.error("Error from server:"  + result) 
      reject(result)
    })
  })
})


export const dataSource = function getData({ pageIndex, pageSize }) {
  return new Promise((resolve,reject) => {
    console.log(' beginning cycles fetch')
    RatingAgency().then((ratingAgency) => {
      ratingAgency.num_cycles()
      .then(result => {
        var numCycles = result.toNumber()
        // console.log("result was:",numCycles)
        var numFetch = 0
        var cyclesData = []
        let user = store.getState().user.info
        let analyst = user && user.id ?  user.id : 0

        for (var i = 0; i < numCycles; i++) {
          getCycleInfo( i, analyst ).then( res => {
            cyclesData.push(res)
            // console.log('got cycle starting',res.timestart)
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

export const getCyclesData = (analyst = 0) => {
  return new Promise((resolve,reject) => {
    //console.log(' beginning cycles fetch')

    RatingAgency().then((ratingAgency) => {
      ratingAgency.num_cycles().then(result => {
        let numCycles = result.toNumber();
        //console.log("result was:",numCycles);
        let numFetch = 0
        let cyclesData = []
        for (var i = 0; i < numCycles; i++) {
          getCycleInfo( i, analyst ).then( res => {
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
