// @flow weak

import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import * as viewsActions        from '../../redux/modules/views'
import Status                      from './Status'
import { userActions } from '../../redux/modules/actions'

const mapStateToProps = (state) => {
  return {
    currentView:         state.views.currentView,
    user:                state.user.info,
    rounds:              state.rounds.data,
    tokens:              state.tokens.data,
    cronInfo:            state.cycles.cronInfo 
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        ...viewsActions,
        ...userActions
      },
      dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( Status )

