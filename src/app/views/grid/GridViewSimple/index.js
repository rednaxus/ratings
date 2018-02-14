// @flow weak

import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'
import * as actions           from '../../../redux/modules/actions'
import GridViewSimple         from './GridViewSimple'

const mapStateToProps = (state) => {
  return {
    currentView:  state.views.currentView,
    grid: state.grid
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterGridViewSimple: actions.enterGridViewSimple,
        leaveGridViewSimple: actions.leaveGridViewSimple
      },
      dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( GridViewSimple )
