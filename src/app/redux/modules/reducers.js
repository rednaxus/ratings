// @flow weak
import { routerReducer }    from 'react-router-redux'
import { combineReducers }  from 'redux'

import { reducer as formReducer } from 'redux-form'

import { Reducers as gridReducers } from 'react-redux-grid'

import { createReducer } from 'redux-orm'

import app                  from './app'

import alert                from './alert'
import user                 from './user'

import sideMenu             from './sideMenu'

import earningGraph         from './earningGraph'
//import userInfos            from './userInfos'
import teamMates            from './teamMates'
import views                from './views'
import userAuth             from './userAuth' // to die
//import users                from './users' // to die
import cron                 from './cron'
import cycles               from './cycles'
import rounds               from './rounds'
import web3                 from './web3'
import tokens               from './tokens'
import survey               from './survey'

import orm                  from './models'


export const reducers = {
  alert,
  user,
  earningGraph,
  sideMenu,
  //userInfos,
  //teamMates,
  tokens,
  views,
  userAuth,
  //users,
  cron,
  cycles,
  rounds,
  survey,
  web3
}

export default combineReducers({
  ...reducers,
  ...gridReducers,
  app: app,
  form: formReducer,
  routing: routerReducer,
  db: createReducer( orm )
})
