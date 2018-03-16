/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { Grid } from 'react-redux-grid'

import Pager from './Pager'
import api from '../../services/API/rounds'

import Moment from 'react-moment'
import { appConfig } from '../../config'

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
/* roundInfo
              id:rRound[0].toNumber(), 
              cycle: rRound[1].toNumber()  
              covered_token: rRound[2].toNumber(),
              value: rRound[3].toNumber(),
              status: rRound[4].toNumber(),
              num_analysts: rRound[5].toNumber()
*/
const columns = [
  {
    name: 'Round',
    width: '10%',
    className: 'additional-class',
    dataIndex: 'id',
    defaultSortDirection: 'ascend',
    renderer: ({column,value,row}) => {
      return <Link to={"/round/"+value} >{value}</Link>
    },
    HANDLE_CLICK: () => { console.log('Header Click'); }
  },
  {
    name: 'Cycle',
    width: '25%',
    dataIndex: 'cycle',
    className: 'additional-class',
    renderer: ({column,value,row}) => {
      return <span><Moment format="YYYY-MM-DD HH:mm" date={new Date(appConfig.cycleTime(value)*1000)} /></span>
    }
  },
  {
    name: 'Token',
    width: '15%',
    dataIndex: 'covered_token',
    className: 'additional-class'
  },
  {
    name: 'Value',
    dataIndex: 'value',
    width: '15%',
    className: 'additional-class'
  },
  {
    name: 'State',
    dataIndex: 'status',
    width: '20%',
    className: 'additional-class',
    renderer: ( { column, value, row } ) => {
      return <span>{appConfig.STATUSES[value]}</span>
    }
  
  },
  {
    name: 'Analysts',
    dataIndex: 'num_analysts',
    width: '15%',
    className: 'additional-class'
  }
]

export const Rounds = ({ store }) => {

  const rounds = {
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
    stateKey: 'rounds'
  }

  return <Grid { ...rounds } />
}

const { object } = PropTypes

Rounds.propTypes = {
  store: object.isRequired
}

Rounds.defaultProps = {}

export default Rounds