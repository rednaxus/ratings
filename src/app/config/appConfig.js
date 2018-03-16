// @flow weak

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

  ETHEREUM_PROVIDER: 'http://localhost:8545',

  ANALYST_REGISTRY: '0xa66e306716edde1f3dc1d0b688e4809ea4f98606',
  RATING_AGENCY: '0x20f5f3ec573b626b74c4ef0e22a3fd6e228d8f71',

  CRON_INTERVAL: 2*24*60*60,


  STATUSES: [ 
    'none','pending','scheduled','active','finished','cancelled','available','confirmed','assigned'
  ],
  
  CYCLES_AHEAD: 4,

  CYCLE_PERIOD: 86400 * 28,
  ACTIVE_TIME: 86400 * 28,

  SCHEDULE_TIME: 86400 * 4,

  ZERO_BASE_TIME: 1514764800,
  
  cycleTime: function ( cycle ) {
    return this.CYCLE_PERIOD * cycle / 4 + this.ZERO_BASE_TIME 
  },

  JURY_SIZE: 6,

  JURISTS_MIN: 2,

  DEFAULT_ROUND_VALUE: 100
}


