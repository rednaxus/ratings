// @flow weak
/* eslint no-console:0 */

import React, {
  PureComponent,
}                               from 'react';
import PropTypes                from 'prop-types';
import UserListItemButtonEdit   from '../userListItemButtonEdit/UserListItemButtonEdit';
import UserListItemButtonValid  from '../userListItemButtonValid/UserListItemButtonValid';
import UserListItemButtonCancel from '../userListItemButtonCancel/UserListItemButtonCancel';


class UserListItem extends PureComponent {
  static propTypes = {
    id:               PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label:            PropTypes.string,
    done:             PropTypes.bool,
    statusLabel:      PropTypes.string,
    statusLabelStyle: PropTypes.oneOf(['label-success', 'label-danger', 'label-warning', 'label-primary', 'label-inverse']),
    onListValidEdit:  PropTypes.func
  };

  static defaultProps = {
    label:            '',
    statusLabelStyle: 'label-success',
    done:             false
  };

  state = {
    isChecked: false,
    isEditing: false
  };

  componentDidMount() {
    const { done } = this.props;
    this.setCheckedProp(done);
  }

  componentWillReceiveProps(nextProps) {
    const { done } = this.props;
    if (nextProps.done !== done) {
      this.setCheckedProp(nextProps.done);
    }
  }

  render() {
    const { label, statusLabel, statusLabelStyle } = this.props;
    const { isChecked, isEditing } = this.state;

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
            {label}
          </span>

          <span className={`label ${statusLabelStyle}`}>
            {statusLabel}
          </span>

          <div className="pull-right hidden-phone">
            {
              isEditing
              ? <div>
                  <UserListItemButtonValid onClick={this.handlesOnListValidEdit} />
                  <UserListItemButtonCancel onClick={this.handlesOnListCancelEdit} />
                </div>
              : <UserListItemButtonEdit onClick={this.handlesOnListEdit} />
            }
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

  handlesOnListEdit = () => {
    this.setState({ isEditing: true});
  }

  handlesOnListCancelEdit = () => {
    this.setState({ isEditing: false});
  }

  handlesOnListValidEdit = () => {
    const { onListValidEdit } = this.props;
    const { isChecked } = this.state;

    // onListValidEdit(isChecked); enable this to use
    this.setState({ isEditing: false});
  }
}

export default UserListItem
