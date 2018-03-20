// @flow weak

import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'


import * as actions           from '../../redux/modules/actions'
import Token           from './Token'
//import { fetchTokens } from '../../redux/modules/tokens'
import { AnimatedView } from '../../components'

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
        enterTokenView: actions.enterTokenView,
        leaveTokenView: actions.leaveTokenView,
        fetchTokenData: actions.fetchTokenData
      },
      dispatch),

    onTokenClick: event => {
      event.preventDefault()

      //dispatch(fetchTokens())
    }
  }
}

export default connect( mapStateToProps, mapDispatchToProps )(Token)

