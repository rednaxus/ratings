// @flow weak

/* eslint no-console:0 */
import React, { Component } from 'react'
import PropTypes      from 'prop-types'
import Moment                    from 'react-moment'
import { Panel } from 'react-bootstrap'

import { AnimatedView } from '../../components'

import { store } from '../../Root'

import Cycles from '../../components/cycles/Cycles'
import Rounds from '../../components/rounds/Rounds'

class CyclesView extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      enterCyclesView: PropTypes.func,
      leaveCyclesView: PropTypes.func
    })
  }

  constructor(props){
    super(props)
  }

  componentWillReceiveProps(nextProps, nextState){
    this.props = nextProps
  }

  shouldComponentUpdate(){
    return true
  }

  componentDidMount() {
    const { actions: { fetchCronInfo } } = this.props
    fetchCronInfo()
  }

  componentWillMount() {
    const { actions: { enterCyclesView } } = this.props
    enterCyclesView()
  }

  componentWillUnmount() {
    const { actions: { leaveCyclesView } } = this.props
    leaveCyclesView()
  }

  render() {
    const { cycles, cronInfo } = this.props
    let crondate = new Date(cronInfo * 1000)

    console.log('rendering cycles and rounds',this.props)
    return (
      <AnimatedView>
        <div className="simpleContainer">
          <Panel>
            <Panel.Heading>
              <Panel.Title>Cycles -- Last cron run: 
                <span className="text-red"><Moment date={crondate} /></span>
                <button className="pull-right" onClick={this.handlePulseCron} >
                  pulse cron
                </button>
              </Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <Cycles { ...{ store } } />
            </Panel.Body>
          </Panel>
          <Panel>
            <Panel.Heading>
              <Panel.Title>Rounds</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <Rounds { ...{ store } } />
            </Panel.Body>
          </Panel>
        </div>
      </AnimatedView>
    )
  }

  handlePulseCron = ( event: SyntheticEvent<> ) => {
    if (event) event.preventDefault()

    console.log('pulse cron, props',this.props)
    const { actions: { pulseCron } } = this.props
    pulseCron()
  }
}

export default CyclesView