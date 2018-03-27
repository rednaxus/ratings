/*
    AnalystMessages takes the current state and generates a list display of messages based on the state
*/



// ignore everything below right now, just placeholders

/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import { Glyphicon }                     from 'react-bootstrap'

import { generateMessages, generateMockMessages } from '../../services/messages'


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
  glyph: 'star-empty',
  heading: (data) => <div>base heading</div>,
  body: (data) => <div>base body</div>,
  footer: (data) => 
    <div>
      <small>Last updated 3 mins ago</small>
      <button className="btn btn-secondary float-right btn-sm">show(url)</button>
    </div>
  ,
  time: 0
}
const message_templates = {
  new_round_scheduling: {
    ...base_message,
    url: '/analyst/availability',
    heading: (data) => { 
      return <div>Upcoming rounds available<span>set your availability</span></div>
    },
    body: (data) => {

    },
    footer: (data) => {}
  },
  round_activated: {
    ...base_message,
    url: '/round/${round.id}',
    heading: (data) => { 
      <div>Active Round</div> 
    },
    body: (data) => { 
      return data.analyst && data.analyst.isLead ? 
        <div>You are Lead for {round.token.name} round that began at <Moment/>
          <div>Brief is due for this round by <Moment/></div>
        </div> : 
        <div>You are jurist for {data.round} round that began at <Moment/>
          <div>Survey is due for this round by <Moment/></div>
        </div> 
    },
    footer: (data) => { 
      return data.analyst && data.analyst.isLead ? 
        <div>Brief is due by <Moment/></div>
        : <div>Survey is due by <Moment/></div>
    }    
  },
  payment: {
    ...base_message
  },
  reputation_score: {
    ...base_message 
  },
  new_level: {
    ...base_message 
  },
  addition_referrals: {
    ...base_message 
  },
  round_finished: {
    ...base_message 
  },
  round_scheduled: {
    ...base_message 
  },
  tokens_added: {
    ...base_message 
  },
  rounds_in_progress:{
    ...base_message 
  },
  sponsored_analyst_joins: {
    ...base_message 
  },
  new_ratings: {
    ...base_message 
  },
  make_referral: {
    ...base_message 
  },
  jurist_round_starting: {
    ...base_message 
  },
  brief_posted: {
    ...base_message 
  },
  pre_survey_due: {
    ...base_message 
  },
  post_survey_due:{
    ...base_message 
  },
  /* Round Confirmation */
  lead_confirmation: {
    ...base_message 
  },
  round_starting: {
    ...base_message 
  },
  briefs_due: {
    ...base_message 
  },
  rebuttal_due: {
    ...base_message 
  },
  round_confirmed: {
    ...base_message 
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

  let generatedMessages = generateMockMessages()
  console.log('generated messages',generatedMessages)
  return generatedMessages.map( message =>
    <div className = "row">
      <div className="card">
        <img className="card-img-top" src="https://cdn.history.com/sites/2/2014/02/redscare-H.jpeg"/>
        <div className="card-block">
          <figure className="profile">
            <img src="http://success-at-work.com/wp-content/uploads/2015/04/free-stock-photos.gif" className="profile-avatar" alt=""/>
          </figure>
          <h4 className="card-title mt-3">{message_templates[message.type].heading(message)}</h4>
          <div className="meta">
            <a>Friends--{message.type}</a>
          </div>
          <div className="card-text">
            {message_templates[message.type].body(message)}
          </div>
        </div>
        <div className="card-footer">
          {message_templates[message.type].footer(message)}
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
