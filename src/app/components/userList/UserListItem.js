// @flow weak
/* eslint no-console:0 */

import React, {
  PureComponent,
}                               from 'react';
import PropTypes                from 'prop-types';
//import UserListItemButtonEdit   from '../userListItemButtonEdit/UserListItemButtonEdit';
//import UserListItemButtonValid  from '../userListItemButtonValid/UserListItemButtonValid';
//import UserListItemButtonCancel from '../userListItemButtonCancel/UserListItemButtonCancel';


class UserListItem extends PureComponent {
  static propTypes = {
    id:               PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name:             PropTypes.string,
    status:           PropTypes.number,
    reputation:       PropTypes.number,
    is_lead:          PropTypes.bool,
    token_balance:    PropTypes.number, 
    scheduled_round:  PropTypes.number,
    active_round:     PropTypes.number,
    num_rounds:       PropTypes.number
  };

  static defaultProps = {
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
    const { 
      id, 
      name, 
      status, 
      reputation, 
      is_lead, 
      token_balance, 
      scheduled_round, 
      active_round, 
      num_rounds 
    } = this.props;
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
            {name}
          </span>
          <span className="task-title-sp">
            {status}
          </span>
          <span className="task-title-sp">
            {reputation}
          </span>
          <span className="task-title-sp">
            {is_lead?'lead':'jurist'}
          </span>
          <span className="task-title-sp">
            {token_balance}
          </span>
          <span className="task-title-sp">
            {scheduled_round}
          </span>
          <span className="task-title-sp">
            {active_round}
          </span>
          <span className="task-title-sp">
            {num_rounds}
          </span>
        </div>
      </li>
    )
  }

  setCheckedProp = (checkedValue) => {
    if (checkedValue !== this.state.isChecked) {
      this.setState({ isChecked: checkedValue });
    }
  }

  /*
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
  */
}

export default UserListItem
