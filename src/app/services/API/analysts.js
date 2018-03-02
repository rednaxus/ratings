// @flow weak

import { appConfig }  from '../../config';

import { 
  getRatingAgency as RatingAgency,
  getAnalystRegistry as AnalystRegistry
} from '../contracts'

export const dataSource = function getData({
    pageIndex, pageSize
}) {
  return new Promise((resolve,reject) => {
    //console.log(' beginning users fetch')
    web3 = window.web3

    AnalystRegistry().then( analystRegistry => {
      analystRegistry.num_analysts()
      .then(result => {
        var numAnalysts = result.toNumber();
        //console.log("number of analysts:",numAnalysts);
        var numFetch = 0
        var usersData = []
        for (var i = 0; i < numAnalysts; i++) {
          analystRegistry.analystInfo(i).then( rAnalyst => { // idx, addr
            console.log('got analyst info',rAnalyst)
            var res = {
              id:rAnalyst[0].toNumber(), 
              name: web3.toAscii(rAnalyst[1]).replace(/\W/g,''),
              password: web3.toAscii(rAnalyst[2]).replace(/\W/g,''),
              status:rAnalyst[3].toNumber(),
              reputation:rAnalyst[4].toNumber(),  
              is_lead:rAnalyst[5], 
              token_balance:rAnalyst[6].toNumber(),
              scheduled_round:rAnalyst[7].toNumber(),
              active_round:rAnalyst[8].toNumber(),
              num_rounds:rAnalyst[9].toNumber()
            }
            //console.log('got analyst',res)
            usersData.push(res)
            if (++numFetch === numAnalysts) {
              usersData.sort( (a,b) => a.id - b.id) 
              resolve( { data:usersData, total:numAnalysts } )
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

export default dataSource
