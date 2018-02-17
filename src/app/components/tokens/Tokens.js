/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'react-redux-grid'

import Pager from './Pager'
import api from '../../services/API/tokens'

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
        width: '40%',
        dataIndex: 'name',
        className: 'additional-class'
    },
    {
        name: 'Address',
        width: '50%',
        dataIndex: 'addr',
        className: 'additional-class',
        defaultSortDirection: 'descend'
    }
];

export const Tokens = ({ store }) => {

    const tokens = {
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
        stateKey: 'tokens'
    };

    return <Grid { ...tokens } />;
};

const { object } = PropTypes

Tokens.propTypes = {
    store: object.isRequired
}

Tokens.defaultProps = {}

export default Tokens