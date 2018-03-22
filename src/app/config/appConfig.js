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
    'none','pending','scheduled','active','finished','cancelled','available','confirmed','assigned'
  ],
  
  CYCLES_AHEAD: 4,

  CYCLE_PERIOD: 86400 * 28,
  ACTIVE_TIME: 86400 * 28,

  SCHEDULE_TIME: 86400 * 4,

  ZERO_BASE_TIME: 1514764800,
  
  cycleTime: function ( cycle, ms = false ) {
    return ( ms ? 1000 : 1 ) * ( this.CYCLE_PERIOD * cycle / 4 + this.ZERO_BASE_TIME )
  },


  JURY_SIZE: 6,

  JURISTS_MIN: 2,

  DEFAULT_ROUND_VALUE: 100,

  customConfig

}


