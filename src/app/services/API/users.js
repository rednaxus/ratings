// @flow weak

import { appConfig }  from '../../config';

import { 
  getRatingAgency as RatingAgency,
  getAnalystRegistry as AnalystRegistry
} from '../contracts'

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
