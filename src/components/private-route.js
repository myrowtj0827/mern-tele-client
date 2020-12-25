import React from "react";
import {Route, Redirect} from "react-router-dom";
import {connect} from "react-redux";

const PrivateRoute = ({component: Component, auth, ...rest}) => {
    const loggedIn = localStorage.getItem('client');

    return (
        <Route
            {...rest}
            render={props =>
                loggedIn === 'true' ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/client-login"/>
                )
            }
        />
    )
};

PrivateRoute.propTypes = {
    // auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    // auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
