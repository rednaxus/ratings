// @flow weak

import React, {  PureComponent } from 'react'
import { Link } from 'react-router-dom'
import Moment                    from 'react-moment'
import PropTypes                 from 'prop-types'
import { Panel } from 'react-bootstrap'
import { AnimatedView } from '../../components'

import { appConfig } from '../../config'

const dateView = ({value}) =>
  <Moment className="text-warning" format="YYYY-MM-DD HH:mm" date={ new Date(value*1000) } />

const colDefault = 'col-md-3 col-xs-3 text-center'
const columns = [
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
    renderer: ({value}) => 
      value && appConfig.CYCLE_STATUSES[value] || 
      <button type="button" className="btn btn-primary btn-xs">
        <span className="glyphicon glyphicon-star" aria-hidden="true"></span> Sign-Up
      </button>
  }
]
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

class Availability extends PureComponent {
  enterAnimationTimer = null;


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
    const { actions: { leaveAvailability } } = this.props;
    leaveAvailability()
    clearTimeout(this.enterAnimationTimer)
  }

  render() {
    const { cycles } = this.props
    console.log('cycles',cycles)

    return(
      <AnimatedView>
        <Panel>
          <Panel.Heading>
            <Panel.Title>Upcoming Rounds Available...sign up</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <div className="row">
              { columns.map( col => <div className={col.className}>{col.name}</div> )
              }
            </div>
            { cycles.data.map( (cycle,rowIdx) => { 
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
