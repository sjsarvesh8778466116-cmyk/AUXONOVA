import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'student' | 'patient';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { isLoggedIn, role } = useUser();
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect unauthenticated users to the professional login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is specified and does not match, redirect to the user's appropriate workspace
  if (allowedRole && role !== allowedRole) {
    const fallback = role === 'student' ? '/student' : '/tasks';
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
