// @flow weak

import React, {
  PureComponent
}                         from 'react';
import PropTypes          from 'prop-types';
import {
  AnimatedView,
  Panel,
  Alert as AlertComponent
}                         from '../../../components';


class AlertView extends PureComponent {
  static propTypes= {
    actions: PropTypes.shape({
      enterAlert: PropTypes.func.isRequired,
      leaveAlert: PropTypes.func.isRequired
    })
  };

  componentWillMount() {
    const { actions: { enterAlert } } = this.props;
    enterAlert();
  }

  componentWillUnmount() {
    const { actions: { leaveAlert } } = this.props;
    leaveAlert();
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
              <AlertComponent
                type="danger">
                <strong>
                  Oh snap!
                </strong>
                Change a few things up and try submitting again.
              </AlertComponent>

              <AlertComponent
                type="success">
                <strong>
                  Well done!
                </strong>
                You successfully read this important alert message.
              </AlertComponent>

              <AlertComponent
                type="info">
                <strong>
                  Heads up!
                </strong>
                This alert needs your attention, but it's not super important.
              </AlertComponent>

              <AlertComponent
                type="warning">
                <strong>
                  Warning!
                </strong>
                Best check yo self, you're not looking too good.
              </AlertComponent>

            </Panel>
          </div>
        </div>
      </AnimatedView>
    );
  }
}

export default AlertView;
