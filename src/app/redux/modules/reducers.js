// @flow weak

import { routerReducer }    from 'react-router-redux'
import { combineReducers }  from 'redux'
import earningGraph         from './earningGraph'
import sideMenu             from './sideMenu'
import userInfos            from './userInfos'
import teamMates            from './teamMates'
import views                from './views'
import userAuth             from './userAuth'
import web3                 from './web3'

export const reducers = {
  earningGraph,
  sideMenu,
  userInfos,
  teamMates,
  views,
  userAuth,
  web3
}

export default combineReducers({
  ...reducers,
  routing: routerReducer
})
