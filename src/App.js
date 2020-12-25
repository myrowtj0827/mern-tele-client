import React from 'react';
import '../src/assets/css/index.css';
import {Route, Switch, Redirect, BrowserRouter as Router} from "react-router-dom";

import Body from "./components/body";
import RegisterClient from "./components/register-client";

import ClientSession from "./components/client-session";
import ClientVideoSession from "./components/client-video-session";
import ClientLogin from "./components/login";
import PrivateRoute from "./components/private-route";
import ClientForgotPassword from "./components/forgot-password";
import ClientResetPassword from "./components/reset-password";
import InvitedSession from "./components/invited-session";
import InvitedVideoSession from "./components/invited-video-session";

function App() {
    return (
        <Router>
            <Switch>
                <Route
                    path='/register-client/:id'
                    component={RegisterClient}
                />

                <Route
                    path='/client-login'
                    component={ClientLogin}
                />

                <Route
                    path='/forgot-password'
                    component={ClientForgotPassword}
                />

                <Route
                    path='/reset-password'
                    component={ClientResetPassword}
                />

                <Route
                    path='/client-session/:id'
                    component={ClientSession}
                />
                <Route
                    path='/room/:id'
                    component={ClientVideoSession}
                />

                <Route
                    path='/invited-session/:id'
                    component={InvitedSession}
                />
                <Route
                    path='/invited-room/:id'
                    component={InvitedVideoSession}
                />

                <PrivateRoute
                    path=''
                    component={Body}
                />

                <Redirect
                    to='/'
                />
            </Switch>
        </Router>
    );
}

export default App;