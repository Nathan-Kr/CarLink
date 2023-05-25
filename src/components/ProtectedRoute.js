import { useAuthenticationStatus } from '@nhost/react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuthenticationStatus()
    const location = useLocation()

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" state={{ from: location }} replace />
    }

    return <Outlet />
}