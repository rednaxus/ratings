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
      analystRegistry.num_analysts().then(result => {
        var numAnalysts = result.toNumber()
        //console.log("number of analysts:",numAnalysts);
        var numFetch = 0
        var usersData = []
        for (var a = 0; a < numAnalysts; a++) {
          analystRegistry.analystInfo(a).then( result => { // idx, addr
            console.log('got analyst info',result)
            let i = 0
            var res = {
              id: result[ i++ ].toNumber(),
              email: web3.toAscii(result[ i++ ]).replace(/\0/g,''),
              status: result[ i++ ].toNumber(),
              referred_by: result[ i++ ].toNumber(),
              reputation: result[ i++ ].toNumber(),
              lead: result[ i++ ],
              token_balance: result[ i++ ].toNumber(),
              referral_balance: result[ i++ ].toNumber(),
              num_rounds_active: result[ i++ ].toNumber(),
              num_rounds_finished: result[ i++ ].toNumber(),
              num_reward_events: result[ i++ ].toNumber(),
              num_referrals: result[ i++ ].toNumber()
            }
            res.name = res.email.slice(0,res.email.indexOf('@'))
            console.log('got analyst',res)
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
