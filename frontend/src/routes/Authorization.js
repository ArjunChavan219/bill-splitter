import React from "react"
import { Navigate, Outlet } from "react-router-dom"

import Unauthorized from "../components/Unauthorized"
import { useAuth } from "../provider/AuthProvider"


const Authorization = ({ permissions }) => {
    const { user } = useAuth()

    if (user.username) {
        const userPermission = user.permissions
        const isAllowed = permissions.some((allowed) => userPermission.includes(allowed))
        return isAllowed ? <Outlet /> : <Unauthorized />
    }

    return <Navigate to="/" state={{ path: "/dashboard" }} replace />
}

export default Authorization
