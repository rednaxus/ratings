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
//import * as _ from 'lodash'

import config from '../../config/appConfig'

import { cyclesByStatus } from '../../services/analystStatus'

const dateView = ({value,timestamp,convert=true,abs=false}) =>
  abs ? 
  <Moment format="YYYY-MM-DD" className="text-purple" date={ new Date(convert?value*1000:value) } /> :
  <Moment from={timestamp*1000} className="text-purple" date={ new Date(convert?value*1000:value) } /> //format="YYYY-MM-DD" 

const timeView = value =>
  <Moment className="text-purple" format="YYYY-MM-DD hh:mm" date={ new Date( value*1000 ) } />

const colDefault = 'col-md-1 col-xs-1 text-center'
const colDefault2 = 'col-md-2 col-xs-2 text-center'


const s = '**-**'

class Scheduling extends PureComponent {
  enterAnimationTimer = null

  columns = [
    {
      name: 'Cycle',
      className: 'col-md-1 col-xs-1 text-center',
      dataIndex: 'id'
    },
    {
      name: 'Start',
      className: colDefault2,
      dataIndex: 'timestart',
      renderer: ({ value, timestamp }) => dateView( { value, timestamp } )  
    },
    {
      name: 'Finish',
      className: colDefault2,
      dataIndex: 'timefinish',
      renderer: ({ value, timestamp, abs=false }) => 
        dateView({ value: value - config.cyclePhaseTime(2), timestamp, abs })
    }
  ]

