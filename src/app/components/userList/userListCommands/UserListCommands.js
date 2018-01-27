// @flow weak

import React      from 'react'
import PropTypes  from 'prop-types'

const UserListCommands = ({
  children
}) => (
  <div className=" add-task-row">
    {children}
  </div>
)

UserListCommands.propTypes = {
  children: PropTypes.node.isRequired
}

export default UserListCommands
