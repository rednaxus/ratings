// @flow weak

import React, {  PureComponent } from 'react'
import { Link } from 'react-router-dom'
import Moment                    from 'react-moment'
import PropTypes                 from 'prop-types'
import { Panel } from 'react-bootstrap'
import { AnimatedView } from '../../components'


const columns = [
  {
    name: 'Cycle',
    className: 'col-md-2',
    dataIndex: 'id',
    renderer: ({column,value,row}) => {
      return <Link to={"/round/"+value} >{value}</Link>
    }
  },
  {
    name: 'Start',
    className: 'col-md-2',
    dataIndex: 'timestart'
  },
  {
    name: 'Length',
    className: 'col-md-2',
    dataIndex: 'period'
  },
  {
    name: 'Status',
    className: 'col-md-2',
    dataIndex: 'analyst_status'
  }
]
/*
                          id={id} 
                          timestart={timestart}
                          period={period} 
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
              { columns.map( col => {
                  <div className={col.className}>{col.name}</div>
                })
              }
            </div>
            { cycles.data.map( (cycle,idx) => { 
                let cols = columns.map( col => 
                  <div className={col.className}>{cycle[col.dataIndex]}</div> 
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
