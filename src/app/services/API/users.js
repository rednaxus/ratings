// @flow weak

//import { appConfig }  from '../../config';

import auth                   from '../auth'
import { getAnalystRegistry as AnalystRegistry } from '../contracts'
import { getRatingAgency as RatingAgency } from '../contracts'
import { parseB32StringtoUintArray } from '../utils'

// cycle statuses :
/*
0: no status
1: lead available
2: lead assigned
3: jurist available
4: jurist assigned
*/

const info = userId => new Promise((resolve,reject) => {
  console.log(' beginning user info fetch')
  
  web3 = window.web3
  let userInfo = {
    id:userId,
    cycleInfo: []
  }
  AnalystRegistry().then( registry => {
    RatingAgency().then( agency => { 
      /*
                  _analyst, a.email, a.auth_status,
            a.points, a.is_lead, a.token_balance, 
            a.num_rounds_active, a.num_rounds_finished,
            a.num_reward_events,a.num_referrals
      */   
      registry.analystInfo(userId).then( result => {
        // _analystId, a.name, a.email, a.auth_status, a.reputation, a.is_lead, a.token_balance, a.num_rounds_scheduled, a.num_rounds_active, a.num_rounds_finished
        let i = 0
        userInfo = { 
          ...userInfo,
          id: result[i++].toNumber(),
          email: web3.toAscii(result[i++]).replace(/\0/g,''),
          auth_status: result[i++].toNumber(),
          reputation: result[i++].toNumber(),
          lead: result[i++],
          token_balance: result[i++].toNumber(),
          //num_rounds_scheduled: result[7].toNumber(),
          num_rounds_active: result[i++].toNumber(),
          num_rounds_finished: result[i++].toNumber(),
          num_reward_events: result[i++].toNumber(),
          num_referrals: result[i++].toNumber(),
          reward_events: [],
          referrals: []
        }
        userInfo.name = userInfo.email.slice(0,userInfo.email.indexOf('@'))
        //console.log('got user info',userInfo)
        //console.log('rating agency',ratingAgency)
        var numFetch = 0

        agency.num_cycles().then( result => { // check for availabilities
          let numCycles = result.toNumber()
          //console.log('num cycles',numCycles)
          if ( !numCycles ) {
            if ( !numFetch ) resolve(userInfo)
            return
          }
          let numCyclesFetch = numCycles
          numFetch++
          for (var iCyc = 0; iCyc < numCycles; iCyc++) {
            ( function( iCycle ) {
              agency.cycleAnalystInfo(iCyc,userId).then( result => {
                let idx = 0
                console.log('result from cycleAnalystInfo',result)
                let ref = result[idx++].toNumber()
                if ( ref !== 0xffff ) {
                  userInfo.cycleInfo[ iCycle ] = {
                    incycle_ref: ref,
                    role: [ { 
                      num_volunteers: result[idx++].toNumber(), 
                      num_confirms: result[idx++].toNumber(),
                      num_rounds: result[idx++].toNumber(),
                      rounds: result[idx++],
                    }, {
                      num_volunteers: result[idx++].toNumber(),
                      num_confirms: result[idx++].toNumber(),
                      num_rounds: result[idx++].toNumber(),
                      rounds: result[idx++]
                    }]
                  }
                  for (let irole = 0; irole < 2; irole++ ) {
                    let roleObj = userInfo.cycleInfo[ iCycle ].role[irole]
                    roleObj.rounds = parseB32StringtoUintArray(roleObj.rounds, roleObj.num_rounds)
                  }
                }
                if ( !--numCyclesFetch ) {
                  if ( !--numFetch ) resolve(userInfo)
                }
              })
            } ( iCyc ) )
          }
        })        
        if (userInfo.num_reward_events) {
          numFetch++
          let numRewardsFetch = userInfo.num_reward_events
          for (var e = 0; e < userInfo.num_reward_events; e++) {
            ( function( event ){
              registry.getAnalystEvent( userId, event ).then( result => {
                let idx = 0
                userInfo.reward_events[ event ] = {
                  reward_type: result[ idx++ ].toNumber(), 
                  timestamp: result[ idx++ ].toNumber(),
                  value: result[ idx++ ].toNumber(),
                  ref: result[ idx++ ].toNumber()
                }
                if ( !--numRewardsFetch ) {
                  if ( !--numFetch ) resolve(userInfo)
                }
              } )
            } ( e ) )

          }
        }
      })
      .catch(result => { 
        console.error("Error on info check:"  + result) 
        reject(result)
      })
    })
  })
})



