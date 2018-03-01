// @flow weak

//import { appConfig }  from '../../config';

import auth                   from '../auth'
import { getAnalystRegistry as AnalystRegistry } from '../contracts'


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
  }).catch(result => { 
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
  register
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
