// @flow
/* eslint no-process-env:0 */
import React                        from 'react'
import { Route, Switch }            from 'react-router-dom'
import PrivateRoute                 from '../components/privateRoute/PrivateRoute'
import HomeConnected                from '../views/home'
import AlertConnected               from '../views/alert'
import BasicElementsConnected       from '../views/basicElements'
import BasicProgressBarConnected    from '../views/basicProgressBar'
import BreadcrumbViewConnected      from '../views/breadcrumb'
import EarningGraphConnected        from '../views/earningGraph'
import GeneralConnected             from '../views/general'
import NotificationsConnected       from '../views/notifications'
import PaginationViewConnected      from '../views/pagination'
import SimpleTablesConnected        from '../views/simpleTables'
import StatViewConnected            from '../views/stat'
import StatsCardConnected           from '../views/statsCard'
import StripedProgressBarConnected  from '../views/stripedProgressBar'
import TabPanelConnected            from '../views/tabPanel'
import TeamMatesViewConnected       from '../views/teamMates'
import TodoListViewConnected        from '../views/todoList'
import TwitterFeedConnected         from '../views/twitterFeed'
import WorkProgressConnected        from '../views/workProgress'
import ProtectedConnected           from '../views/protected'

import Dashboard  from '../views/dashboard'
import Rules from '../views/rules'
import Availability from '../views/availability'
import About from '../views/about'
import Tokens from '../views/tokens'
import Token from '../views/token'
import UserListViewConnected        from '../views/userList'
import RoundCycles from '../views/roundCycles'
import Survey from '../views/survey'
import FileUploader from '../views/briefUpload/FileUploader'

import GridViewSimple from '../views/grid/GridViewSimple'

export const MainRoutes = () => (
  <Switch>
    <Route exact path="/" component={ Dashboard } />
    <Route path="/Dashboard/availability" component={ Availability }  />
    <Route path="/Dashboard/statsCard" component={ StatsCardConnected } />
    <Route path="/Dashboard/earningGraph" component={ EarningGraphConnected } />
    <Route path="/Dashboard/notifications" component={NotificationsConnected} />
    <Route path="/Dashboard/workProgress" component={WorkProgressConnected} />
    <Route path="/Dashboard/twitterFeed" component={TwitterFeedConnected} />
    <Route path="/Dashboard/teamMates" component={TeamMatesViewConnected} />
    <Route path="/Dashboard/todoList" component={TodoListViewConnected} />
    <Route path="/Dashboard/home" component={ HomeConnected } />
    <Route path="/token/:token_id" component={ Token } />
    
    <Route path="/Analyst/survey" component={ Survey } />
    
    <Route path="/admin/userList" component={ UserListViewConnected } />
    <Route path="/admin/roundCycles" component={ RoundCycles } />

    <Route exact path="/simpleTables" component={ SimpleTablesConnected } />

    <Route exact path="/basicElements" component={BasicElementsConnected} />

    <Route exact path="/fileUpload" component={ FileUploader } />
    <Route exact path="/general" component={ GeneralConnected } />
    <Route path="/general/tokens" component={ Tokens } /> 
    <Route path="/general/rules" component={ Rules } />
    <Route path="/general/about" component={ About } />
    <Route path="/general/breadcrumb" component={ BreadcrumbViewConnected } />
    <Route path="/general/stat" component={ StatViewConnected } />
    <Route path="/general/basicProgressBars" component={ BasicProgressBarConnected} />
    <Route path="/general/tabPanels" component={ TabPanelConnected } />
    <Route path="/general/stripedProgressBars" component={ StripedProgressBarConnected } />
    <Route path="/general/alerts" component={ AlertConnected } />
    <Route path="/general/pagination" component={ PaginationViewConnected } />

    <Route path="/grid/simple" component={ GridViewSimple } />
    
    {/* private views: need user to be authenticated */}
    <PrivateRoute path="/protected" component={ ProtectedConnected } />

  </Switch>
);

export default MainRoutes;
