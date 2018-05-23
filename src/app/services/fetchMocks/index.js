// @flow weak

import config    from '../../config/appConfig';
import {
  earningGraphMockData,
  userInfosMockData,
  teamMatesMock,
  tokensMock,
  usersMock
}                       from '../../models';

export const fetchMockEarningGraphData = (
  timeToWait: number = config.FAKE_ASYNC_DELAY
): Promise<any> => {
  return new Promise(
    resolve => {
      setTimeout(
        () => resolve({
          labels: earningGraphMockData.labels,
          datasets: earningGraphMockData.datasets
        }),
        timeToWait
      );
    }
  );
};

export const fetchMockUserInfosData = async (
  timeToWait: number = config.FAKE_ASYNC_DELAY
): Promise<any> => {
  return new Promise(
    resolve => {
      setTimeout(
        () => resolve({ token: userInfosMockData.token, data: {...userInfosMockData}}), // { token: userInfosMockData.token, data: {...userInfosMockData}}
        timeToWait
      );
    }
  );
};

export const fetchMockTeamMatesData = (
  timeToWait: number = config.FAKE_ASYNC_DELAY
): Promise<any> => {
  return new Promise(
    resolve => {
      setTimeout(
        () => resolve([...teamMatesMock]),
        timeToWait
      );
    }
  );
};

export const fetchMockTokensData = (
  timeToWait: number = config.FAKE_ASYNC_DELAY
): Promise<any> => {
  return new Promise(
    resolve => {
      setTimeout(
        () => resolve([...tokensMock]),
        timeToWait
      );
    }
  );
};

export const fetchMockUsersData = (
  timeToWait: number = config.FAKE_ASYNC_DELAY
): Promise<any> => {
  return new Promise(
    resolve => {
      setTimeout(
        () => resolve([...usersMock]),
        timeToWait
      );
    }
  );
};