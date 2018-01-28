// @flow weak

import React, {
  PureComponent
}                         from 'react';
import PropTypes          from 'prop-types';
import {
  AnimatedView,
  Panel,
  ProgressBar as ProgressBarComponent
}                         from '../../components';



class StripedProgressBar extends PureComponent {
  static propTypes= {
    actions: PropTypes.shape({
      enterStripedProgressBar: PropTypes.func.isRequired,
      leaveStripedProgressBar: PropTypes.func.isRequired
    })
  };
  
  componentWillMount() {
    const { actions: { enterStripedProgressBar } } = this.props;
    enterStripedProgressBar();
  }

  componentWillUnmount() {
    const { actions: { leaveStripedProgressBar } } = this.props;
    leaveStripedProgressBar();
  }

  render() {
    return(
      <AnimatedView>
        {/* preview: */}
        <div className="row">
          <div className="col-xs-12">
            <Panel
              title="Striped Progress Bars"
              hasTitle={true}>
              <p>
                <code>
                  .progress
                </code>
              </p>
              <ProgressBarComponent
                barSize="progress"
                barStriped={true}
                barStyle="primary"
                active={false}
                valueNow={40}
                valueMin={0}
                valueMax={100}
                screenReadersText={`${40}% Complete (success)`}
              />
              <p>
                Class:
                <code>
                  .sm
                </code>
              </p>
              <ProgressBarComponent
                barSize="sm"
                barStriped={true}
                barStyle="success"
                active={true}
                valueNow={20}
                valueMin={0}
                valueMax={100}
                screenReadersText={`${20}% Complete`}
              />
              <p>
                Class:
                <code>
                  .xs
                </code>
              </p>
              <ProgressBarComponent
                barSize="xs"
                barStriped={true}
                barStyle="warning"
                active={false}
                valueNow={60}
                valueMin={0}
                valueMax={100}
                screenReadersText={`${60}% Complete (warning)`}
              />
              <p>
                Class:
                <code>
                  .xxs
                </code>
              </p>
              <ProgressBarComponent
                barSize="xxs"
                barStriped={true}
                barStyle="danger"
                active={false}
                valueNow={60}
                valueMin={0}
                valueMax={100}
                screenReadersText={`${60}% Complete (warning)`}
              />
            </Panel>
          </div>
        </div>
      </AnimatedView>
    );
  }
}

export default StripedProgressBar;
