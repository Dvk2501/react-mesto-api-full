import React from 'react';
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({loggedIn, component: Component, ...props  }) => {
  return (
    <Route>
      {loggedIn === true ? <Component {...props} /> : <Redirect to="/sign-in" />}
    </Route>
)}

export default ProtectedRoute;
