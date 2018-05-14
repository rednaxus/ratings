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

import { getCyclesByStatus } from '../../services/rounds'

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
          <button type="button" className="btn btn-primary btn-xs" onClick={(e)=> this.signup( e, id, 1 )}>
            <span className="glyphicon glyphicon-star" aria-hidden="true"></span> { config.role_name[1] }
          </button> || ""
        }
        { this.canLead() && 
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
      className: colDefault,
      renderer: ( { cycle, id } ) => config.role_name[ cycle.role ]
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
    ...this.activeColumns,
    {
      name: 'Earnings',
      className: colDefault,
      dataIndex: 'earnings'
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
    const { cycles, rounds, user, cronInfo, tokens } = this.props
    console.log('props',this.props,tokens)
    //let columns = this.columns
    let signupColumns = this.signupColumns
    let activeColumns = this.activeColumns
    let finishedColumns = this.finishedColumns
    let confirmedColumns = this.confirmedColumns
    let volunteerColumns = this.volunteerColumns

    let {     
      comingSignupCycles, 
      comingVolunteerCycles, 
      comingConfirmedCycles,
      activeCycles,
      finishedCycles
    } = getCyclesByStatus( { cycles, rounds, timestamp: cronInfo / 1000, tokens } )

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
                  let cols = volunteerColumns.map( ( col,colIdx ) => 
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
        { !comingConfirmedCycles.length ? "" : 
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
                        column:   colIdx,
                        row:      rowIdx, 
                        value:    cycle[col.dataIndex],
                        id:       cycle.id,
                        cycle:    cycle
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
                          id:       cycle.id,
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
