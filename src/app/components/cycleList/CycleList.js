// @flow weak
import React        from 'react'
import PropTypes    from 'prop-types'

const CycleList = ({
  children
}) => (
  <div className="task-content">
    <ul className="task-list">
      {children}
    </ul>
  </div>
)

CycleList.propTypes = {
  children: PropTypes.node.isRequired
}

export default CycleList
