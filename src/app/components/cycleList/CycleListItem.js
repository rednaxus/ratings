// @flow weak
/* eslint no-console:0 */

import React, {
  PureComponent,
}                               from 'react';
import PropTypes                from 'prop-types';
//import CycleListItemButtonEdit   from '../userListItemButtonEdit/CycleListItemButtonEdit';
//import CycleListItemButtonValid  from '../userListItemButtonValid/CycleListItemButtonValid';
//import CycleListItemButtonCancel from '../userListItemButtonCancel/CycleListItemButtonCancel';


class CycleListItem extends PureComponent {
  static propTypes = {
    id:                     PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    timestart:              PropTypes.number,
    period:                 PropTypes.number,
    status:                 PropTypes.number,
    num_jurists_available:  PropTypes.number,
    num_jurists_assigned:   PropTypes.number, 
    num_leads_available:    PropTypes.number,
    num_leads_assigned:     PropTypes.number,
    num_rounds:             PropTypes.number
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
      timestart, 
      period, 
      status, 
      num_jurists_available, 
      num_jurists_assigned, 
      num_leads_available, 
      num_leads_assigned 
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
            {id}
          </span>
          <span className="task-title-sp">
            {timestart}
          </span>
          <span className="task-title-sp">
            {period}
          </span>
          <span className="task-title-sp">
            {status}
          </span>
          <span className="task-title-sp">
            {num_jurists_available}
          </span>
          <span className="task-title-sp">
            {num_jurists_assigned}
          </span>
          <span className="task-title-sp">
            {num_leads_available}
          </span>
          <span className="task-title-sp">
            {num_leads_assigned}
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

export default CycleListItem
