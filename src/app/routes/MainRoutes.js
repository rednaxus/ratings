// @flow
/* eslint no-process-env:0 */
import React                        from 'react'
import { Route, Switch }            from 'react-router-dom'
import PrivateRoute                 from '../components/privateRoute/PrivateRoute'
import HomeConnected                from '../views/examples/home'
import AlertConnected               from '../views/examples/alert'
import BasicElementsConnected       from '../views/examples/basicElements'
import BasicProgressBarConnected    from '../views/examples/basicProgressBar'
import BreadcrumbViewConnected      from '../views/examples/breadcrumb'
import EarningGraphConnected        from '../views/examples/earningGraph'
import GeneralConnected             from '../views/examples/general'
import NotificationsConnected       from '../views/examples/notifications'
import PaginationViewConnected      from '../views/examples/pagination'
import SimpleTablesConnected        from '../views/examples/simpleTables'
import StatViewConnected            from '../views/examples/stat'
import StatsCardConnected           from '../views/examples/statsCard'
import StripedProgressBarConnected  from '../views/examples/stripedProgressBar'
import TabPanelConnected            from '../views/examples/tabPanel'
import TeamMatesViewConnected       from '../views/examples/teamMates'
import TodoListViewConnected        from '../views/todoList'
import TwitterFeedConnected         from '../views/examples/twitterFeed'
import WorkProgressConnected        from '../views/examples/workProgress'
import ProtectedConnected           from '../views/protected'

import Dashboard  from '../views/dashboard'
import Rules from '../views/rules'
import Availability from '../views/availability'
import About from '../views/about'
import Tokens from '../views/tokens'
import Token from '../views/token'
import UserListViewConnected        from '../views/userList'
import RoundCycles from '../views/roundCycles'
import Round from '../views/round'

import Survey from '../views/survey'
import FileUploader from '../views/briefUpload/FileUploader'

import GridView from '../views/examples/grid'
import Cycles from '../views/cycles'
import Analysts from '../views/analysts'
import Status from '../views/status'

export const MainRoutes = () => (
  <Switch>
    <Route exact path="/" component={ Dashboard } />

    <Route path="/examples/statsCard" component={ StatsCardConnected } />
    <Route path="/examples/earningGraph" component={ EarningGraphConnected } />
    <Route path="/examples/notifications" component={NotificationsConnected} />
    <Route path="/examples/workProgress" component={WorkProgressConnected} />
    <Route path="/examples/twitterFeed" component={TwitterFeedConnected} />
    <Route path="/examples/teamMates" component={TeamMatesViewConnected} />
    <Route path="/Dashboard/todoList" component={TodoListViewConnected} />
    <Route path="/examples/home" component={ HomeConnected } />
    <Route exact path="/examples/simpleTables" component={ SimpleTablesConnected } />
    <Route exact path="/examples/basicElements" component={BasicElementsConnected} />
    <Route path="/examples/basicProgressBars" component={ BasicProgressBarConnected} />
    <Route path="/examples/tabPanels" component={ TabPanelConnected } />
    <Route path="/examples/stripedProgressBars" component={ StripedProgressBarConnected } />
    <Route path="/examples/breadcrumb" component={ BreadcrumbViewConnected } />
    <Route path="/examples/stat" component={ StatViewConnected } />
    <Route path="/examples/alerts" component={ AlertConnected } />
    <Route path="/examples/pagination" component={ PaginationViewConnected } />

    <Route path="/examples/grid/simple" component={ GridView } />
    <Route path="/examples/grid/customPager" component={ GridView } />

    <Route path="/token/:token_id" component={ Token } />
    
    <Route path="/Analyst/availability" component={ Availability }  />
    <Route path="/Analyst/survey" component={ Survey } />
    <Route path="/Analyst/status" component={ Status } />
    
    <Route path="/admin/userList" component={ UserListViewConnected } />
    <Route path="/admin/roundCycles" component={ RoundCycles } />

    <Route path="/admin/analysts" component={ Analysts } />
    <Route path="/admin/cycles" component = { Cycles } />
    


    <Route exact path="/fileUpload" component={ FileUploader } />
    <Route exact path="/general" component={ GeneralConnected } />
    
    <Route path="/general/tokens" component={ Tokens } /> 
    <Route path="/general/rules" component={ Rules } />
    <Route path="/general/about" component={ About } />


    <Route path="/round/:id" component={ Round } />
    {/* private views: need user to be authenticated */}
    <PrivateRoute path="/protected" component={ ProtectedConnected } />

  </Switch>
);

export default MainRoutes;
