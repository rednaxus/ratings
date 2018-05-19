
import * as _ from 'lodash'

import { appConfig as config } from '../config'


export const getCyclesByStatus = ( { cycles, rounds, timestamp, tokens } ) => {

  let now = timestamp // cronInfo / 1000
  let nextTime = config.cycleTime( config.cycleIdx( now ) + 1 )
  let activeNow = config.cycleIdx( now )
  //console.log('cycles',cycles,now,nextTime)

  const isVolunteer = cycle => cycle.role[ 0 ].num_volunteers || cycle.role[ 1 ].num_volunteers
  const isConfirmed = cycle => cycle.role[ 0 ].num_confirms || cycle.role[ 1 ].num_confirms
  const hasRounds = cycle => cycle.role.length && (cycle.role[ 0 ].num_rounds || cycle.role[ 1 ].num_rounds)
  const hasSignups = cycle => !isVolunteer( cycle ) && !isConfirmed( cycle ) && !hasRounds( cycle ) 
  const isFuture = cycle => cycle.id > activeNow
  const isActive = cycle => cycle.timestart >= now && cycle.timestart < nextTime 
  const isFinished = cycle => activeNow != cycle.id && cycle.timestart < now

  const getRound = round_id => {
    //console.log('round_id',round_id,'rounds',...rounds)
    let round = _.find( rounds,['id',round_id] )
    //console.log('found',round)
    return round
  }

  

  let comingVolunteerCycles = [] // signed up, need to confirm
  cycles.forEach ( cycle => {
    if ( !isVolunteer( cycle ) ) return
    cycle.role.forEach( ( role, idx ) => {
      for ( let i = 0; i < role.num_volunteers; i++ ){
        comingVolunteerCycles.push( { ...cycle, role: idx } )
      }
    } )
  } )

  let comingConfirmedCycles = [] // signed up, confirmed
  cycles.forEach ( cycle => {
    if ( !isConfirmed( cycle ) ) return
    cycle.role.forEach( ( role,idx ) => {
      for ( let i = 0; i < role.num_confirms; i++ ){
        comingConfirmedCycles.push( { ...cycle, role: idx } )
      }
    })
  })

  let comingSignupCycles = cycles.filter( isFuture )

  let activeCycles = []
  cycles.forEach( cycle => {
    if ( !isActive( cycle ) || !hasRounds( cycle ) ) return
    cycle.role.forEach( (role,idx) => {
      for ( let i = 0; i < role.num_rounds; i++ ){
        console.log('rounds for role',role,i,role.rounds)
        console.log('tokens',tokens)
        let round = _.find( rounds,['id',role.rounds[ i ]] )
        //let token = _.find( tokens,['id',round.covered_token] )
        activeCycles.push(
          { ...cycle, role: idx, token: round.covered_token, round: role.rounds[ i ] }
        )
      }        
    })
  })    
  
  let finishedCycles = []
  cycles.forEach ( cycle => {
    if ( !isFinished( cycle ) ) return
    cycle.role.forEach( (role,idx) => {
      for ( let i = 0; i < role.num_rounds; i++ ){
        let round = _.find( rounds,['id',role.rounds[ i ]] )
        //let token = _.find( tokens,['id',round.covered_token] )
        finishedCycles.push(
          { ...cycle, role: idx, token: round.covered_token, round: role.rounds[ i ]}
        )
      }
    } )
  } )

  console.log('signup cycles',comingSignupCycles)
  console.log('volunteer cycles',comingVolunteerCycles)
  console.log('confirmed cycles',comingConfirmedCycles)
  console.log('active cycles',activeCycles)
  console.log('finished cycles',finishedCycles)
  return ( {
    comingSignupCycles, 
    comingVolunteerCycles, 
    comingConfirmedCycles,
    activeCycles,
    finishedCycles
  } )

}
