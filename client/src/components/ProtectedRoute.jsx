import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  
  // Fallback to localStorage check if Redux state hasn't rehydrated yet
  const localUser = JSON.parse(localStorage.getItem('user'));

  if (!user && !localUser) {
    // Redirect unauthorized users to the landing/login page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;