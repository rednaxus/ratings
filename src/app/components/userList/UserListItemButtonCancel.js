// @flow weak

import React        from 'react';
import PropTypes    from 'prop-types';

const UserListItemButtonCancel = ({
  onClick
}) => (
  <button
    className="btn btn-default btn-xs"
    onClick={onClick}>
    <i className="fa fa-times"></i>
  </button>
);

UserListItemButtonCancel.propTypes = {
  onClick: PropTypes.func
};

export default UserListItemButtonCancel;
