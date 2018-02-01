// @flow weak

import React      from 'react'
import PropTypes  from 'prop-types'

const CycleListCommands = ({
  children
}) => (
  <div className=" add-task-row">
    {children}
  </div>
)

CycleListCommands.propTypes = {
  children: PropTypes.node.isRequired
}

export default CycleListCommands
