// @flow weak

import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'
import * as actions           from '../../redux/modules/actions'
import GridView               from './GridView'

const mapStateToProps = (state) => {
  return {
    currentView:  state.views.currentView,
    grid: state.grid,
    app: state.app
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterGridView: actions.enterGridView,
        leaveGridView: actions.leaveGridView
      },
      dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( GridView )