  signupColumns = [
    ...this.columns,
    {
      name: 'Sign-Up',
      className: colDefault2,
      dataIndex: 'analyst_status',
      renderer: ( { cycle, id } ) => // i.e. cycle
        <div>
        { cycle.role[1].num_volunteers < config.ROUNDS_PER_CYCLE_JURIST && 
          <button type="button" className="btn btn-primary btn-xs" onClick={(e)=> this.signup( e, id, 1 )}>
            <span className="glyphicon glyphicon-star" aria-hidden="true"></span> { config.role_name[1] }
          </button> || ""
        }
        { this.props.user.lead && 
          cycle.role[0].num_volunteers < config.ROUNDS_PER_CYCLE_LEAD && 
          <button type="button" className="btn btn-primary btn-xs" onClick={(e)=> this.signup( e, id, 0 )}>
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
        //console.log('tokens',this.props.tokens,'token',cycle)
        return <Link to={"/token/"+cycle.token}>{ this.props.tokens.find( token => token.id == cycle.token ).name }</Link>
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
      className: colDefault,
      renderer: ( { cycle, id } ) => config.role_name[ cycle.role ]
    },{
      name: 'Status',
      dataIndex: 'analyst_status',
      className: colDefault2,
      renderer: ( { cycle, id, round } ) => round ? config.STATUSES[round.analyst_status] : ''
    }
  ]

  volunteerColumns = [
    ...this.columns,
    {
      name: 'Role',
      className: colDefault,
      dataIndex: 'role', 
      renderer: ( { cycle, id } ) => config.role_name[ cycle.role ]      
    },{
      name: 'Confirm',
      className: colDefault,
      renderer: ( { cycle, id } ) =>
        <button type="button" className="btn btn-primary btn-xs" onClick={(e)=> this.confirm( e, id, cycle.role )}>
          <span className="glyphicon glyphicon-star" aria-hidden="true" /> Confirm
        </button>
    }
  ]

  confirmedColumns = [
    ...this.columns,
    {
      name: 'Role',
      className: colDefault,
      dataIndex: 'role',
      renderer: ( { cycle, id } ) => config.role_name[ cycle.role ]
    }
  ]

  finishedColumns = [
    ...this.columns,
    {
      name: 'Token',
      className: colDefault,
      dataIndex: 'token',
      renderer: ( { cycle, id } ) => 
        <Link to={"/token/"+cycle.token}>{ this.props.tokens.find( token => token.id == cycle.token ).name }</Link>
    },{
      name: 'Round',
      className: colDefault,
      dataIndex: 'round',
      renderer: ( { cycle, id } ) => 
        <Link to={"/round/"+cycle.round}>{ cycle.round }</Link>
    },{
      name: 'Role',
      dataIndex: 'role',
      className: colDefault,
      renderer: ( { cycle, id } ) => config.role_name[ cycle.role ]
    },{
      name: 'Earnings',
      className: colDefault2,
      dataIndex: 'earnings',
      renderer: ( { cycle, id } ) => {
        let rewardEvt = this.props.user.reward_events.find( reward => reward.ref == cycle.round ) 
        return rewardEvt ? rewardEvt.value + ' tokens': '...'
      }
    }
  ]

  componentWillMount() {
    const { actions: { enterScheduling } } = this.props;
    enterScheduling();
  }

  componentDidMount() {
    const { actions: { fetchCyclesDataIfNeeded, fetchCronInfo } } = this.props
    fetchCyclesDataIfNeeded()
    fetchCronInfo()
  }

  componentWillUnmount() {
    const { actions: { leaveScheduling } } = this.props
    leaveScheduling()
    clearTimeout(this.enterAnimationTimer)
  }

  signup( e, id, role ) {
    const { actions: { cycleSignup } } = this.props
    console.log( 'signup', id, role )
    cycleSignup( id, role )
  }
  
  confirm( e, id, role ) {
    const { actions: { cycleConfirm } } = this.props
    console.log('signup', id, role )
    cycleConfirm( id, role )
  }

  cyclesPanel( { cycles, title } ) {
    console.log('cycles panel',cycles,title)
    return 
  }

  render() {
    const { cycles, rounds, user, timestamp, tokens } = this.props
    console.log(`${s}user`,user)
    let currentCycle = config.cycleIdx( timestamp )
    //console.log('props',this.props,tokens)
    //let columns = this.columns
    let signupColumns = this.signupColumns
    let activeColumns = this.activeColumns
    let finishedColumns = this.finishedColumns
    let confirmedColumns = this.confirmedColumns
    let volunteerColumns = this.volunteerColumns

    let analystStatus = cyclesByStatus( { cycles, rounds, timestamp: timestamp, tokens } )
    /*{     
      comingSignupCycles, 
      comingVolunteerCycles, 
      comingConfirmedCycles,
      activeCycles,
      finishedCycles
    } 
    */
    analystStatus.confirmNeededCycles = analystStatus.comingVolunteerCycles.filter( cycle => cycle.id == currentCycle + 1 ) // only allow confirm one phase before next cycle
    //analystStatus.comingWaitCycles = analystStatus.comingVolunteerCycles.filter( cycle => cycle.id == currentCycle + 1 )
    console.log(`analyst status for cycles`,analystStatus)
    return(
      <AnimatedView>
        <Breadcrumb path={["dashboard","scheduling"]}></Breadcrumb>
        <div className="text-orange">Round Scheduling
          <small className="pull-right">time last checked: { timeView( timestamp ) }</small> 
        </div>
        { !analystStatus.confirmNeededCycles.length ? "" :
        <div>
          <Panel className="card card-style panel-active_large">
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
              { analystStatus.confirmNeededCycles.map( ( cycle, rowIdx ) => {
                  let cols = volunteerColumns.map( ( col,colIdx ) => 
                    <div className={ col.className } key={ colIdx }>
                    { 
                      col.renderer && col.renderer({
                        column: colIdx, 
                        row:    rowIdx, 
                        id:     cycle.id, 
                        value:  cycle[col.dataIndex],
                        cycle:  cycle,
                        timestamp: timestamp
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
        { !analystStatus.comingConfirmedCycles.length ? "" : 
        <div>
          <Panel className="card card-style panel-info">
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
              { analystStatus.comingConfirmedCycles.map( ( cycle, rowIdx ) => {
                  let cols = confirmedColumns.map( ( col,colIdx ) => 
                    <div className={ col.className } key={ colIdx }>
                    { 
                      col.renderer && col.renderer({
                        column: colIdx, 
                        row:    rowIdx, 
                        id:     cycle.id, 
                        value:  cycle[ col.dataIndex ],
                        cycle:  cycle,
                        timestamp: timestamp
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
        { !analystStatus.activeCycles.length ? "" : 
        <div> 
          <Panel className="card card-style panel-active_small">
            <Panel.Heading>
              <Panel.Title>Active rounds</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <div className="row">
              { 
                activeColumns.map( (col,colIdx) => 
                  <div className={col.className} key={colIdx}>{col.name}</div> )
              }
              </div>
              { analystStatus.activeCycles.map( ( cycle, rowIdx ) => { 
                  let cols = activeColumns.map( ( col, colIdx ) => 
                    <div className={col.className} key={colIdx}>
                    { 
                      col.renderer && col.renderer({
                        column:   colIdx,
                        row:      rowIdx, 
                        value:    cycle[col.dataIndex],
                        id:       cycle.id,
                        cycle:    cycle,
                        timestamp: timestamp,
                        round: rounds.find( round => round.id == cycle.round )
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
        { !analystStatus.comingSignupCycles.length ? <h2>All rounds signed up</h2> :
        <div>
          <Panel className="card card-style panel-active_large">
            <Panel.Heading>
              <Panel.Title>Upcoming Rounds--available...signup now!</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <div className="row">
              { 
                signupColumns.map( (col,colIdx) => <div key={colIdx} className={col.className}>{col.name}</div> )
              }
              </div>
              { analystStatus.comingSignupCycles.map( ( cycle, rowIdx ) => { 
                  let cols = signupColumns.map( ( col, colIdx ) => 
                    <div className={col.className} key={colIdx}>
                      { col.renderer 
                        && col.renderer({
                          column:   colIdx, 
                          row:      rowIdx, 
                          id:       cycle.id, 
                          value:    cycle[ col.dataIndex ],
                          cycle:    cycle,
                          timestamp: timestamp
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
        { !analystStatus.finishedCycles.length ? "" : 
        <div>
          <Panel className="card card-style panel-info">
            <Panel.Heading>
              <Panel.Title>Completed Rounds</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <div className="row">
              { 
                finishedColumns.map( ( col,colIdx ) => 
                  <div className={col.className} key={colIdx}>{col.name}</div> )
              }
              </div>
              { analystStatus.finishedCycles.map( (cycle,rowIdx) => { 
                  let cols = finishedColumns.map( (col,colIdx) => 
                    <div className={col.className} key={colIdx}>
                      { col.renderer 
                        && col.renderer({
                          column:   colIdx,
                          row:      rowIdx, 
                          value:    cycle[ col.dataIndex ],
                          id:       cycle.id,
                          cycle:    cycle,
                          timestamp: timestamp,
                          abs: true
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

Scheduling.propTypes= {
  actions: PropTypes.shape({
    enterScheduling: PropTypes.func.isRequired,
    leaveScheduling: PropTypes.func.isRequired,
    fetchCyclesDataIfNeeded: PropTypes.func.isRequired,
    fetchCronInfo: PropTypes.func.isRequired
  })
}

export default Scheduling
