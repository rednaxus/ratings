// @flow weak

import React, {  PureComponent } from 'react';
import PropTypes          from 'prop-types';
import {
  AnimatedView,
  Panel,
  CycleList,
  CycleListItem
  //CycleListCommands,
  //CycleListAddCycle,
  //CycleListSeeAllCycle
}                         from '../../components';

import { fetchCyclesDataIfNeeded } from '../../redux/modules/cycles'
import { store } from '../../Root'

class CycleListView extends PureComponent {
  enterAnimationTimer = null;


  componentWillMount() {
    const { actions: { enterCycleListView } } = this.props;
    enterCycleListView();
  }

  componentDidMount() {
    console.log('cycles component mounted')
    //const { actions: { fetchCyclesDataIfNeeded } } = this.props;
    store.dispatch(fetchCyclesDataIfNeeded())
    //fetchCyclesDataIfNeeded()
  }

  componentWillUnmount() {
    const { actions: { leaveCycleListView } } = this.props;
    leaveCycleListView();
    clearTimeout(this.enterAnimationTimer);
  }

  render() {
    const { cycles } = this.props

    return(
      <AnimatedView>
        <div className="row">
          <div className="col-xs-12">
            <Panel
              hasTitle={true}
              title={'Cycle list'}
              sectionCustomClass="tasks-widget">
              <CycleList>
                {
                  cycles.data.map(
                    ({id, timestart, period, status, num_jurists_available, num_jurists_assigned, num_leads_available, num_leads_assigned }, cycleIdx) => {
                      return (
                        <CycleListItem
                          key={cycleIdx}
                          id={id} 
                          timestart={timestart}
                          period={period} 
                          status={status}
                          num_jurists_available={num_jurists_available}
                          num_jurists_assigned={num_jurists_assigned}
                          num_leads_available={num_leads_available}
                          num_leads_assigned={num_leads_assigned}
                        />
                      );
                    }
                  )
                }
              </CycleList>
           </Panel>
          </div>
        </div>
      </AnimatedView>
    );
  }
}

CycleListView.propTypes= {
  actions: PropTypes.shape({
    enterCycleListView: PropTypes.func.isRequired,
    leaveCycleListView: PropTypes.func.isRequired
  })
}

export default CycleListView
