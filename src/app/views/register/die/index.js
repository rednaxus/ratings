// @flow weak

import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'
import * as viewsActions      from '../../redux/modules/views'
import * as userAuthActions   from '../../redux/modules/userAuth'
import Register                  from './Register'


const mapStateToProps = (state) => {
  return {
    // views:
    currentView:  state.views.currentView,

    // useAuth:
    isAuthenticated: state.userAuth.isAuthenticated,
    isFetching:      state.userAuth.isFetching,
    isRegistering:       state.userAuth.isRegistering,
    userAuth: state.userAuth 

  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      ...viewsActions,
      ...userAuthActions
    },
    dispatch
  )
}

export default connect( mapStateToProps, mapDispatchToProps )(Register)
