/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'react-redux-grid'

import Pager from './Pager'
import api from '../../services/API/cycles'

import events from './events'
/*
    id:                     PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    timestart:              PropTypes.number,
    period:                 PropTypes.number,
    status:                 PropTypes.number,
    num_jurists_available:  PropTypes.number,
    num_jurists_assigned:   PropTypes.number, 
    num_leads_available:    PropTypes.number,
    num_leads_assigned:     PropTypes.number,
    num_rounds:             PropTypes.number
*/

const columns = [
    {
        name: 'Cycle',
        width: '10%',
        className: 'additional-class',
        dataIndex: 'id',
        HANDLE_CLICK: () => { console.log('Header Click'); }
    },
    {
        name: 'Time Start',
        width: '20%',
        dataIndex: 'timestart',
        className: 'additional-class'
    },
    {
        name: 'Rounds Scheduled',
        width: '25%',
        dataIndex: 'num_rounds',
        className: 'additional-class',
        defaultSortDirection: 'descend'
    },
    {
        name: 'Jurists Avail',
        dataIndex: 'num_jurists_available',
        width: '35%',
        className: 'additional-class'
    },
    {
        name: 'Jurists Assigned',
        dataIndex: 'num_jurists_assigned',
        width: '35%',
        className: 'additional-class'
    },
    {
        name: 'Leads Avail',
        dataIndex: 'num_leads_available',
        width: '35%',
        className: 'additional-class'
    },
    {
        name: 'Leads Assigned',
        dataIndex: 'num_leads_assigned',
        width: '35%',
        className: 'additional-class'
    }

];

export const Cycles = ({ store }) => {

    const cycles = {
        columns,
        dataSource: api,
        plugins: {
            PAGER: {
                enabled: true,
                pagingType: 'remote',
                pagerComponent: (
                    <Pager
                        api={api}
                        store={store}
                    />
                )
            }
        },
        events,
        store,
        stateKey: 'cycles'
    };

    return <Grid { ...cycles } />;
};

const { object } = PropTypes;

Cycles.propTypes = {
    store: object.isRequired
};

Cycles.defaultProps = {};

export default Cycles