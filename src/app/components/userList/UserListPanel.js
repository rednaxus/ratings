// @flow weak

import React      from 'react'
import PropTypes  from 'prop-types'

const UserListPanel = ({ title, children }) => (
  <section className="panel">
    <header className="panel-heading">
      {title}
    </header>
    <div className="panel-body table-responsive">
      {children}
    </div>
  </section>
)

UserListPanel.propTypes = {
  title:    PropTypes.string,
  children: PropTypes.node.isRequired
}

UserListPanel.defaultProps = {
  title: 'Analysts'
}

export default UserListPanel
