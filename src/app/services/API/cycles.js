// @flow weak

const { getRatingAgency: RatingAgency } = require('../contracts')
const config = require('../../config/appConfig')
const { parseB32StringToUintArray } = require('../utils')

module.exports = {
  getCronInfo: ( ms = false ) => new Promise( ( resolve, reject ) => RatingAgency().then( ra => {
    ra.lasttime().then( result => resolve( ( ms ? 1000 : 1 ) * result.toNumber() ) )
    .catch( err => { 
      console.error( `Error from server on cron: ${err}` ) 
      reject( err )
    })
  })),

  pulseCron: ( interval = config.CRON_INTERVAL ) => new Promise( (resolve,reject) => RatingAgency().then( ra => {
    ra.lasttime().then( result => {
      let lasttime = result.toNumber()
      console.log('pulsing cron from ' + lasttime + ' to '+ (lasttime+interval))
      lasttime += interval
      ra.cron( lasttime ).then( cronResult => {
        //console.log('cron result',cronResult)
        resolve( 'done' ) //1000*result.toNumber() )
      }).catch( err )
    }).catch( err )
    const err = err => {
      console.error(`Error on cron: ${err}`) 
      reject( result )     
    }
  })),

  cycleSignup: ( cycle, analyst, role ) => new Promise( (resolve,reject) => RatingAgency().then( ra => {
    ra.cycleVolunteer( cycle, analyst, role ).then( result => {
      resolve( result ) // transaction, so only resolve is important
    }).catch(result => { 
      console.error("Error on cycleSignup:"  + result) 
      reject(result)
    })
  })),

  cycleConfirm: ( cycle, analyst, role ) => new Promise( (resolve,reject) => RatingAgency().then( ra => {
    ra.cycleConfirm( cycle, analyst, role ).then( result => {
      resolve( result ) // transaction, so only resolve is important
    }).catch(result => { 
      console.error("Error on cycleConfirm:"  + result) 
      reject(result)
    })
  })),

  getCycleInfo: ( cycle, analyst = -1 ) => new Promise( (resolve, reject ) => RatingAgency().then( ra => {
    const err = err => {
      console.error(`Error from server on getCycleInfo ${err}`)
      reject( err )
    }
    ra.cycleInfo( cycle ).then( rCycle => { // idx, addr
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
      if ( analyst == -1 ) {
        //console.log( `got cycle info all for cycle ${cycle}`,res)    
        resolve( res )
        return
      }
      ra.cycleAnalystInfo( cycle, analyst ).then ( rCycleAnalyst => {
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
        //console.log( `got cycle info all for cycle ${cycle} with analyst ${analyst}`,res)     
        resolve( res )
      }).catch( err )
    }).catch( err )
  })),

  getCyclesInfo: ( analyst = -1 ) => new Promise((resolve,reject) => RatingAgency().then( ra => {
    ra.num_cycles().then(result => {
      let numCycles = result.toNumber();
      //console.log("result was:",numCycles);
      let numFetch = 0
      let cyclesData = []
      for (var i = 0; i < numCycles; i++) {
        module.exports.getCycleInfo( i, analyst ).then( res => {
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
  })),

  /* client side only */
  dataSource: function getData({ pageIndex, pageSize }) { 
    return new Promise( ( resolve, reject ) => RatingAgency().then( ra => {
      //console.log(' beginning cycles fetch')
      ra.num_cycles().then( result => {
        const { store } = require('../../Root')

        let numCycles = result.toNumber()
        // console.log("result was:",numCycles)
        let numFetch = 0
        let cyclesData = []
        let user = store.getState().user.info
        let analyst = user && user.id ?  user.id : 0

        for (let i = 0; i < numCycles; i++) {
          module.exports.getCycleInfo( i, analyst ).then( res => {
            cyclesData.push(res)
            // console.log('got cycle starting',res.timestart)
            if (++numFetch === numCycles) {
              cyclesData.sort( (a,b) => a.id - b.id)  
              resolve( { data:cyclesData, total:numCycles } )
            }
          }).catch(result => { 
            console.error("Error from server:"  + result) 
            reject(result)
          })        
        }
      }).catch( err => { 
        console.error(`Error from server: ${err}`) 
        reject(err)
      })
    }))
  }

}
