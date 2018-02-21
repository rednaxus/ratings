import { LOCATION_CHANGE } from 'react-router-redux'
import * as features from "../../models/gridFeatures"

export const APP_READY = 'APP_READY'
export const APP_STATUS_CHANGE = 'APP_STATUS_CHANGE'
export const FEATURE_SWITCH = 'FEATURE_SWITCH'
// DATA
export const REQUEST_DATA_FAKE = 'REQUEST_DATA_FAKE'
export const RECEIVE_DATA_FAKE_SUCCESS = 'RECEIVE_DATA_FAKE_SUCCESS'
export const RECEIVE_DATA_FAKE_FAIL = 'RECEIVE_DATA_FAKE_FAIL'
// GRID
export const GRID_STATUS_CHANGE = 'GRID_STATUS_CHANGE'
export const GRID_SORT = 'GRID_SORT'
export const GRID_FILTERS_CHANGE = 'GRID_FILTERS_CHANGE'
export const GRID_FILTERS_CLEAR = 'GRID_FILTERS_CLEAR'
export const GRID_REQUEST_SAVE = 'GRID_REQUEST_SAVE'
export const GRID_RECEIVE_SAVE_SUCCESS = 'GRID_RECEIVE_SAVE_SUCCESS'
export const GRID_RECEIVE_SAVE_FAIL = 'GRID_RECEIVE_SAVE_FAIL'
export const GRID_ROWS_UPDATE = 'GRID_ROWS_UPDATE'
// PAGING 
export const PAGING_CHANGE_LIMIT = 'PAGING_CHANGE_LIMIT'
// BULK SELECTION
export const BULK_DISPLAY = 'BULK_DISPLAY'

const getFeatures = (featureTitle) => {
  let key = featureTitle.toLowerCase() + "Features"
  return features[key]
}

const initialState = {
  ready: false,
  name: "Ratings Agency",
  features: getFeatures('Simple'),
  featureTitle: "Simple",
  featureTitles: features.featureTitles
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOCATION_CHANGE:
      console.log("App heard the route change action: ", action);
      let featureTitle = action.payload.pathname.split("/")[1];
      if (featureTitle === "") featureTitle = "Simple";
      return {
        ...state,
        featureTitle,
        features: getFeatures(featureTitle),
        ready: true
      };
    case APP_READY:
      return {
        ...state,
        ready: true
      };
    case FEATURE_SWITCH:
      return {
        ...state,
        features: getFeatures(action.featureTitle),
        featureTitle: action.featureTitle
      };  
    default:
      return state;
  }
}


export const switchFeature = (featureTitle) => {
  return {
    type: FEATURE_SWITCH,
    featureTitle
  }
}

export const ready = () => {
  return {
    type: APP_READY
  }
}

export const bulkDisplay = newData => {
  return {
    type: BULK_DISPLAY,
    recordsRemaining: newData.removed,
    recordsRemoved: newData.remaining
  }
}

export const changePageLimit = newPageLimit => {
  return {
    type: PAGING_CHANGE_LIMIT,
    newPageLimit
  }
}