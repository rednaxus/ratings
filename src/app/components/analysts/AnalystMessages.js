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
  fontSize: "80px",
  marginTop: "0px",
  marginBottom: "-20px"
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
  maxHeight: "40%",
  display:"flex",
  flexDirection: "row",
  justifyContent: "space-between"

};

var infoRow = {
  width: "60%",
  display:"flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center"
};

var buttonFlex = {
  color: "blue",
  display: "flex",
  justifyContent: "flex-end"
};

var preKey = ("2018-03-27T14:06-0500");
var dateKey = ("2018-03-28T19:06-0500");
/*"2019-05-19T12:59-0500"*/



const base_message = {
  url: '',
  /*glyph: 'star-empty',*/
  heading: (data) => <div>base heading</div>,
  body: (data) => <div>base body</div>,
  footer: (data) =>
    <div>
      <small>Last updated 3 mins ago</small>
      <button className="btn btn-secondary float-right btn-sm">show(url)</button>
    </div>,
    glyph: (data) => <div><Glyphicon glyph="star-empty"></Glyphicon></div>,

  time: 0
}
const message_templates = {

  new_round_scheduling: {
    ...base_message,
    url: '/analyst/availability',
    heading: (data) => {
      return <div>Upcoming rounds available</div>
    },
    body: (data) => {
        return <div>We have scheduled {data.signupCycles} new rounds! Please make sure your availability is updated in your profile.</div>
    },
    footer: (data) => {
      return <div>Go To Profile</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="calendar"></Glyphicon></div>
    }
  },

  round_activated: {
    ...base_message,
    url: '/round/${round.id}',
    heading: (data) => {
      return <div>Active Round</div>
    },
    body: (data) => {
      return data.analyst && data.analyst.isLead ?
        <div>You are Lead for {round.token.name} round that began <Moment fromNow>{data.start}</Moment>.
          <div>Brief is due for this round <Moment fromNow>{data.due}</Moment></div>
        </div> :
        <div>You are jurist for round #{data.round} that began <Moment fromNow>{data.start}</Moment>.
          <div>Survey is due for this round <Moment fromNow>{data.due}</Moment></div>
        </div>
    },
    footer: (data) => {
      return data.analyst && data.analyst.isLead ?
        <div>Brief is due <Moment fromNow>{data.due}</Moment>.</div>
        : <div>Survey is due <Moment fromNow>{data.due}</Moment>.</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="ok-circle"></Glyphicon></div>
    }
  },

  payment: {
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>New Payment Available!</div>
    },
    body: (data) => {

      return <div>Nice work! You have earned a new payment of {data.tokens} VEVA!</div>

    },
    footer: (data) => {
      return <div>click here to see account</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="usd"></Glyphicon></div>
    }
  },

  reputation_score: {
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>New Rep Points!</div>
    },
    body: (data) => {

      return <div>Well done! You have earned {data.new_points} reputation points! You now have {data.reputation} points.</div>

    },
    footer: (data) => {
      return <div>see in profile</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="thumbs-up"></Glyphicon></div>
    }
  },

  new_level: {
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>New Level!</div>
    },
    body: (data) => {

      return <div>All right! You have earned sufficient reputation points to move from a {data.previous_level} to a {data.new_level}!</div>

    },
    footer: (data) => {
      return <div>see in profile</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="knight"></Glyphicon></div>
    }
  },

  addition_referrals: {
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>New Referrals!</div>
    },
    body: (data) => {

      return <div>You have earned enough rep points to get {data.new_raf} additional referrals, giving you a total of {data.referrals}.</div>

    },
    footer: (data) => {
      return <div>view referrals</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="plus-sign"></Glyphicon></div>
    }
  },

  round_finished: {
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>Round Finished</div>
    },
    body: (data) => {

      return <div>Analysis round #{data.round} (began <Moment fromNow>{data.start}</Moment>) has finished. Thank you for partcipating!</div>

    },
    footer: (data) => {
      return <div>view round</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="education"></Glyphicon></div>
    }
  },

  round_scheduled: {
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>Round Scheduled</div>
    },
    body: (data) => {

      return <div>A new round has been scheduled to begin <Moment fromNow>{data.due}</Moment>. Can you participate?</div>

    },
    footer: (data) => {
      return <div>Sign up!</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="time"></Glyphicon></div>
    }
  },

  tokens_added: {
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>New Tokens Added!</div>
    },
    body: (data) => {

      return <div>We have added new tokens (data.tokens.name} to our system! Check out the tokens page for more information or to browse.</div>

    },
    footer: (data) => {
      return <div>Go Now</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="plus"></Glyphicon></div>
    }
  },

  rounds_in_progress:{
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>Round In Progress</div>
    },
    body: (data) => {

      return  <div> Analysis round #{data.round} (began <Moment fromNow>{data.start}</Moment>) is in progress.  You are a {data.analyst}. </div>
    },
    footer: (data) => {
      return <div>view round info</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="star-empty"></Glyphicon></div>
    }
  },

  sponsored_analyst_joins: {
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>New Sponsored Analyst!</div>
    },
    body: (data) => {

      return <div>Hurray! One of your referrals (Analyst #{data.analyst}) has joined. Thank you for participating in the Veva ecosystem! You have earned an additional {data.reputation_points} rep points.</div>

    },
    footer: (data) => {
      return <div>view referrals</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="heart"></Glyphicon></div>
    }
  },

  new_ratings: {
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>New Ratings!</div>
    },
    body: (data) => {

      return <div>New token rating data has been added for rounds {data.rounds}! Check out the tokens page for more information or to browse.</div>

    },
    footer: (data) => {
      return <div>Go Now</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="th-list"></Glyphicon></div>
    }
  },

  make_referral: {
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>Reminder: You have unused referrals!</div>
    },
    body: (data) => {

      return <div>You have {data.unused_refs} unused referrals. Your referrals help keep the Veva system healthy and secure—and you get a cut of their winnings! </div>

    },
    footer: (data) => {
      return <div>view referrals</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="user"></Glyphicon></div>
    }
  },

  jurist_round_starting: {
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>Round Starting!</div>
    },
    body: (data) => {

      return <div>You are a confirmed JURIST for round #{data.round}, which is starting now!</div>

    },
    footer: (data) => {
      return <div>view info</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="bullhorn"></Glyphicon></div>
    }
  },

  brief_posted: {
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>New Brief Posted!</div>
    },
    body: (data) => {

      return <div>A lead analyst in round #{data.round} has posted a new brief. You can access it until it closes <Moment fromNow>{data.due}</Moment>.</div>

    },
    footer: (data) => {
      return <div>View Now</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="edit"></Glyphicon></div>
    }
  },

  pre_survey_due: {
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>Pre-Survey Due</div>
    },
    body: (data) => {

      return <div>Reminder: Please take the pre-survey for round #{data.round}--it is due <Moment fromNow>{data.due}</Moment>.</div>

    },
    footer: (data) => {
      return <div>Take it Now</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="list-alt"></Glyphicon></div>
    }
  },

  post_survey_due:{
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>Post-Survey Due!</div>
    },
    body: (data) => {

      return <div>Reminder: Please take the pre-survey for round #{data.round}--it is due <Moment fromNow>{data.due}</Moment>.</div>

    },
    footer: (data) => {
      return <div>Take it Now</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="list-alt"></Glyphicon></div>
    }
  },

  /* Round Confirmation */
  lead_confirmation: {
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>You are confirmed as a lead!</div>
    },
    body: (data) => {

      return <div>You are a confirmed LEAD for round #{data.round}, which is starting now!</div>

    },
    footer: (data) => {
      return <div>view info</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="check"></Glyphicon></div>
    }
  },

  round_starting: {
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>Round Starting!</div>
    },
    body: (data) => {

      return <div>You are confirmed for round #{data.round}, which is starting now!</div>

    },
    footer: (data) => {
      return <div>view info</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="bell"></Glyphicon></div>
    }
  },

  briefs_due: {
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>Reminder: Brief Due!</div>
    },
    body: (data) => {

      return <div>Your LEAD brief for round #{data.round} is due <Moment fromNow>{data.due}</Moment>. Please remember to upload!</div>

    },
    footer: (data) => {
      return <div>Upload Now</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="paperclip"></Glyphicon></div>
    }
  },

  rebuttal_due: {
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>Rebuttal Due!</div>
    },
    body: (data) => {

      return <div>Your LEAD rebuttal for round #{data.round} is due <Moment fromNow>{data.due}</Moment>. Please remember to upload!</div>

    },
    footer: (data) => {
      return <div>View Opposing Brief</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="paperclip"></Glyphicon></div>
    }
  },

  round_confirmed: {
    ...base_message,
    url: '',
    heading: (data) => {
      return <div>Round confirmed!</div>
    },
    body: (data) => {

      return <div>Round #{data.round} has been confirmed and will be starting <Moment fromNow>{data.start}</Moment>!</div>

    },
    footer: (data) => {
      return <div>View Info</div>
    },
    glyph: (data) => {
      return <div><Glyphicon glyph="ok-sign"></Glyphicon></div>
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

  let generatedMessages = generateMockMessages()
  console.log('generated messages',generatedMessages)
  return generatedMessages.map( message =>
    <div className = "row">
      <div className="panel panel-danger card" style={cardStyle}>
        <div className="panel-heading">
          <h4 className="card-title mt-3">{message_templates[message.type].heading(message)}</h4>
          <a>Friends--{message.type}</a>
        </div>

        <div className="panel-body" style={cardFlex}>

          <div className="card-text" style={glyphStyle}>
            {message_templates[message.type].glyph(message)}
          </div>
          <div className="card-text" style={infoRow}>
            {message_templates[message.type].body(message)}
          </div>

        </div>

          <div className="meta">

            <div className="card-footer" style={buttonFlex}>
              {message_templates[message.type].footer(message)}
            </div>
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
