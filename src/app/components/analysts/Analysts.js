/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'react-redux-grid'

import Pager from './Pager'
import api from '../../services/API/analysts'

import events from './events'
/*
    id:               PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name:             PropTypes.string,
    status:           PropTypes.number,
    reputation:       PropTypes.number,
    is_lead:          PropTypes.bool,
    token_balance:    PropTypes.number, 
    scheduled_round:  PropTypes.number,
    active_round:     PropTypes.number,
    num_rounds:       PropTypes.number
*/
const columns = [
    {
        name: 'ID',
        width: '10%',
        className: 'additional-class',
        dataIndex: 'id',
        HANDLE_CLICK: () => { console.log('Header Click'); }
    },
    {
        name: 'Name',
        width: '20%',
        dataIndex: 'name',
        className: 'additional-class'
    },
    {
        name: 'Status',
        width: '10%',
        dataIndex: 'status',
        className: 'additional-class',
        defaultSortDirection: 'descend'
    },
    {
        name: 'Reputation',
        dataIndex: 'reputation',
        width: '15%',
        className: 'additional-class'
    },
    {
        name: 'Lead',
        dataIndex: 'is_lead',
        width: '10%',
        className: 'additional-class'
    },
    {
        name: 'Tokens',
        dataIndex: 'token_balance',
        width: '15%',
        className: 'additional-class'
    },
    {
        name: 'Rounds',
        dataIndex: 'num_rounds',
        width: '10%',
        className: 'additional-class'
    },
    {
        name: 'Scheduled',
        dataIndex: 'scheduled_round',
        width: '10%',
        className: 'additional-class'
    },
    {
        name: 'Active',
        dataIndex: 'active_round',
        width: '10%',
        className: 'additional-class'
    }

];

export const Analysts = ({ store }) => {

    const analysts = {
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
        stateKey: 'analysts'
    };

    return <Grid { ...analysts } />;
};

const { object } = PropTypes

Analysts.propTypes = {
    store: object.isRequired
}

Analysts.defaultProps = {}

export default Analysts