// @flow weak

import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import * as viewsActions        from '../../redux/modules/views'
import Status                      from './Status'
import { userActions } from '../../redux/modules/actions'

const mapStateToProps = state => ({
  currentView:         state.views.currentView,
  user:                state.user.info,
  rounds:              state.rounds.data,
  tokens:              state.tokens.data,
  timestamp:           state.cron.timestamp 
})

const mapDispatchToProps = dispatch => ({
  actions : bindActionCreators({
    ...viewsActions,
    ...userActions
  }, dispatch )
})

export default connect( mapStateToProps, mapDispatchToProps )( Status )

