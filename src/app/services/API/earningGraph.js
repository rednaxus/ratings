// @flow weak

import config  from '../../config/appConfig';
import {
  defaultOptions,
  checkStatus,
  parseJSON,
  getLocationOrigin
}                     from '../fetchTools';

export const getEarningGraphData = () => {
  const url = `${getLocationOrigin()}/${config.earningGraph.data.API}`;
  const options = {...defaultOptions};

  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => data)
    .catch(error => error);
};
