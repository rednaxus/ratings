// @flow weak

import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'
import * as actions           from '../../redux/modules/actions'
import Availability           from './Availability'

const mapStateToProps = (state) => {
  return {
    currentView:  state.views.currentView,
    cycles: state.cycles
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterAvailability: actions.enterAvailability,
        leaveAvailability: actions.leaveAvailability,
        fetchCyclesDataIfNeeded: actions.fetchCyclesDataIfNeeded,
        fetchCronInfo: actions.fetchCronInfo
      },
      dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( Availability )

