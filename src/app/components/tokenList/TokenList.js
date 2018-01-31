
// @flow weak
import React        from 'react'
import PropTypes    from 'prop-types'

const TokenList = ({
  children
}) => (
  <div className="task-content">
    <ul className="task-list">
      {children}
    </ul>
  </div>
)

TokenList.propTypes = {
  children: PropTypes.node.isRequired
}


export default TokenList

