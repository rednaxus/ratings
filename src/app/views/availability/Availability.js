// @flow weak

import React, {  PureComponent } from 'react'
import { Link } from 'react-router-dom'
import Moment                    from 'react-moment'
import PropTypes                 from 'prop-types'
import { Panel } from 'react-bootstrap'
import { 
  AnimatedView, 
  Breadcrumb 
} from '../../components'
import * as _ from 'lodash'

import { appConfig as config } from '../../config'

const dateView = ({value,convert=true}) =>
  <Moment className="text-purple" format="dddd YYYY-MM-DD" date={ new Date(convert?value*1000:value) } />

/*
                          id={id} 
                          timestart={timestart}
                          timefinish={timefinish} 
                          status={status}
                          num_jurists_available={num_jurists_available}
                          num_jurists_assigned={num_jurists_assigned}
                          num_leads_available={num_leads_available}
                          num_leads_assigned={num_leads_assigned}

*/

const colDefault = 'col-md-2 col-xs-2 text-center'
//const colDefault2 = 'col-md-2 col-md-2 text-center'

class Availability extends PureComponent {
  enterAnimationTimer = null

  columns = [
    {
      name: 'Cycle',
      className: 'col-md-1 col-xs-1 text-center',
      dataIndex: 'id'
    },
    {
      name: 'Start',
      className: colDefault,
      dataIndex: 'timestart',
      //renderer: ({column,value,row}) =>
      renderer: dateView  
    },
    {
      name: 'Finish',
      className: colDefault,
      dataIndex: 'timefinish',
      renderer: dateView
    }
  ]

  signupColumns = [
    ...this.columns,
    {
      name: 'Sign-Up',
      className: colDefault,
      dataIndex: 'analyst_status',
      renderer: ( { cycle, id } ) => // i.e. cycle
        <div>
        { cycle.role[1].num_volunteers < config.ROUNDS_PER_CYCLE_JURIST && 
          <button type="button" className="btn btn-primary btn-xs" onClick={(e)=> this.signup(e,id)}>
            <span className="glyphicon glyphicon-star" aria-hidden="true"></span> { config.role_name[1] }
          </button> || ""
        }
        { this.canLead() && 
          cycle.role[0].num_volunteers < config.ROUNDS_PER_CYCLE_LEAD && 
          <button type="button" className="btn btn-primary btn-xs" onClick={(e)=> this.signup(e,id,true)}>
            <span className="glyphicon glyphicon-star" aria-hidden="true"></span> { config.role_name[0] }
          </button> || ""
        }
        </div>
    }
  ]

  activeColumns = [
    ...this.columns,
    {
      name: 'Token',
      className: colDefault,
      dataIndex: 'token',
      renderer: ( { cycle, id } ) => {
        console.log('tokens',this.props.tokens,'token',cycle)
        return <Link to={"/token/"+cycle.token}>{ _.find(this.props.tokens,['id',cycle.token]).symbol }</Link>
      }
    },{
      name: 'Round',
      className: colDefault,
      dataIndex: 'round',
      renderer: ( { cycle, id } ) => 
        <Link to={"/round/"+cycle.round}>{ cycle.round }</Link>
    },{
      name: 'Role',
      dataIndex: 'role',
      className: colDefault
    }
  ]

  volunteerColumns = [
    ...this.columns,
    {
      name: 'Role',
      className: colDefault,
      dataIndex: 'role', 
    },{
      name: 'Confirm',
      className: colDefault,
      renderer: ( { value, id } ) =>
        <button type="button" className="btn btn-primary btn-xs" onClick={(e)=> this.confirm(e,id,value)}>
          <span className="glyphicon glyphicon-star" aria-hidden="true" /> Confirm
        </button>
    }
  ]

  confirmedColumns = [
    ...this.columns,
    {
      name: 'Role',
      className: colDefault,
      dataIndex: 'role'
    }
  ]

  finishedColumns = [
    ...this.activeColumns,
    {
      name: 'Earnings',
      className: colDefault,
      dataIndex: 'earnings',
      renderer: ( { value, id } ) => 
        <span>{ value }</span>
    }
  ]

  componentWillMount() {
    const { actions: { enterAvailability } } = this.props;
    enterAvailability();
  }

  componentDidMount() {
    const { actions: { fetchCyclesDataIfNeeded, fetchCronInfo } } = this.props
    fetchCyclesDataIfNeeded()
    fetchCronInfo()
  }

  componentWillUnmount() {
    const { actions: { leaveAvailability } } = this.props
    leaveAvailability()
    clearTimeout(this.enterAnimationTimer)
  }

