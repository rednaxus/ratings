// @flow weak

import customConfig from './customConfig'

export const appConfig = {

  // dev mode to mock async data for instance
  DEV_MODE: true,
  DEV_MODE_ALT: false,  // make it possible to mock some data, not others

  // When you need some kind "console spam" to debug
  DEBUG_ENABLED: true,
  // fake delay to mock async
  FAKE_ASYNC_DELAY: 1000,


  APP_NAME: 'VevaONE',

  // connection status text references
  CONNECTION_STATUS: {
    online: 'online',
    disconnected: 'disconnected'
  },
  // eaningGraph config
  earningGraph: {
    data: {
      API: 'api/earnigGraphData'
    }
  },
  teamMates:{
    data: {
      API: 'api/teamMates'
    }
  },
  tokens:{
    data: {
      API: 'api/tokens'
    }
  },
  // userInfos config
  userInfos: {
    data: {
      API: 'api/userInfos'
    }
  },


  HELLO_WORD: '',

  CRON_INTERVAL: 2*24*60*60,


  STATUSES: [ 
    'none',
    'pending',
    'scheduled',
    'active',
    'finished',
    'cancelled',
    'available',
    'confirmed',
    'assigned',
    'brief due',
    'brief submitted',
    'first survey due',
    'first survey submitted',
    'second survey due',
    'second survey submitted',
    'round tallied',
    'disqualified'
  ],

  CYCLE_STATUSES: [ // note: these should be migrated to the Statuses above
    'unsubscribed','lead-requested','lead-assigned','jurist-requested','jurist-assigned'
  ],
  
  CYCLES_AHEAD: 4,

  CYCLE_PERIOD: 86400 * 28,
  ACTIVE_TIME: 86400 * 28,

  SCHEDULE_TIME: 86400 * 4,

  ZERO_BASE_TIME: 1514764800,
  
  cycleTime: function ( cycle, ms = false ) {
    return ( ms ? 1000 : 1 ) * ( this.CYCLE_PERIOD * cycle / 4 + this.ZERO_BASE_TIME )
  },

  REPUTATION_LEAD: 12,

  JURY_SIZE: 6,

  JURISTS_MIN: 2,

  DEFAULT_ROUND_VALUE: 100,

  REWARD_REFERRAL: 1,
    
  REWARD_ROUND_TOKENS_WINNER: 2,
  REWARD_ROUND_TOKENS_LOSER: 3,
  REWARD_ROUND_TOKENS_JURY_TOP: 4,
  REWARD_ROUND_TOKENS_JURY_MIDDLE: 5,
  REWARD_ROUND_TOKENS_JURY_BOTTOM: 6,
    
  REWARD_PROMOTION_TO_LEAD: 7,
  reward_is_tokens: function (reward_type) { 
    return _.includes([
      this.REWARD_ROUND_TOKENS_WINNER,
      this.REWARD_ROUND_TOKENS_LOSER,      
      this.REWARD_ROUND_TOKENS_JURY_TOP,
      this.REWARD_ROUND_TOKENS_JURY_MIDDLE,
      this.REWARD_ROUND_TOKENS_BOTTOM
    ],reward_type)
  },

  REFERRAL_POINTS: 8,
  WINNER_PCT: 40,
  LOSER_PCT: 10,
  TOP_JURISTS_X10: 34,   // percentages * 10   ... level:0
  MIDDLE_JURISTS_X10: 17,   // level:1
  BOTTOM_JURISTS_X10: 0,    // level:2

  customConfig

}


