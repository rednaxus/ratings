
//import * as _ from 'lodash'

const config = require('../config/appConfig')


const isVolunteer = cycle => cycle.role[ 0 ].num_volunteers || cycle.role[ 1 ].num_volunteers
const isConfirmed = cycle => cycle.role[ 0 ].num_confirms || cycle.role[ 1 ].num_confirms
const hasRounds = cycle => cycle.role.length && (cycle.role[ 0 ].num_rounds || cycle.role[ 1 ].num_rounds)
const hasSignups = cycle => !isVolunteer( cycle ) && !isConfirmed( cycle ) && !hasRounds( cycle ) 
const isFuture = cycle => cycle.id > activeNow
const isActive = cycle => cycle.timestart >= now && cycle.timestart < nextTime 
const isFinished = cycle => activeNow != cycle.id && cycle.timestart < now
const isConfirmDue = cycle => config.cyclePhase( cycle - 1, now ) == config.CYCLE_FRACTIONS - 1 // due at last fraction (e.g. 3)

let now
let nextTime
let activeNow

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

    //console.log('cycles',cycles,now,nextTime)



    const getRound = round_id => {
      let round = rounds.find( round => round.id == round_id )
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
          //console.log('rounds for role',role,i,role.rounds)
          let round = getRound( role.rounds[ i ] )
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
          let round = getRound( role.rounds[ i ] )
          finishedCycles.push(
            { ...cycle, role: idx, token: round.covered_token, round: role.rounds[ i ]}
          )
        }
      } )
    } )

    //console.log('signup cycles',comingSignupCycles)
    //console.log('volunteer cycles',comingVolunteerCycles)
    //console.log('confirmed cycles',comingConfirmedCycles)
    //console.log('active cycles',activeCycles)
    //console.log('finished cycles',finishedCycles)
    return ( {
      comingSignupCycles, 
      comingVolunteerCycles, 
      comingConfirmedCycles,
      activeCycles,
      finishedCycles
    } )
  }  
}

module.exports = AnalystStatus

