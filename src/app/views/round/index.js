import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import * as actions           from '../../redux/modules/actions';
import Round             from './Round';

const mapStateToProps = (state) => {
  return {
    currentView:  state.views.currentView,
    round: state.rounds.round,
    tokens: state.tokens
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterRound: actions.enterRound,
        leaveRound: actions.leaveRound,
        fetchRoundInfo: actions.fetchRoundInfo
      },
      dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( Round )

