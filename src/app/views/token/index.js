// @flow weak
import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'

import * as actions           from '../../redux/modules/actions'
import Token                  from './Token'


const mapStateToProps = state => ({
  currentView:  state.views.currentView,
  tokens:       state.tokens.data
})


const mapDispatchToProps = dispatch => ({
  actions : bindActionCreators({
    enterTokenView: actions.enterTokenView,
    leaveTokenView: actions.leaveTokenView,
    fetchTokenData: actions.fetchTokenData
  }, dispatch ),
  onTokenClick: event => {
    event.preventDefault()
    //dispatch(fetchTokens())
  }
})

export default connect( mapStateToProps, mapDispatchToProps )(Token)

