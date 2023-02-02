import React from "react"
import { NavLink } from "react-router-dom"

import { useAuth } from "../provider/AuthProvider"
import PERMISSIONS from "../permissions/Permissions"


function AuthCheck ({ permissions, children }) {
    const { user } = useAuth()

    if (user.username) {
        const userPermission = user.permissions
        const isAllowed = permissions.some((allowed) => userPermission.includes(allowed))
        return isAllowed && <>{children}</>
    }

    return (
        <></>
    )
}

function Navbar() {
    const style = {
        padding: "10px"
    }
    const { user } = useAuth()
    return (
        <nav>
            <NavLink to="/" style={style}>Home</NavLink>
            <AuthCheck permissions={[PERMISSIONS.CAN_VIEW_ABOUT]}>
                <NavLink to="/about" style={style}>About</NavLink>
            </AuthCheck>
            {user.username && <NavLink to="/profile" style={style}>Profile</NavLink>}
            {!user.username && <NavLink to="/login" style={style}>Login</NavLink>}
            <AuthCheck permissions={[PERMISSIONS.CAN_VIEW_EXTRA]}>
                <NavLink to="/extra" style={style}>Extra</NavLink>
            </AuthCheck>
        </nav>
    )
}

export default Navbar
