// @flow weak

import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'
import * as actions           from '../../redux/modules/actions'
import AnalystsView               from './AnalystsView'

const mapStateToProps = state => {
  return {
    currentView:        state.views.currentView,
    routing:            state.routing, 
    grid:               state.grid,
    bulkSelection:      state.bulkSelection,
    selection:          state.selection,
    app:                state.app,
    analysts:           state.analysts
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions : bindActionCreators(
      {
        enterAnalystsView: actions.enterAnalystsView,
        leaveAnalystsView: actions.leaveAnalystsView
      },
      dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( AnalystsView )
