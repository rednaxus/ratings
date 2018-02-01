// @flow weak

import React      from 'react'
import PropTypes  from 'prop-types'

const UserListItemButtonEdit = ({
  onClick
}) => (
  <button
    className="btn btn-default btn-xs"
    onClick={onClick}>
    <i className="fa fa-pencil"></i>
  </button>
)

UserListItemButtonEdit.propTypes = {
  onClick: PropTypes.func
}

export default UserListItemButtonEdit
