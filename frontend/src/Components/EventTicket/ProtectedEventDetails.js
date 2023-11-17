import React from 'react';
import { Navigate, Route } from 'react-router-dom';

const ProtectedEventDetails = ({ isLoggedIn, ...props }) => {
  return isLoggedIn ? (
    <Route {...props} />
  ) : (
    <Navigate to="/login" replace state={{ from: props.location }} />
  );
};

export default ProtectedEventDetails;
