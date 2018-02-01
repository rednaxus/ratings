// @flow weak

import React      from 'react'
import PropTypes  from 'prop-types'

const CycleListItemButtonEdit = ({
  onClick
}) => (
  <button
    className="btn btn-default btn-xs"
    onClick={onClick}>
    <i className="fa fa-pencil"></i>
  </button>
)

CycleListItemButtonEdit.propTypes = {
  onClick: PropTypes.func
}

export default CycleListItemButtonEdit
