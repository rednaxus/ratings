/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'react-redux-grid'

import Pager from './Pager'
import Api from './..//data/Api'

import {
    columns,
    data,
    events,
    dataSource
} from './..//data/demodata'

export const CustomPager = ({ store }) => {

    const customPager = {
        columns,
        dataSource: Api,
        plugins: {
            PAGER: {
                enabled: true,
                pagingType: 'remote',
                pagerComponent: (
                    <Pager
                        api={Api}
                        store={store}
                    />
                )
            }
        },
        events,
        store,
        stateKey: 'custom-pager'
    };

    return <Grid { ...customPager } />;
};

const { object } = PropTypes;

CustomPager.propTypes = {
    store: object.isRequired
};

CustomPager.defaultProps = {};

export default CustomPager