// @flow weak

import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'
import * as actions           from '../../redux/modules/actions'
import Availability           from './Availability'

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
        enterAvailability: actions.enterAvailability,
        leaveAvailability: actions.leaveAvailability,
        fetchCyclesDataIfNeeded: actions.fetchCyclesDataIfNeeded,
        fetchCronInfo: actions.fetchCronInfo,
        cycleSignup: actions.cycleSignup
      },
      dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( Availability )

