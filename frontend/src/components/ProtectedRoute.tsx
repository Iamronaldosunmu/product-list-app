// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    redirectPath?: string;
    children?: JSX.Element | JSX.Element[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectPath = '/', children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to={redirectPath} />;
    }

    return <>
        {children}
    </>;
};

export default ProtectedRoute;
