// @flow weak

import React, {  PureComponent } from 'react';
import PropTypes          from 'prop-types';
import {
  AnimatedView,
  Panel,
  UserList,
  UserListItem
  //UserListCommands,
  //UserListAddUser,
  //UserListSeeAllUser
}                         from '../../components';

import { fetchUsersDataIfNeeded } from '../../redux/modules/users'
import { store } from '../../Root'

class UserListView extends PureComponent {
  enterAnimationTimer = null;


  componentWillMount() {
    const { actions: { enterUserListView } } = this.props;
    enterUserListView();
  }

  componentDidMount() {
    console.log('users component mount')
    store.dispatch(fetchUsersDataIfNeeded())
  }

  componentWillUnmount() {
    const { actions: { leaveUserListView } } = this.props;
    leaveUserListView();
    clearTimeout(this.enterAnimationTimer);
  }

  render() {
    const { users } = this.props

    return(
      <AnimatedView>
        <div className="row">
          <div className="col-xs-12">
            <Panel
              hasTitle={true}
              title={'User list'}
              sectionCustomClass="tasks-widget">
              <UserList>
                {
                  users.data.map(
                    ({id, name, status, reputation, is_lead, token_balance, scheduled_round, active_round, num_rounds }, userIdx) => {
                      return (
                        <UserListItem
                          key={userIdx}
                          id={id} 
                          name={name}
                          status={status} 
                          reputation={reputation}
                          is_lead={is_lead}
                          token_balance={token_balance}
                          scheduled_round={scheduled_round}
                          active_round={active_round}
                          num_rounds={num_rounds}
                        />
                      );
                    }
                  )
                }
              </UserList>
           </Panel>
          </div>
        </div>
      </AnimatedView>
    );
  }
}

UserListView.propTypes= {
  actions: PropTypes.shape({
    enterUserListView: PropTypes.func.isRequired,
    leaveUserListView: PropTypes.func.isRequired
  })
}

export default UserListView
