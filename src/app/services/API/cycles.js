// @flow weak

import { getRatingAgency as RatingAgency } from '../contracts'
import config        from '../../config/appConfig'
import { parseB32StringToUintArray } from '../utils'
import { store } from '../../Root'

export const getCronInfo = () => {
  return new Promise( ( resolve,reject ) => {
    //console.log(' beginning cycles fetch')

    RatingAgency().then( ratingAgency => {
      ratingAgency.lasttime().then( result => {
        resolve( 1000*result.toNumber() )
      })
      .catch( result => { 
        console.error( "Error from server on cron:"  + result ) 
        reject( result )
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
        console.log('pulsing cron from ' + lasttime + ' to '+ (lasttime+config.CRON_INTERVAL))
        lasttime += config.CRON_INTERVAL
        ratingAgency.cron( lasttime ).then( cronResult => {
          //console.log('cron result',cronResult)
          resolve( 1000*result.toNumber() )
        })
        .catch( result => { 
          console.error("Error cron on cron:"  + result) 
          reject( result ) 
        })
      })    
      .catch( result => { 
        console.error("Error lasttime on cron:"  + result) 
        reject( result )
      })
    })

  })
}

export const cycleSignup = ( cycle, analyst, role ) => new Promise( (resolve,reject) => {
  RatingAgency().then((ratingAgency) => {
    ratingAgency.cycleVolunteer( cycle, analyst, role ).then( result => {
      resolve( result ) // transaction, so only resolve is important
    })    
    .catch(result => { 
      console.error("Error on cycleSignup:"  + result) 
      reject(result)
    })
  })

})

export const cycleConfirm = ( cycle, analyst, role ) => new Promise( (resolve,reject) => {
  RatingAgency().then((ratingAgency) => {
    ratingAgency.cycleConfirm( cycle, analyst, role ).then( result => {
      resolve( result ) // transaction, so only resolve is important
    })    
    .catch(result => { 
      console.error("Error on cycleConfirm:"  + result) 
      reject(result)
    })
  })

})

export const getCycleInfo = ( cycle, analyst = 0) => new Promise( (resolve, reject ) => {


  RatingAgency().then((ratingAgency) => {
    ratingAgency.cycleInfo( cycle ).then( rCycle => { // idx, addr

      let timestart = rCycle[1].toNumber()
      let res = {
        id:rCycle[0].toNumber(),   
        timestart: timestart,
        timefinish: timestart+rCycle[2].toNumber(),
        status: rCycle[3].toNumber(),
        num_availables_lead: rCycle[4].toNumber(),
        num_availables_jury: rCycle[5].toNumber()
      }
      //console.log('got cycle info',res)
      ratingAgency.cycleAnalystInfo( cycle, analyst ).then ( rCycleAnalyst => {
        //console.log('cycle',cycle,analyst, rCycleAnalyst)
        res.incycle_ref = rCycleAnalyst[ 0 ].toNumber()
        res.role = []
        for ( let i=0; i<2; i++ ){
          let num_volunteers = rCycleAnalyst[ 1 + i*4 ].toNumber()
          let num_confirms = rCycleAnalyst[ 2 + i*4 ].toNumber()
          let num_rounds = rCycleAnalyst[ 3 + i*4 ].toNumber()
          res.role.push( { 
            num_volunteers: num_volunteers,
            num_confirms: num_confirms,
            num_rounds: num_rounds,
            rounds: num_rounds ? parseB32StringToUintArray( rCycleAnalyst[ 4 + i*4 ], num_rounds ) : []
          } )
          //console.log(i, ' round info ',rCycleAnalyst[ 4 + i*4 ], 'num rounds',num_rounds)
        }
        console.log( 'got cycle info all ',res)     
        resolve( res )
      }).catch( error )
    }).catch( error )
  })
  const error = ( err => {
    console.error("Error from server" + err)
    reject( err )
  }) 
})


export const dataSource = function getData({ pageIndex, pageSize }) {
  return new Promise((resolve,reject) => {
    //console.log(' beginning cycles fetch')
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
