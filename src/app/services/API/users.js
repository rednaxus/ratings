// @flow weak

import { appConfig }  from '../../config';

import { 
  getRatingAgency as RatingAgency,
  getAnalystRegistry as AnalystRegistry
} from '../contracts'

export const getUsersData = () => {

  return new Promise((resolve,reject) => {
    console.log(' beginning users fetch')

    AnalystRegistry()
    .then( analystRegistry => {
      analystRegistry.num_analysts()
      .then(result => {
        var numAnalysts = result.toNumber();
        console.log("number of analysts:",numAnalysts);
        var numFetch = 0
        var usersData = []
        for (var i = 0; i < numAnalysts; i++) {
          analystRegistry.analystInfo(i).then( rAnalyst => { // idx, addr
            console.log('got analyst info',rAnalyst)
            var res = {
              id:i, 
              name: rAnalyst[0].slice(48),
              status:rAnalyst[1].toNumber(),
              reputation:rAnalyst[2].toNumber(),  
              is_lead:rAnalyst[3], 
              token_balance:rAnalyst[4].toNumber(),
              scheduled_round:rAnalyst[5].toNumber(),
              active_round:rAnalyst[6].toNumber(),
              num_rounds:rAnalyst[7].toNumber()
            }
            console.log('got analyst',res)
            usersData.push(res)
            if (++numFetch === numAnalysts)
              resolve(usersData);
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
