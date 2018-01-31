// @flow weak
/* eslint no-console:0 */

import React, { PureComponent } from 'react'
import PropTypes                from 'prop-types'
import { Link }                 from 'react-router-dom'

class TokenListItem extends PureComponent {
  static propTypes = {
    id:               PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name:             PropTypes.string,
    addr:             PropTypes.string
  }

  static defaultProps = {
    id:            '',
    name: 'MOOLAH',
    addr: '0x0000000000000000'
  }

  state = {
    isChecked: false,
    isEditing: false
  }

  render() {
    const { id, name, addr } = this.props
    const { isChecked, isEditing } = this.state

    return (
      <li>
        <div className="task-checkbox">
          <input
            type="checkbox"
            checked={isChecked}
            className="flat-grey list-child"
          />
        </div>
        <div className="task-title">

          <span className="task-title-sp">
            {id}
          </span>

          <span className="task-title-sp">
            <Link to={"token/"+id}>{name}</Link>
          </span>

          <div className="task-title-sp pull-right">
            <a href={"https://etherscan.io/token/"+addr}>
              <span className="badge bg.red">link</span>
            </a>
          </div>
        </div>
      </li>
    )
  }

  setCheckedProp = (checkedValue) => {
    if (checkedValue !== this.state.isChecked) {
      this.setState({ isChecked: checkedValue });
    }
  }

}

export default TokenListItem
