// @flow weak

import config  from '../../config/appConfig';
import {
  defaultOptions,
  checkStatus,
  parseJSON,
  getLocationOrigin
}                     from '../fetchTools';

export const getTeamMatesData = () => {
  const url = `${getLocationOrigin()}/${config.teamMates.data.API}`;
  const options = {...defaultOptions};

  fetch(url, options)
  .then(checkStatus)
  .then(parseJSON)
  .then(data => data)
  .catch(error => error);
};
