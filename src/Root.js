import React from "react";
import {HashRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Home from "./views/Home";
import Infograph from "./views/Infograph";
import AppLayout from './components/AppLayout'
import License from './views/License'
import Licenses from './views/Licenses'
import Profile from './views/profile/Profile'
import {EsiLoginCb} from './components/AuthWrapper'
import AuthWrapper from './components/AuthWrapper'
import {useRoutes} from './routes'

const Root = () => {
  const routes = useRoutes()

  return (
    <AuthWrapper>
      <Router>
        <AppLayout>
          <Switch>
            {routes.map(route => (
              <Route
                key={route.path}
                exact={route.exact}
                path={route.path}
                component={route.component}
              />
            ))}

            <Route exact path="/">
              <Redirect to="/home"/>
            </Route>

            {/* else */}
            <Route> 404 </Route>

          </Switch>
        </AppLayout>
      </Router>
    </AuthWrapper>
  )
};

export default Root;
