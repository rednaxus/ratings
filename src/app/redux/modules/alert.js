export const alertConstants = {
    SUCCESS: 'ALERT_SUCCESS',
    ERROR: 'ALERT_ERROR',
    CLEAR: 'ALERT_CLEAR'
};



function success(message) {
    return { type: alertConstants.SUCCESS, message };
}

function error(message) {
    return { type: alertConstants.ERROR, message };
}

function clear() {
    return { type: alertConstants.CLEAR };
}

export const alertActions = {
    success,
    error,
    clear
};

// reducer
export default function alert(state = {}, action) {
  switch (action.type) {
    case alertConstants.SUCCESS:
      return {
        type: 'alert-success',
        message: action.message
      }
    case alertConstants.ERROR:
      return {
        type: 'alert-danger',
        message: action.message
      }
    case alertConstants.CLEAR:
      return {};
    default:
      return state
  }
}



