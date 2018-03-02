/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'react-redux-grid'

import Pager from './Pager'
import api from '../../services/API/cycles'

import Moment from 'react-moment'

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
    name: 'Start',
    width: '25%',
    dataIndex: 'timestart',
    className: 'additional-class',
    renderer: ({column,value,row}) => {
      return <span><Moment format="YYYY-MM-DD HH:mm" date={new Date(value*1000)} /></span>
    }
  },
  {
    name: 'Rounds Scheduled',
    width: '15%',
    dataIndex: 'num_rounds',
    className: 'additional-class',
    defaultSortDirection: 'descend'
  },
  {
    name: 'Jurists Avail',
    dataIndex: 'num_jurists_available',
    width: '15%',
    className: 'additional-class'
  },
  {
    name: 'Jurists Assigned',
    dataIndex: 'num_jurists_assigned',
    width: '15%',
    className: 'additional-class'
  },
  {
    name: 'Leads Avail',
    dataIndex: 'num_leads_available',
    width: '15%',
    className: 'additional-class'
  },
  {
    name: 'Leads Assigned',
    dataIndex: 'num_leads_assigned',
    width: '15%',
    className: 'additional-class'
  }

]

export const Cycles = ({ store }) => {

  const cycles = {
    columns,
    dataSource: api,
    plugins: {
      PAGER: {
        enabled: true,
        pagingType: 'remote',
        pagerComponent: (
          <Pager api={api} store={store} />
        )
      }
    },
    events,
    store,
    stateKey: 'cycles'
  }

  return <Grid { ...cycles } />
}

const { object } = PropTypes

Cycles.propTypes = {
  store: object.isRequired
}

Cycles.defaultProps = {}

export default Cycles