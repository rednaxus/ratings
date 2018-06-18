// @flow weak

import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'
import * as actions           from '../../redux/modules/actions'
import { cycles, rounds, tokens }      from '../../redux/modules/selectors'
import Scheduling             from './Scheduling'

const mapStateToProps = state => ({
  currentView:          state.views.currentView,
  cycles:               cycles( state ),
  user:                 state.user.info,
  tokens:               tokens( state ),
  rounds:               rounds( state ),
  timestamp:            state.cron.timestamp
})

const mapDispatchToProps = dispatch => ({ 
  actions : bindActionCreators({
    enterScheduling:          actions.enterScheduling,
    leaveScheduling:          actions.leaveScheduling,
    fetchCyclesDataIfNeeded:  actions.fetchCyclesDataIfNeeded,
    fetchCronInfo:            actions.fetchCronInfo,
    cycleSignup:              actions.cycleSignup,
    cycleConfirm:             actions.cycleConfirm
  }, dispatch )
})

export default connect( mapStateToProps, mapDispatchToProps )( Scheduling )

