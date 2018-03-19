/* 
    AnalystMessages takes the current state and generates a list display of messages based on the state
*/



// ignore everything below right now, just placeholders

/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'react-redux-grid'
import { Notification } from '../../components'
import events from './events'

const message_types = {
  roundsUpcoming: { 
    url: '/analyst/availability',
    template: '<div>{upcoming} upcoming rounds available<span>set your availability</span></div>',
    type: 'danger'
  },
  roundTokens: {
    
  }

}

const columns = [
  {
    title: 'Events',
    width: '100%',
    className: '',
    dataIndex: 'text',
    renderer: ({column,value,row}) => {
      return <Notification type={'danger'}>
        <span>
          {value}
        </span>
      </Notification>
    }
  }
]

const data = [
    {text: '3 upcoming rounds available, set your availability', type: 'roundsUpcoming'},
    {text: 'Currently active on round 3, token XXOH, first survey due by ....', type: 'type2' },
    {text: 'Round scheduled, awaiting confirmation', type: 'round_confirmation' },
    {text: 'You have a brief due by xxx for round 4, upload your brief', type: 'brief_upload'}
]

export const AnalystMessages = ({ store }) => {

    const messages = {
        columns,
        data: data,
        plugins: {},
        events,
        store,
        stateKey: 'analyst_messages'
    }

    return <Grid { ...messages } />
};

const { object } = PropTypes

AnalystMessages.propTypes = {
    store: object.isRequired
}

AnalystMessages.defaultProps = {}

export default AnalystMessages 
