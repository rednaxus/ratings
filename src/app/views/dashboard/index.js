// @flow weak
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import * as actions           from '../../redux/modules/actions'
import Dashboard                      from './Dashboard'



const mapStateToProps = (state) => {
  return {
    currentView:          state.views.currentView,
    cycles:               state.cycles,
    user:                 state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterDashboard: actions.enterDashboard,
        leaveDashboard: actions.leaveDashboard,
        fetchCyclesDataIfNeeded: actions.fetchCyclesDataIfNeeded,
        fetchCronInfo: actions.fetchCronInfo
      },
      dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )(Dashboard)