  canLead() { 
    return this.props.user.reputation >= config.REPUTATION_LEAD
  }

  signup( e, id, role ) {
    const { actions: { cycleSignup } } = this.props
    console.log('signup',id,lead)
    cycleSignup( id,lead )
  }
  
  confirm( e, id, role ) {
    const { actions: { cycleConfirm } } = this.props
    console.log('signup',id,lead)
    cycleConfirm( id,lead )
  }

  cyclesPanel({cycles,title}) {
    console.log('cycles panel',cycles,title)
    return 
  }

  render() {
    const { cycles, rounds, user, cronInfo, tokens } = this.props
    console.log('props',this.props,tokens)
    //let columns = this.columns
    let signupColumns = this.signupColumns
    let activeColumns = this.activeColumns
    let finishedColumns = this.finishedColumns
    let confirmedColumns = this.confirmedColumns
    let volunteerColumns = this.volunteerColumns

    let now = cronInfo / 1000
    let nextTime = config.cycleTime( config.cycleIdx( now ) + 1 )
    let activeNow = config.cycleIdx( now )
    console.log('cycles',cycles,now,nextTime)

    const isVolunteer = cycle => cycle.role[ 0 ].num_volunteers || cycle.role[ 1 ].num_volunteers
    const isConfirmed = cycle => cycle.role[ 0 ].num_confirms || cycle.role[ 1 ].num_confirms
    const hasRounds = cycle => cycle.role.length && (cycle.role[ 0 ].num_rounds || cycle.role[ 1 ].num_rounds)
    const hasSignups = cycle => !isVolunteer( cycle ) && !isConfirmed( cycle ) && !hasRounds( cycle ) 
    const isFuture = cycle => cycle.id > activeNow
    const isActive = cycle => cycle.timestart >= now && cycle.timestart < nextTime 
    const isFinished = cycle => activeNow != cycle.id && cycle.timestart < now

    const getRound = round_id => {
      console.log('round_id',round_id,'rounds',...rounds)
      let round = _.find( rounds,['id',round_id] )
      console.log('found',round)
      return round
    }

    

    let comingVolunteerCycles = [] // signed up, need to confirm
    cycles.forEach ( cycle => {
      if ( !isVolunteer( cycle ) ) return
      cycle.role.forEach( (role,idx) => {
        for ( let i = 0; i < role.num_volunteers; i++ ){
          comingVolunteerCycles.push( { ...cycle, role: config.role_name[idx] } )
        }
      } )
    } )

    let comingConfirmedCycles = [] // signed up, need to confirm
    cycles.forEach ( cycle => {
      if ( !isVolunteer( cycle ) ) return
      cycle.role.forEach( ( role,idx ) => {
        for ( let i = 0; i < role.num_confirms; i++ ){
          comingConfirmedCycles.push( { ...cycle, role: config.role_name[idx] } )
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
          console.log('tokens',...tokens)
          let round = _.find( rounds,['id',role.rounds[ i ]] )
          //let token = _.find( tokens,['id',round.covered_token] )
          activeCycles.push(
            { ...cycle,role: config.role_name[idx], token: round.covered_token, round: role.rounds[ i ] }
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
            { ...cycle, role: role_name[idx], token: round.covered_token, round: role.rounds[ i ]}
          )
        }
      } )
    } )

    console.log('signup cycles',comingSignupCycles)
    console.log('volunteer cycles',comingVolunteerCycles)
    console.log('confirmed cycles',comingConfirmedCycles)
    console.log('active cycles',activeCycles)
    console.log('finished cycles',finishedCycles)

    return(
      <AnimatedView>
        <Breadcrumb path={["dashboard","availability"]}></Breadcrumb>
        <small className="pull-right">time last checked: { dateView( { value:cronInfo,convert:false} ) }</small> 
         { !comingVolunteerCycles.length ? "" :
        <div>
          <h2 className="text-red">Awaiting confirmations</h2>
          <Panel>
            <Panel.Heading>
              <Panel.Title>Rounds forming...confirm now</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <div className="row">
              { 
                volunteerColumns.map( ( col, colIdx ) => 
                  <div key={colIdx} className={col.className}>{col.name}</div> 
                )
              }
              </div>
              { comingVolunteerCycles.map( ( cycle, rowIdx ) => {
                  let cols = confirmColumns.map( ( col,colIdx ) => 
                    <div className={ col.className } key={ colIdx }>
                    { 
                      col.renderer && col.renderer({
                        column: colIdx, 
                        row:    rowIdx, 
                        id:     cycle.id, 
                        value:  cycle[col.dataIndex],
                        cycle:  cycle
                      }) || cycle[col.dataIndex] 
                    }
                    </div> 
                  )
                  return <div className="row" key={rowIdx}>{cols}</div>
                })
              }
            </Panel.Body>
          </Panel>
         </div>
        }
        <div>
          <Panel>
            <Panel.Heading>
              <Panel.Title>Confirmed rounds, awaiting start</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <div className="row">
              { 
                confirmedColumns.map( ( col, colIdx ) => 
                  <div key={colIdx} className={col.className}>{col.name}</div> 
                )
              }
              </div>
              { comingConfirmedCycles.map( ( cycle, rowIdx ) => {
                  let cols = confirmedColumns.map( ( col,colIdx ) => 
                    <div className={ col.className } key={ colIdx }>
                    { 
                      col.renderer && col.renderer({
                        column: colIdx, 
                        row:    rowIdx, 
                        id:     cycle.id, 
                        value:  cycle[ col.dataIndex ],
                        cycle:  cycle
                      }) || cycle[ col.dataIndex ] 
                    }
                    </div> 
                  )
                  return <div className="row" key={rowIdx}>{cols}</div>
                })
              }
            </Panel.Body>
          </Panel>
         </div>
        }
        { !activeCycles.length ? "" : 
        <div> 
          <Panel>
            <Panel.Heading>
              <Panel.Title>Currently active rounds</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <div className="row">
              { 
                activeColumns.map( (col,colIdx) => 
                  <div className={col.className} key={colIdx}>{col.name}</div> )
              }
              </div>
              { activeCycles.map( ( cycle, rowIdx ) => { 
                  let cols = activeColumns.map( ( col, colIdx ) => 
                    <div className={col.className} key={colIdx}>
                    { 
                      col.renderer && col.renderer({
                        column:colIdx,
                        row:rowIdx, 
                        value:cycle[col.dataIndex],
                        cycle: cycle
                      }) || cycle[col.dataIndex] 
                    }
                    </div> 
                  )
                  return <div className="row" key={rowIdx} >{cols}</div>
                })
              }
            </Panel.Body>
          </Panel>
        </div>
        }
        { !comingSignupCycles.length ? <h2>All rounds signed up</h2> :
        <div>
          <h2 className="text-red">Sign up for coming rounds</h2>
          <Panel>
            <Panel.Heading>
              <Panel.Title>Upcoming rounds available....</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <div className="row">
              { 
                signupColumns.map( (col,colIdx) => <div key={colIdx} className={col.className}>{col.name}</div> )
              }
              </div>
              { comingSignupCycles.map( ( cycle, rowIdx ) => { 
                  let cols = signupColumns.map( ( col, colIdx ) => 
                    <div className={col.className} key={colIdx}>
                      { col.renderer 
                        && col.renderer({
                          column:   colIdx, 
                          row:      rowIdx, 
                          id:       cycle.id, 
                          value:    cycle[ col.dataIndex ],
                          cycle:    cycle
                        }) || cycle[col.dataIndex] 
                      }
                    </div> 
                  )
                  return <div className="row" key={rowIdx}>{cols}</div>
                })
              }
            </Panel.Body>
          </Panel>
         </div>
        }
        { !finishedCycles.length ? "" : 
        <div>
          <hr/>
          <Panel>
            <Panel.Heading>
              <Panel.Title>Evaluation rounds finished</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <div className="row">
              { 
                finishedColumns.map( ( col,colIdx ) => 
                  <div className={col.className} key={colIdx}>{col.name}</div> )
              }
              </div>
              { finishedCycles.map( (cycle,rowIdx) => { 
                  let cols = finishedColumns.map( (col,colIdx) => 
                    <div className={col.className} key={colIdx}>
                      { col.renderer 
                        && col.renderer({
                          column:   colIdx,
                          row:      rowIdx, 
                          value:    cycle[ col.dataIndex ],
                          cycle:    cycle
                        }) 
                        || cycle[col.dataIndex] 
                      }
                    </div> 
                  )
                  return <div className="row" key={rowIdx}>{cols}</div>
                })
              }
            </Panel.Body>
          </Panel>
        </div>
        }

      </AnimatedView>
    );
  }
}

Availability.propTypes= {
  actions: PropTypes.shape({
    enterAvailability: PropTypes.func.isRequired,
    leaveAvailability: PropTypes.func.isRequired,
    fetchCyclesDataIfNeeded: PropTypes.func.isRequired,
    fetchCronInfo: PropTypes.func.isRequired
  })
}

export default Availability
