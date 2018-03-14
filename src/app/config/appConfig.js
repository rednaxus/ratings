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

  ANALYST_REGISTRY: '0x594274b7619fd1b9ce9b83b771bcf6ec4a4efa95',
  RATING_AGENCY: '0x3ae851d5780725853de7118c73d0bd2a303c7fff',

  CRON_INTERVAL: 2*24*60*60
};
