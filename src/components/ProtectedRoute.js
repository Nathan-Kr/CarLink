import { useAuthenticationStatus } from '@nhost/react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import ReactLoading from "react-loading";
import React from 'react';
import Box from '@mui/material/Box';

export function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuthenticationStatus()
    const location = useLocation()

    if (isLoading) {
        return (
            <Box sx={{display: "flex", justifyContent: "center"}}>
                <ReactLoading
                    type="bubbles"
                    color="#EB4E5F"
                    height={400}
                    width={200}
                />
            </Box>
      )
    }

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" state={{ from: location }} replace />
    }

    return <Outlet />
}