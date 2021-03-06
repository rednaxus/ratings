// @flow weak

import React, {
  PureComponent
}                         from 'react';
import PropTypes          from 'prop-types';
import {
  AnimatedView,
  Panel,
  ProgressBar as ProgressBarComponent
}                         from '../../../components';


class BasicProgressBar extends PureComponent {
  static propTypes= {
    actions: PropTypes.shape({
      enterBasicProgressBar: PropTypes.func.isRequired,
      leaveBasicProgressBar: PropTypes.func.isRequired
    })
  };

  componentWillMount() {
    const { actions: { enterBasicProgressBar } } = this.props;
    enterBasicProgressBar();
  }

  componentWillUnmount() {
    const { actions: { leaveBasicProgressBar } } = this.props;
    leaveBasicProgressBar();
  }

  render() {
    return(
      <AnimatedView>
        {/* preview: */}
        <div className="row">
          <div className="col-xs-12">
            <Panel
              title="Basic Progress Bars"
              hasTitle={true}>
              <p>
                <code>
                  .progress
                </code>
              </p>
              <ProgressBarComponent
                barSize="progress"
                barStriped={false}
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
                barStriped={false}
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
                barStriped={false}
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
                barStriped={false}
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

export default BasicProgressBar;
