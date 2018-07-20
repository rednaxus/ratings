import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import * as actions           from '../../redux/modules/actions'
import { rounds, tokens }     from '../../redux/modules/selectors'
import Round             from './Round';

const mapStateToProps = state => ({
  currentView:  state.views.currentView,
  rounds: rounds(state),
  timestamp: state.cron.timestamp,
  tokens: tokens(state),
  user: state.user.info
})

const mapDispatchToProps = dispatch => ({ 
  actions : bindActionCreators({
      enterRound: actions.enterRound,
      leaveRound: actions.leaveRound,
      fetchRoundInfo: actions.fetchRoundInfo,
      fetchRoundAnalystInfo: actions.fetchRoundAnalystInfo,
      setRoundInfo: actions.setRoundInfo,
      submitSurvey: actions.submitSurvey
    }, dispatch )
})


export default connect( mapStateToProps, mapDispatchToProps )( Round )

