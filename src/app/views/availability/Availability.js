// @flow weak

import React, {  PureComponent } from 'react'
import { Link } from 'react-router-dom'
import Moment                    from 'react-moment'
import PropTypes                 from 'prop-types'
import { Panel } from 'react-bootstrap'
import { AnimatedView } from '../../components'

import { appConfig } from '../../config'

const dateView = ({value,convert=true}) =>
  <Moment className="text-warning" format="dddd YYYY-MM-DD HH:mm" date={ new Date(convert?value*1000:value) } />

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

const colDefault = 'col-md-3 col-xs-3 text-center'

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
    },
    {
      name: 'Status',
      className: colDefault,
      dataIndex: 'analyst_status',
      renderer: ({value,id,lead}) => 
        value && appConfig.CYCLE_STATUSES[value] || 
        <div>
          <button type="button" className="btn btn-primary btn-xs" onClick={(e)=> this.signup(e,id)}>
            <span className="glyphicon glyphicon-star" aria-hidden="true"></span> Sign-Up
          </button>
          {this.canLead() && <button type="button" className="btn btn-primary btn-xs" onClick={(e)=> this.signup(e,id,true)}>
            <span className="glyphicon glyphicon-star" aria-hidden="true"></span> Sign-Up Lead
          </button> || ""}
        </div>
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
    return this.props.user.info.user.reputation >= appConfig.REPUTATION_LEAD
  }

  signup(e,id,lead=false) {
    const { actions: { cycleSignup } } = this.props
    console.log('signup',id,lead)
    cycleSignup( id,lead )
  }

  render() {
    const { cycles, user } = this.props
    console.log('cycles',cycles)
    let columns = this.columns
    let timenow = cycles.cron
    let comingSignupCycles = cycles.data.filter( cycle => !cycle.analyst_status && cycle.timestart*1000 > cycles.cronInfo )
    let comingCycles = cycles.data.filter( cycle => cycle.analyst_status && cycle.timestart*1000 > cycles.cronInfo )
    console.log('coming cycles',comingCycles)
    return(
      <AnimatedView>
        <small className="pull-right">time last checked: { dateView( { value:cycles.cronInfo,convert:false} ) }</small> 
        { !comingSignupCycles.length ? <h2>All rounds signed up, check back later</h2> :
        <div>
          <h2>Sign up for coming rounds</h2>
          <Panel>
            <Panel.Heading>
              <Panel.Title>Upcoming Rounds Available...</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <div className="row">
                { columns.map( col => <div className={col.className}>{col.name}</div> )
                }
              </div>
              { comingSignupCycles.map( (cycle,rowIdx) => { 
                  let cols = columns.map( (col,colIdx) => 
                    <div className={col.className}>
                      { col.renderer 
                        && col.renderer({column:colIdx, row:rowIdx, id:cycle.id, lead:this.canLead(), value:cycle[col.dataIndex]}) 
                        || cycle[col.dataIndex] 
                      }
                    </div> 
                  )
                  return <div className="row">{cols}</div>
                })
              }
              {/*<div className="row"> 
                <button type="button" className="btn btn-primary" onClick={this.signup}>
                  <span className="glyphicon glyphicon-box" aria-hidden="true"></span> Submit
                </button>
              </div>
              */}
            </Panel.Body>
          </Panel>
        </div>
        }
        { !comingCycles.length ? "" : 
        <div> 
          <Panel>
            <Panel.Heading>
              <Panel.Title>Rounds Signed Up</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <div className="row">
                { columns.map( col => <div className={col.className}>{col.name}</div> )
                }
              </div>
              { comingCycles.map( (cycle,rowIdx) => { 
                  let cols = columns.map( (col,colIdx) => 
                    <div className={col.className}>
                      { col.renderer 
                        && col.renderer({column:colIdx,row:rowIdx, value:cycle[col.dataIndex]}) 
                        || cycle[col.dataIndex] 
                      }
                    </div> 
                  )
                  return <div className="row">{cols}</div>
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
