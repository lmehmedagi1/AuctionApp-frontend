import React from "react";
import { Route, Redirect } from "react-router-dom";
import { userIsLoggedIn } from "../api/auth";

function ProtectedRoute({ children, ...rest }) {
  return (
    <Route {...rest} render={({ location }) =>
        userIsLoggedIn() ? (children) :
        (<Redirect to={{ pathname: '/login', state: { from: location } }} />)
      }
    />
  )
}

export default ProtectedRoute;
