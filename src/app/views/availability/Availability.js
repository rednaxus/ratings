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
      renderer: ({value,id}) => 
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

  cyclesPanel({cycles,title}) {
    console.log('cycles panel',cycles,title)
    return 
  }

  render() {
    const { cycles, user } = this.props
    let columns = this.columns
    let now = cycles.cronInfo / 1000
    console.log('cycles',cycles,now)

    let comingSignupCycles = cycles.data.filter( cycle => !cycle.analyst_status && cycle.timestart > now )
    let comingCycles = cycles.data.filter( cycle => cycle.analyst_status && cycle.timestart > now )
    let activeCycles = cycles.data.filter( cycle => cycle.analyst_status && cycle.timestart <= now && cycle.timefinish >= now )
    console.log('signup cycles',comingSignupCycles)
    console.log('coming cycles',comingCycles)
    console.log('active cycles',activeCycles)
    return(
      <AnimatedView>
        <Breadcrumb path={["dashboard","availability"]}></Breadcrumb>
        <small className="pull-right">time last checked: { dateView( { value:cycles.cronInfo,convert:false} ) }</small> 
        { !comingSignupCycles.length ? <h2>All rounds signed up, check back later</h2> :
        <div>
          <h2>Sign up for coming rounds</h2>
          <Panel>
            <Panel.Heading>
              <Panel.Title>Upcoming rounds available....</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <div className="row">
              { 
                columns.map( (col,colIdx) => <div key={colIdx} className={col.className}>{col.name}</div> )
              }
              </div>
              { comingSignupCycles.map( (cycle,rowIdx) => { 
                  let cols = columns.map( (col,colIdx) => 
                    <div className={col.className} key={colIdx}>
                      { col.renderer 
                        && col.renderer({column:colIdx, row:rowIdx, id:cycle.id, value:cycle[col.dataIndex]}) 
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
        { !comingCycles.length ? "" : 
        <div>
          <hr/>
          <Panel>
            <Panel.Heading>
              <Panel.Title>Rounds signed up</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <div className="row">
                { columns.map( (col,colIdx) => <div className={col.className} key={colIdx}>{col.name}</div> )
                }
              </div>
              { comingCycles.map( (cycle,rowIdx) => { 
                  let cols = columns.map( (col,colIdx) => 
                    <div className={col.className} key={colIdx}>
                      { col.renderer 
                        && col.renderer({column:colIdx,row:rowIdx, value:cycle[col.dataIndex]}) 
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
        { !activeCycles.length ? "" : 
        <div> 
          <Panel>
            <Panel.Heading>
              <Panel.Title>Currently active rounds</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <div className="row">
                { columns.map( (col,colIdx) => <div className={col.className} key={colIdx}>{col.name}</div> )
                }
              </div>
              { activeCycles.map( (cycle,rowIdx) => { 
                  let cols = columns.map( (col,colIdx) => 
                    <div className={col.className} key={colIdx}>
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
