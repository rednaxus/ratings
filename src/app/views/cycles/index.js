// @flow weak

import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'
import * as actions           from '../../redux/modules/actions'
import CyclesView             from './CyclesView'
import { cycleActions }       from '../../redux/modules/cycles'

const mapStateToProps = state => {
  return {
    currentView:        state.views.currentView,
    routing:            state.routing, 
    grid:               state.grid,
    bulkSelection:      state.bulkSelection,
    selection:          state.selection,
    app:                state.app,
    cycles:             state.cycles
  }
}

const mapDispatchToProps = dispatch => {
  console.log('cycle actions pulse',cycleActions.pulseCron)
  return {
    actions : bindActionCreators(
      {
        enterCyclesView: actions.enterCyclesView,
        leaveCyclesView: actions.leaveCyclesView,
        pulseCron: cycleActions.pulseCron
      },
      dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( CyclesView )
