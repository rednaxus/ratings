import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import * as actions           from '../../redux/modules/actions';
import Round             from './Round';

const mapStateToProps = (state) => {
  return {
    currentView:  state.views.currentView,
    rounds: state.rounds.data,
    tokens: state.tokens.data,
    user: state.user.info
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterRound: actions.enterRound,
        leaveRound: actions.leaveRound,
        fetchRoundInfo: actions.fetchRoundInfo,
        fetchRoundAnalystInfo: actions.fetchRoundAnalystInfo,
        setRoundInfo: actions.setRoundInfo
      },
      dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( Round )

