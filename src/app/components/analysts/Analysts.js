/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'react-redux-grid'

import config from '../../config/appConfig'
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
const cls_default = ''
const columns = [
    {
        name: 'ID',
        width: '5%',
        className: cls_default,
        dataIndex: 'id',
        HANDLE_CLICK: () => { console.log('Header Click'); }
    },
    {
        name: 'Name',
        width: '10%',
        dataIndex: 'name',
        className: cls_default
    },
    {
        name: 'Status',
        width: '5%',
        dataIndex: 'status',
        className: cls_default,
        defaultSortDirection: 'descend'
    },
    {
        name: 'Reputation',
        dataIndex: 'reputation',
        width: '10%',
        className: cls_default
    },
    {
        name: 'Role',
        dataIndex: 'is_lead',
        width: '10%',
        className: cls_default,
        renderer: ( { value } ) => config.role_name[ value ? 0 : 1 ]
    },
    {
        name: 'Tokens',
        dataIndex: 'token_balance',
        width: '10%',
        className: cls_default
    },
    {
        name: 'Active',
        dataIndex: 'num_rounds_active',
        width: '10%',
        className: cls_default
    },
    {
        name: 'Finished',
        dataIndex: 'num_rounds_finished',
        width: '10%',
        className: cls_default
    },
    {
        name: 'Refrls',
        dataIndex: 'num_referrals',
        width: '10%'   
    },
    {
        name: 'RefrlsLeft',
        dataIndex: 'referral_balance',
        width: '10%'
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