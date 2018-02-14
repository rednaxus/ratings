// @flow weak

import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'
import * as actions           from '../../redux/modules/actions'
import GridView               from './GridView'

const mapStateToProps = state => {
  return {
    currentView:        state.views.currentView,
    routing:            state.routing, 
    grid:               state.grid,
    bulkSelection:      state.bulkSelection,
    selection:          state.selection,
    app:                state.app
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions : bindActionCreators(
      {
        enterGridView: actions.enterGridView,
        leaveGridView: actions.leaveGridView,
        switchFeature: actions.switchFeature
      },
      dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( GridView )
