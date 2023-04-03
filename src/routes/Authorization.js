import React from "react"
import { Navigate, Outlet, useOutletContext } from "react-router-dom"

import Unauthorized from "../components/Errors/Unauthorized"
import { useAuth } from "../provider/AuthProvider"


const Authorization = ({ permissions }) => {
    const { user } = useAuth()
    const LoadingScreen = useOutletContext()

    if (user.username) {
        const userPermission = user.permissions
        const isAllowed = permissions.some((allowed) => userPermission.includes(allowed))
        return isAllowed ? <Outlet context={LoadingScreen}/> : <Unauthorized />
    }

    return <Navigate to="/" state={{ path: "/user" }} replace />
}

export default Authorization
