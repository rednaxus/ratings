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

const base_message = {
  url: '',
  primary: () => {},
  secondary: () => {},
  time: 0,
  type: 'success'
}
const message_types = {
  new_round_scheduling: { 
    ...base_message,
    url: '/analyst/availability',
    primary: () => { 
      return <div>Upcoming rounds available<span>set your availability</span></div>
    },
    secondary: () => {

    },
    time: 0,
    type: 'danger'
  },
  round_active: {
    ...base_message,
    url: '/round/${round_id}'
  }

}


const data = [
    {text: '3 upcoming rounds available, set your availability', type: 'roundsUpcoming'},
    {text: 'Currently active on round 3, token XXOH, first survey due by ....', type: 'type2' },
    {text: 'Round scheduled, awaiting confirmation', type: 'round_confirmation' },
    {text: 'You have a brief due by xxx for round 4, upload your brief', type: 'brief_upload'}
]

export const AnalystMessages = ({ store }) => {
  const messages = () => { // generate the messages
    return data
  }

  return messages().map( message =>
    <div className = "row">
      <div className="card">
        <img className="card-img-top" src="https://cdn.history.com/sites/2/2014/02/redscare-H.jpeg"/>
        <div className="card-block">
          <figure className="profile">
            <img src="http://success-at-work.com/wp-content/uploads/2015/04/free-stock-photos.gif" className="profile-avatar" alt=""/>
          </figure>
          <h4 className="card-title mt-3">{message.text}</h4>
          <div className="meta">
            <a>Friends</a>
          </div>
          <div className="card-text">
            Blah blah with some blah blah.
          </div>
        </div>
        <div className="card-footer">
          <small>Last updated 3 mins ago</small>
          <button className="btn btn-secondary float-right btn-sm">show</button>
        </div>
      </div>
    </div>
  )


} 

AnalystMessages.propTypes = {
    store: PropTypes.object.isRequired
}

AnalystMessages.defaultProps = {}

export default AnalystMessages 
