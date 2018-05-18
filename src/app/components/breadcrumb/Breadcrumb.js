// @flow weak

/* eslint consistent-return: 0 */
import React      from 'react';
import PropTypes  from 'prop-types';
import { Link }   from 'react-router-dom'

const Breadcrumb = ({
  path
}) => (
  <ul className="breadcrumb">
  {
    path.length === 0 &&
    <div></div>
  }
  {
    path.length > 0 &&
    path.map(
      (view, viewIndex) => {
        if (viewIndex === 0) {
          return (
            <li key={viewIndex}>
              <Link to="">
                <i className="fa fa-home"></i>
                  &nbsp;
                  {view}
              </Link>
            </li>
          );
        }
        if (viewIndex < path.length - 1) {
          return (
            <li key={viewIndex} className="active">
              <Link to={ `/${ path[ viewIndex ] }` } >
                {view}
              </Link>
            </li>
          );
        }
        if (viewIndex === path.length - 1) {
          return (
            <li key={viewIndex} className="active">
              {view}
            </li>
          );
        }
      }
    )
  }
  </ul>
);

Breadcrumb.propTypes = {
  path: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
};

export default Breadcrumb;
