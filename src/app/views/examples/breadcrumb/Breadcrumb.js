// @flow weak

import React, {
  PureComponent
}                         from 'react';
import PropTypes          from 'prop-types';
import {
  AnimatedView,
  Panel,
  Breadcrumb as BreadcrumbComponent
}                         from '../../../components';


class Breadcrumb extends PureComponent {
  static propTypes= {
    actions: PropTypes.shape({
      enterBreadcrumb: PropTypes.func.isRequired,
      leaveBreadcrumb: PropTypes.func.isRequired
    })
  };

  state = { path: ['home', 'breadcrumb'] };

  componentWillMount() {
    const { actions: { enterBreadcrumb } } = this.props;
    enterBreadcrumb();
  }

  componentWillUnmount() {
    const { actions: { leaveBreadcrumb } } = this.props;
    leaveBreadcrumb();
  }

  render() {
    const { path } = this.state;

    return(
      <AnimatedView>
        {/* preview: */}
        <div className="row">
          <div className="col-xs-12">
            <Panel
              title="Breadcrumb"
              hasTitle={true}
              bodyBackGndColor={'#F4F5F6'}>
              <div className="row">
                <div className="col-xs-12">
                  <BreadcrumbComponent
                    path={path}
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

export default Breadcrumb;
