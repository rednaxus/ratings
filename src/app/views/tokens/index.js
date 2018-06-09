// @flow weak

import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'
import * as actions           from '../../redux/modules/actions'
import TokensView               from './TokensView'

const mapStateToProps = state => {
  return {
    currentView:        state.views.currentView,
    routing:            state.routing, 
    grid:               state.grid,
    bulkSelection:      state.bulkSelection,
    selection:          state.selection,
    app:                state.app,
    tokens:             state.tokens.data,
    rounds:             state.rounds.data,
    userAuth:           state.user.authentication
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions : bindActionCreators({
      enterTokensView: actions.enterTokensView,
      leaveTokensView: actions.leaveTokensView,
      fetchRoundsFinished: actions.fetchRoundsFinished
    },
    dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( TokensView )
