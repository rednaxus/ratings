// @flow weak

import React, {
  PureComponent
}                         from 'react';
import PropTypes          from 'prop-types';
import {
  AnimatedView,
  Panel,
  UserList,
  UserListItem,
  UserListCommands,
  UserListAddUser,
  UserListSeeAllUser
}                         from '../../components';

class UserListView extends PureComponent {
  enterAnimationTimer = null;
  
  state = {
    users: [
      {
        label: 'Director is Modern Dashboard',
        done: false,
        statusLabel: '2 days',
        statusLevel: 'label-success'
      },
      {
        label: 'Fully Responsive & Bootstrap 3.0.2 Compatible',
        done: false,
        statusLabel: 'done',
        statusLevel: 'label-danger'
      },
      {
        label: 'Latest Design Concept',
        done: false,
        statusLabel: 'Company',
        statusLevel: 'label-warning'
      },
      {
        label: 'Director is Modern Dashboard',
        done: false,
        statusLabel: '2 days',
        statusLevel: 'label-success'
      },
      {
        label: 'Director is Modern Dashboard',
        done: false,
        statusLabel: '2 days',
        statusLevel: 'label-success'
      },
      {
        label: 'Director is Modern Dashboard',
        done: false,
        statusLabel: '2 days',
        statusLevel: 'label-success'
      },
      {
        label: 'Director is Modern Dashboard',
        done: false,
        statusLabel: '2 days',
        statusLevel: 'label-success'
      }
    ]
  };

  componentWillMount() {
    const { actions: { enterUserListView } } = this.props;
    enterUserListView();
  }

  componentWillUnmount() {
    const { actions: { leaveUserListView } } = this.props;
    leaveUserListView();
    clearTimeout(this.enterAnimationTimer);
  }

  render() {
    const { users } = this.state;

    return(
      <AnimatedView>
        {/* preview: */}
        <div className="row">
          <div className="col-xs-8 col-xs-offset-2">
            <Panel
              hasTitle={true}
              title={'User list'}
              sectionCustomClass="tasks-widget">
              <UserList>
                {
                  users.map(
                    ({label, done, statusLabel, statusLevel}, userIdx) => {
                      return (
                        <UserListItem
                          key={userIdx}
                          label={label}
                          done={done}
                          statusLabel={statusLabel}
                          statusLabelStyle={statusLevel}
                        />
                      );
                    }
                  )
                }
              </UserList>
             <UserListCommands>
               <UserListAddUser />
               <UserListSeeAllUser />
             </UserListCommands>
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
};

export default UserListView;
