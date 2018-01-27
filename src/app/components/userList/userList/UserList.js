// @flow weak
import React        from 'react'
import PropTypes    from 'prop-types'

const UserList = ({
  children
}) => (
  <div className="task-content">
    <ul className="task-list">
      {children}
    </ul>
  </div>
)

UserList.propTypes = {
  children: PropTypes.node.isRequired
}

export default UserList
