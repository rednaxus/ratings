// @flow weak

import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import * as viewsActions        from '../../redux/modules/views'
//import * as userInfosActions    from '../../redux/modules/userInfos'
import Dashboard                      from './Dashboard'
import { userActions } from '../../redux/modules/actions'

const mapStateToProps = (state) => {
  return {
    // views:
    currentView:         state.views.currentView,
    // userInfos:
    userInfos:           state.userInfos.data,
    userIsConnected:     state.userInfos.isConnected,
    user:                state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        // views:
        ...viewsActions,
        // userInfos
        //...userInfosActions,
        ...userActions
      },
      dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)

