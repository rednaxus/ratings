// @flow weak

import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'
import * as actions           from '../../redux/modules/actions'
import CyclesView             from './CyclesView'


const mapStateToProps = state => ({
  currentView:        state.views.currentView,
  routing:            state.routing, 
  grid:               state.grid,
  bulkSelection:      state.bulkSelection,
  selection:          state.selection,
  app:                state.app,
  cycles:             state.cycles.data,
  timestamp:          state.cron.timestamp
})

const mapDispatchToProps = dispatch => ({
  actions : bindActionCreators({
    enterCyclesView:    actions.enterCyclesView,
    leaveCyclesView:    actions.leaveCyclesView,
    fetchCronInfo:      actions.fetchCronInfo,
    pulseCron:          actions.pulseCron
  }, dispatch )
})

export default connect( mapStateToProps, mapDispatchToProps )( CyclesView )
