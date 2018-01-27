// @flow weak

import React              from 'react'
import UserList           from './userList/UserList'
import UserListItem       from './userListItem/UserListItem'
import UserListCommands   from './userListCommands/UserListCommands'
import UserListAddUser    from './userListCommands/UserListAddUser'
import UserListSeeAllUser from './userListCommands/UserListSeeAllUser'
import Panel              from '../panel/Panel'

const UserListDemo = () => (
  <Panel
    hasTitle={true}
    title={'User list'}
    sectionCustomClass="tasks-widget">
    <UserList>
      <UserListItem
        label="Director is Modern Dashboard"
        done={false}
        statusLabel="2 days"
        statusLabelStyle="label-success"
      />
      <UserListItem
        label="Fully Responsive & Bootstrap 3.0.2 Compatible"
        done={false}
        statusLabel="Done"
        statusLabelStyle="label-danger"
      />
      <UserListItem
        label="Latest Design Concept"
        done={false}
        statusLabel="Company"
        statusLabelStyle="label-warning"
      />
      <UserListItem
        label="Write well documentation for this theme"
        done={false}
        statusLabel="3 Days"
        statusLabelStyle="label-primary"
      />
      <UserListItem
        label="Don't bother to download this Dashbord"
        done={false}
        statusLabel="Now"
        statusLabelStyle="label-inverse"
      />
      <UserListItem
        label="Give feedback for the template"
        done={false}
        statusLabel="2 Days"
        statusLabelStyle="label-success"
      />
      <UserListItem
        label="Tell your friends about this admin template"
        done={false}
        statusLabel="Now"
        statusLabelStyle="label-danger"
      />
    </UserList>
    <UserListCommands>
      <UserListAddUser />
      <UserListSeeAllUser />
    </UserListCommands>
  </Panel>
)

export default UserListDemo