/*
    Promise.all([...Array(analystInfo.num_rounds_scheduled)].map((_, i) => analystRegistry.scheduledRound(analystInfo.id,i)))
    .then( res => {
      result.scheduled = res.map( rnd => rnd.toNumber() )
*/
const getAnalystRounds = ( analystInfo ) => new Promise( (resolve,reject) => {
  const result = { }
  console.log('analyst info',analystInfo)
  AnalystRegistry().then( analystRegistry => {
    Promise.all([...Array(analystInfo.num_rounds_active)].map((_, i) => analystRegistry.activeRound(analystInfo.id,i)))
    .then( res => {
      result.active = res.map( rnd => rnd.toNumber() )
      Promise.all([...Array(analystInfo.num_rounds_finished)].map((_, i) => analystRegistry.finishedRound(analystInfo.id,i)))
      .then( res => {
        result.finished = res.map( rnd => rnd.toNumber() )
        resolve( result )
      }).catch( reject )
    }).catch( reject )

  })
})

/*
const getRewardEvents = ( analystInfo ) => new Promise( (resolve,reject) => {
  if (!analystInfo.num_reward_events)    
    return resolve( [] )
  AnalystRegistry().then( analystRegistry => {
    Promise.all([...Array(analystInfo.num_reward_events)].map((_, i) => analystRegistry.getAnalystEvent(analystInfo.id,i)))
    .then( res => {
      result = res.map( evt => evt.toNumber() )
      resolve( result )
    })
    .catch( reject )
  })
})
*/

const login = (username, password) => new Promise((resolve,reject) => {
    //console.log(' beginning users fetch')
  
  web3 = window.web3
  AnalystRegistry().then( analystRegistry => {
    analystRegistry.login(username,password).then(result => {
      // id,email,reputation,token_balance
      console.log('login result',result)
      let user = { 
        id: result[0].toNumber(),
        name: username,
        password: password,
        email: web3.toAscii(result[1]).replace(/\W/g,''),
        reputation: result[2].toNumber(),
        token_balance: result[3].toNumber()
      }
      auth.setToken( 'mock token' )
      auth.setUserInfo( user )
      resolve(user) // should push user data
    })
    .catch(result => { 
      console.error("login failed:"  + result) 
      reject(result)
    })
  })
  .catch(result => { 
    console.error("Error from server on login:"  + result) 
    reject(result)
  })
})


const register = ( user, email, password, referral = 0 ) => new Promise( (resolve,reject) => {
  console.log(' register',user,password,email)
  web3 = window.web3
  AnalystRegistry().then( analystRegistry => {
    analystRegistry.register( user, password, email, referral ).then(result => { // transaction object
      console.log('result',result)
      resolve(result)
    })
  }).catch(result => { 
    console.error("Error from server on register:"  + result) 
    reject(result)
  })
})

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('user');
}

export const userService = {
  login,
  logout,
  register,
  info,
  getAnalystRounds
}
/*
export const getUsersData = () => {

  return new Promise((resolve,reject) => {
    //console.log(' beginning users fetch')

    AnalystRegistry()
    .then( analystRegistry => {
      analystRegistry.num_analysts()
      .then(result => {
        var numAnalysts = result.toNumber();
        //console.log("number of analysts:",numAnalysts);
        var numFetch = 0
        var usersData = []
        for (var i = 0; i < numAnalysts; i++) {
          analystRegistry.analystInfo(i).then( rAnalyst => { // idx, addr
            _analyst, a.name, a.password, a.auth_status,
            a.reputation, a.is_lead, a.token_balance, 
            a.num_rounds_scheduled, a.num_rounds_active, a.num_rounds_finished,
            a.num_reward_events,a.num_referrals
            //console.log('got analyst info',rAnalyst)
            var res = {
              id:rAnalyst[0].toNumber(), 
              name: rAnalyst[1].slice(48),
              status:rAnalyst[3].toNumber(),
              reputation:rAnalyst[4].toNumber(),  
              is_lead:rAnalyst[4], 
              token_balance:rAnalyst[5].toNumber(),
              scheduled_round:rAnalyst[6].toNumber(),
              active_round:rAnalyst[7].toNumber(),
              num_rounds:rAnalyst[8].toNumber()
            }
            //console.log('got analyst',res)
            usersData.push(res)
            if (++numFetch === numAnalysts) {
              usersData.sort( (a,b) => a.id - b.id) 
              resolve(usersData);
            }
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

// function referralInfo( uint32 _analyst, uint16 _referral ) public view returns ( uint256, uint256, bytes32, uint32 ) {
export const referrals = ( ) => {

}


// function referredBy( uint32 _analyst ) public view returns ( uint32 ) {
export const referredBy = ( _analyst ) => {

}

//     function submitReferral( uint32 _analyst, bytes32 _email ) public {
export const submitReferral = ( _email ) => {

}


