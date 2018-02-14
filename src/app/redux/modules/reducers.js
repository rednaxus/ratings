// @flow weak

import { routerReducer }    from 'react-router-redux'
import { combineReducers }  from 'redux'

import { reducer as formReducer } from 'redux-form'

import { Reducers as gridReducers } from 'react-redux-grid'

import app                  from './app'

import earningGraph         from './earningGraph'
import sideMenu             from './sideMenu'
import userInfos            from './userInfos'
import teamMates            from './teamMates'
import views                from './views'
import userAuth             from './userAuth'
import users                from './users'
import cycles               from './cycles'
import web3                 from './web3'
import tokens               from './tokens'
import survey               from './survey'

export const reducers = {
  earningGraph,
  sideMenu,
  userInfos,
  teamMates,
  tokens,
  views,
  userAuth,
  users,
  cycles,
  survey,
  web3
}

export default combineReducers({
  ...reducers,
  ...gridReducers,
  app: app,
  form: formReducer,
  routing: routerReducer
})
