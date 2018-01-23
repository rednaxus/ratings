// @flow weak

import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'
import * as actions           from '../../redux/modules/actions'
import TokenList           from './TokenList'
import { fetchTokens } from '../../redux/modules/tokens'

const mapStateToProps = (state) => {
  console.log('state during mapstate',state)
  return {
    currentView:  state.views.currentView,
    tokens: state.tokens.tokens
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterTokenList: actions.enterTokenList,
        leaveTokenList: actions.leaveTokenList
      },
      dispatch),

    onTokenListClick: event => {
      event.preventDefault()

      dispatch(fetchTokens())
    }
  }
}

export default connect( mapStateToProps, mapDispatchToProps )(TokenList)

