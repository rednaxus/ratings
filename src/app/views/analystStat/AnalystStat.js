// @flow weak

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  AnimatedView,
  Panel,
  Stat as StatComponent
}                         from '../../components';

class AnalystStat extends PureComponent {
  componentWillMount() {
    const { actions: { enterAnalystStat } } = this.props;
    enterAnalystStat();
  }

  componentWillUnmount() {
    const { actions: { leaveAnalystStat } } = this.props;
    leaveAnalystStat();
  }

  render() {

    return(
      <AnimatedView>
        <div className="row">
          <div className="col-xs-12">
            <Panel
              title="Summary"
              hasTitle={true}
              bodyBackGndColor={'#F4F5F6'}>

              <div className="row">
                <div className="col-md-2">
                  <StatComponent
                    statFaIconName="fa-file-o"
                    statIconColor="#fa8564"
                    statLabel="999 Projects"
                  />
                </div>
                <div className="col-md-2">
                  <StatComponent
                    statFaIconName="fa-paperclip"
                    statIconColor="#45cf95"
                    statLabel="999 Documents"
                  />
                </div>
                <div className="col-md-2">
                  <StatComponent
                    statFaIconName="fa-envelope-o"
                    statIconColor="#AC75F0"
                    statLabel="999 Messages"
                  />
                </div>
                <div className="col-md-2">
                  <StatComponent
                    statFaIconName="fa-check-square-o"
                    statIconColor="#45cf95"
                    statLabel="1000 Tasks"
                  />
                </div>
                <div className="col-md-2">
                  <StatComponent
                    statFaIconName="fa-dollar"
                    statIconColor="#AC75F0"
                    statLabel="$99999 Earnings"
                  />
                </div>
                <div className="col-md-2">
                  <StatComponent
                    statFaIconName="fa-refresh"
                    statIconColor="#fa8564"
                    statIconSpin={true}
                    statLabel="Processing...."
                  />
                </div>
              </div>

            </Panel>
          </div>
        </div>
      </AnimatedView>
    );
  }
}

AnalystStat.propTypes= {
  actions: PropTypes.shape({
    enterAnalystStat: PropTypes.func.isRequired,
    leaveAnalystStat: PropTypes.func.isRequired
  })
};

export default AnalystStat;
