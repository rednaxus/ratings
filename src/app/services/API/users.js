// @flow weak

//import { appConfig }  from '../../config';

import auth                   from '../auth'
import { getAnalystRegistry as AnalystRegistry } from '../contracts'
import { getRatingAgency as RatingAgency } from '../contracts'

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
  AnalystRegistry().then( analystRegistry => {
    RatingAgency().then( ratingAgency => {    
      analystRegistry.analystInfo(userId).then( result => {
        // _analystId, a.name, a.password, a.auth_status, a.reputation, a.is_lead, a.token_balance, a.num_rounds_scheduled, a.num_rounds_active, a.num_rounds_finished
        userInfo = { 
          ...userInfo,
          id: result[0].toNumber(),
          name: web3.toAscii(result[1]).replace(/\W/g,''),
          email: web3.toAscii(result[1]).replace(/\W/g,''),
          auth_status: result[3].toNumber(),
          reputation: result[4].toNumber(),
          lead: result[5],
          token_balance: result[6].toNumber(),
          num_rounds_scheduled: result[7].toNumber(),
          num_rounds_active: result[8].toNumber(),
          num_rounds_finished: result[9].toNumber()
        }
        console.log('got user info',userInfo)
        console.log('rating agency',ratingAgency)
        ratingAgency.num_cycles().then( result => { // check for availabilities
          let numCycles = result.toNumber()
          if (numCycles === 0) resolve(userInfo)
          let numFetch = 0
          for (var i = 0; i < numCycles; i++) {
            ratingAgency.getAnalystCycleInfo(i,userId).then( result => {
              userInfo.cycleInfo.push( result.toNumber() )
              if (++numFetch === numCycles) {
                console.log('got user info',userInfo)
                resolve(userInfo)
              }
            })
          }
        })
      })
      .catch(result => { 
        console.error("Error on info check:"  + result) 
        reject(result)
      })
    })
  })
})



const getAnalystRounds = ( analystInfo ) => new Promise( (resolve,reject) => {
  const result = { }
  console.log('analyst info',analystInfo)
  AnalystRegistry().then( analystRegistry => {
    Promise.all([...Array(analystInfo.num_rounds_scheduled)].map((_, i) => analystRegistry.scheduledRound(analystInfo.id,i)))
    .then( res => {
      result.scheduled = res.map( rnd => rnd.toNumber() )
      Promise.all([...Array(analystInfo.num_rounds_active)].map((_, i) => analystRegistry.activeRound(analystInfo.id,i)))
      .then( res => {
        result.active = res.map( rnd => rnd.toNumber() )
        Promise.all([...Array(analystInfo.num_rounds_finished)].map((_, i) => analystRegistry.finishedRound(analystInfo.id,i)))
        .then( res => {
          result.finished = res.map( rnd => rnd.toNumber() )
          resolve( result )
        }).catch( reject )
      }).catch( reject )
    }).catch( reject )
  })
})

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


const register = (user,email,password) => new Promise( (resolve,reject) => {
  console.log(' register',user,password,email)
  web3 = window.web3
  AnalystRegistry().then((analystRegistry) => {
    analystRegistry.register(user,password,email).then(result => { // transaction object
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
            //console.log('got analyst info',rAnalyst)
            var res = {
              id:rAnalyst[0].toNumber(), 
              name: rAnalyst[1].slice(48),
              status:rAnalyst[2].toNumber(),
              reputation:rAnalyst[3].toNumber(),  
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
