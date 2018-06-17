// @flow weak
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import * as actions           from '../../redux/modules/actions'
import Dashboard                      from './Dashboard'



const mapStateToProps = (state) => {
  return {
    currentView:          state.views.currentView,
    cycles:               state.cycles.data,
    user:                 state.user.info,
    tokens:               state.tokens.data,
    rounds:               state.rounds.data,
    timestamp:            state.cron.timestamp
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterDashboard: actions.enterDashboard,
        leaveDashboard: actions.leaveDashboard,
        fetchCyclesDataIfNeeded: actions.fetchCyclesDataIfNeeded,
        fetchCronInfo: actions.fetchCronInfo,
        refreshUserInfo: actions.userActions.refreshInfo
      },
      dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )(Dashboard)

