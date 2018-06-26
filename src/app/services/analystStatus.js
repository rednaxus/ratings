
//import * as _ from 'lodash'

const config = require('../config/appConfig')


const isVolunteer = cycle => cycle.role.reduce( ( accum, r ) => accum + r.num_volunteers, 0 )
const isConfirmed = cycle => cycle.role.reduce( ( accum, r ) => accum + r.num_confirms, 0 )
const hasRounds = cycle => cycle.role.length && ( cycle.role.reduce( ( accum, r ) => accum + r.num_rounds, 0 ) )
const hasSignups = cycle => !isVolunteer( cycle ) && !isConfirmed( cycle ) && !hasRounds( cycle ) 
const isFuture = cycle => cycle.id > activeNow 
/*{ 
  console.log(`isfuture ${cycle.id}:${config.cycleTime(cycle.id)} ${activeNow}:${now} ...isFuture: ${cycle.id > activeNow}`)
  return cycle.id > activeNow
}
*/
const isActive = cycle => ['active','activating'].includes( config.STATUSES[ cycle.status ] )
const isFinished = cycle => activeNow != cycle.id && cycle.timestart < now
const isConfirmDue = cycle => {
  //let phase = config.cyclePhase( cycle.id , now )
  //console.log(`confirm due check phase: ${phase} cycle ${cycle.id}, timestamp:${now}`)
  return config.cyclePhase( cycle.id - 1, now ) == 1 //config.CYCLE_FRACTIONS // due during first phase of previous because of way cycles overlap
}
let now
let nextTime
let activeNow

let s='-*-*-*-'

const setTime = timestamp => {
  now = timestamp // cronInfo 
  nextTime = config.cycleTime( config.cycleIdx( now ) + 1 )
  activeNow = config.cycleIdx( now )
}

const AnalystStatus = {
  isConfirmDue: ( cycle, timestamp ) => { 
    setTime( timestamp )
    return isConfirmDue( cycle )
  }, 
  isFinished: ( cycle, timestamp ) => {
    setTime( timestamp )
    return isFinished( cycle ) 
  },
  isVolunteer: ( cycle, timestamp ) => {
    setTime( timestamp )
    return isVolunteer( cycle )
  },
  isFuture: ( cycle, timestamp ) => {
    setTime( timestamp )
    return isFuture( cycle )
  },
  cyclesByStatus: ( { cycles, rounds, timestamp, tokens } ) => {

    setTime( timestamp )
    //cycles.forEach( cycle => console.log(`${s}cycle ${cycle.id}:${config.cycleTime(cycle.id)}`) )
    //console.log(`${s}cycles`,cycles, activeNow, now, nextTime)
    const getRound = round_id => rounds.find( round => round.id == round_id )

    let comingSignupCycles = cycles.filter( isFuture )

    let comingVolunteerCycles = [] // signed up, need to confirm
    cycles.forEach ( cycle => {
      if ( !isFuture( cycle ) || !isVolunteer( cycle ) ) return
      cycle.role.forEach( ( role, idx ) => {
        for ( let i = 0; i < role.num_volunteers; i++ ){
          comingVolunteerCycles.push( { ...cycle, role: idx } )
        }
      })
    })

    let comingConfirmedCycles = [] // signed up, confirmed
    cycles.forEach ( cycle => {
      if ( !isFuture( cycle ) || !isConfirmed( cycle ) ) return
      cycle.role.forEach( ( role,idx ) => {
        for ( let i = 0; i < role.num_confirms; i++ ){
          comingConfirmedCycles.push( { ...cycle, role: idx } )
        }
      })
    })


    let activeCycles = []
    cycles.forEach( cycle => {
      if ( !isActive( cycle ) || !hasRounds( cycle ) ) return
      cycle.role.forEach( (role,idx) => {
        for ( let i = 0; i < role.num_rounds; i++ ){
          //console.log('active rounds for role',role,i,role.rounds)
          let round = getRound( role.rounds[ i ] ) || null  // fix me! make sure round is fetched before being here
          activeCycles.push(
            { ...cycle, role: idx, token: round ? round.covered_token: null, round: role.rounds[ i ] }
          )
        }        
      })
    })    
    
    let finishedCycles = []
    cycles.forEach ( cycle => {
      if ( !isFinished( cycle ) ) return
      cycle.role.forEach( (role,idx) => {
        for ( let i = 0; i < role.num_rounds; i++ ){
          //console.log('finished rounds for role',role,i,role.rounds)
          let round = getRound( role.rounds[ i ] ) || null
          finishedCycles.push(
            { ...cycle, role: idx, token: round ? round.covered_token: null, round: role.rounds[ i ]}
          )
        }
      } )
    } )

    let result = {
      comingSignupCycles, 
      comingVolunteerCycles, 
      comingConfirmedCycles,
      activeCycles,
      finishedCycles
    }
    console.log(`${s}result`, result )

    return result
  }  
}

module.exports = AnalystStatus

