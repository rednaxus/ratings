// @flow weak

import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'
import * as actions           from '../../redux/modules/actions'
import TokenListView           from './TokenListView'

const mapStateToProps = (state) => {
  console.log('state during mapstate',state)
  return {
    currentView:  state.views.currentView,
    tokens: state.tokens
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterTokenListView: actions.enterTokenListView,
        leaveTokenListView: actions.leaveTokenListView       
      },
      dispatch),

  }
}

export default connect( mapStateToProps, mapDispatchToProps )(TokenListView)

