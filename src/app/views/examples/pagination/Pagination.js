// @flow weak

import React, {
  PureComponent
}                         from 'react';
import PropTypes          from 'prop-types';
import {
  AnimatedView,
  Panel,
  Pagination as PaginationComponent,
  Pager as PagerComponent
}                         from '../../../components';


class PaginationView extends PureComponent {
  static propTypes = {
    actions: PropTypes.shape({
      enterPagination: PropTypes.func.isRequired,
      leavePagination: PropTypes.func.isRequired
    })
  };

  componentWillMount() {
    const { actions: { enterPagination } } = this.props;
    enterPagination();
  }

  componentWillUnmount() {
    const { actions: { leavePagination } } = this.props;
    leavePagination();
  }

  render() {

    return(
      <AnimatedView>
        {/* preview: */}
        <div className="row">
          <div className="col-xs-12">
            <Panel
              title="Pagination"
              hasTitle={true}>
              <div className="text-center">
                <PaginationComponent
                  size="large"
                  numberOfPagination={5}
                />
              </div>
              <div className="text-center">
                <PaginationComponent
                  numberOfPagination={5}
                />
              </div>
              <div className="text-center">
                <PaginationComponent
                  size="small"
                  numberOfPagination={5}
                />
              </div>
              <div>
                <h3>
                  Default Example
                </h3>
                <PagerComponent
                  aligned={false}
                  previous={'Previous'}
                  next={'Next'}
                />
              </div>
              <div>
                <h3>
                  Aligned links
                </h3>
                <PagerComponent
                  aligned={true}
                  previous={
                    <div>
                      <span aria-hidden="true">
                        &larr;
                      </span>
                      Older
                    </div>
                  }
                  next={(
                    <div>
                      Newer
                      <span aria-hidden="true">
                        &rarr;
                      </span>
                    </div>
                  )}
                />
              </div>
            </Panel>
          </div>
        </div>

      </AnimatedView>
    );
  }
}

export default PaginationView;
