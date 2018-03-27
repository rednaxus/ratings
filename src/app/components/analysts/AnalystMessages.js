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
import { Glyphicon }                     from 'react-bootstrap'



var glyphStyle = {
  fontSize: "100px"
};

var spanStyle = {
  display: "flex",
  alignItems: "center",
  paddingRight: "30px"
};

var cardStyle = {
  maxWidth: "50%"
};

var cardFlex = {
  display:"flex",
  flexDirection: "row",
  justifyContent: 'space-around'
};

var infoRow = {
  width: "100%",
  display:"flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center"
};

var buttonFlex = {
  color: "blue",
  maxWidth: "50%",
display: "flex",
flexDirection: "row",
justifyContent: "center",
alignItems: "flex-end"
};


const base_message = {
  url: '',
  heading: () => {},
  body: () => {},
  footer: () => {},
  time: 0,
  type: 'success'
}
const message_types = {
  new_round_scheduling: {
    ...base_message,
    url: '/analyst/availability',
    heading: () => { 
      return <div>Upcoming rounds available<span>set your availability</span></div>
    },
    body: () => {

    },
    footer: () => {},
    time: 0,
    type: 'danger'
  },
  round_active: {
    ...base_message,
    url: '/round/${round.id}',
    heading: () => { 
      <div>Active Round</div> 
    },
    body: () => { 
      return analyst.isLead ? 
        <div>You are Lead for {round.token.name} round that began at <Moment/>
          <div>Brief is due for this round by <Moment/></div>
        </div> : 
        <div>You are jurist for {round.token.name} round that began at <Moment/>
          <div>Survey is due for this round by <Moment/></div>
        </div> 
    },
    footer: () => { 
      return analyst.isLead ? 
        <div>Brief is due by <Moment/></div>
        : <div>Survey is due by <Moment/></div>
    }    
  }

}


const data = [
    {text: '4 new rounds available!', type: 'roundsUpcoming', glyph: <Glyphicon glyph="calendar"></Glyphicon>, body: "Please set your availability via your profile", due: "1h:12m"},
    {text: 'Currently active: Round 3!', type: 'type2', glyph: <Glyphicon glyph="star-empty"></Glyphicon>, body: "token XXOH, first survey due by ....", due: "1d:3h:49m"},
    {text: 'Round scheduled!', type: 'round_confirmation', glyph: <Glyphicon glyph="check"></Glyphicon>, body: "Status: awaiting confirmation", due: "0h:31m"},
    {text: 'Brief Due', type: 'brief_upload', glyph: <Glyphicon glyph="paperclip"></Glyphicon>, body: "You have a brief due by xxx for round 4, please upload", due: "4h:55m"}
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
