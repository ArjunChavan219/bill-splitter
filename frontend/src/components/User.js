import React from "react"

import { useAuth } from "../provider/AuthProvider"
import Bills from "./Bills"
import Profile from "./Profile"



const User = () => {
    const { user, logout } = useAuth()
    const logoutHandler = () => {
        logout()
    }

    return (
        <>
            <h1>Welcome {user.username}</h1>
            <button type="submit" onClick={logoutHandler}>
                Logout
            </button>
            <br /><br /><br />
            <Profile />
            <br /><br /><br />
            <Bills />
        </>
    )
}

export default User
