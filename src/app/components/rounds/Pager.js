/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Actions } from 'react-redux-grid'

export const Pager = ({ api, current, gridData, pagingDataSource, store  }) => {
    
    const total = gridData ?
        gridData.total
        : 0;

    const currIndex = current
        && current.get !== undefined
        ? current.get('pageIndex')
        : 0;

    const buttons = [];

    const onClick = (e) => {
        const index = e.target.innerHTML
        store.dispatch(
            Actions.PagerActions
                .setPageIndexAsync({
                    pageIndex: parseInt(index) - 1,
                    pageSize: 10,
                    dataSource: api,
                    stateKey: 'cycles'
                })
        );
    };

    for (let i = 0; i < total / 10; i++) {
        buttons.push(
            <button
                children={i+1}
                onClick={onClick}
                key={"cycles"+i}
                className={
                    i === currIndex
                        ? 'react-redux-grid-active'
                        : 'react-redux-grid-inactive'
                }
            />
        );
    }

    return (
        <div style={{textAlign: 'right'}}>
            { buttons }
        </div>
    );
};

const { string, object } = PropTypes;

Pager.propTypes = {
    pagingDataSource: string,
    store: object.isRequired
};

Pager.defaultProps = {};

export default connect((state, props) => ({
    gridData: state.dataSource.get('cycles'),
    current: state.pager.get('cycles'),
}))(Pager)
