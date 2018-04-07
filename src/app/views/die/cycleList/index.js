// @flow weak

import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import * as actions           from '../../redux/modules/actions';
import CycleListView           from './CycleListView';

const mapStateToProps = (state) => {
  return {
    currentView:  state.views.currentView,
    cycles: state.cycles
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        enterCycleListView: actions.enterCycleListView,
        leaveCycleListView: actions.leaveCycleListView
      },
      dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CycleListView);
