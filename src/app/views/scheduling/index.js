// @flow weak

import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'
import * as actions           from '../../redux/modules/actions'
import Scheduling             from './Scheduling'

const mapStateToProps = (state) => {
  return {
    currentView:          state.views.currentView,
    cycles:               state.cycles.data,
    user:                 state.user.info,
    tokens:               state.tokens.data,
    rounds:               state.rounds.data,
    cronInfo:             state.cycles.cronInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterScheduling:          actions.enterScheduling,
        leaveScheduling:          actions.leaveScheduling,
        fetchCyclesDataIfNeeded:  actions.fetchCyclesDataIfNeeded,
        fetchCronInfo:            actions.fetchCronInfo,
        cycleSignup:              actions.cycleSignup,
        cycleConfirm:             actions.cycleConfirm
      },
      dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( Scheduling )

