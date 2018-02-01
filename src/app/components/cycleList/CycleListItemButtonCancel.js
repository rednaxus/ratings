// @flow weak

import React        from 'react';
import PropTypes    from 'prop-types';

const CycleListItemButtonCancel = ({
  onClick
}) => (
  <button
    className="btn btn-default btn-xs"
    onClick={onClick}>
    <i className="fa fa-times"></i>
  </button>
);

CycleListItemButtonCancel.propTypes = {
  onClick: PropTypes.func
};

export default CycleListItemButtonCancel;
