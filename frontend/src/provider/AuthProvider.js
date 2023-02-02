import React, { createContext, useContext, useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

import Server from "../routes/Server"


const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const redirectPath = location.state?.path || "/profile"
    const userState = JSON.parse(window.localStorage?.getItem("USER_STATE")) || {
        username: "",
        permissions: []
    }
    const [user, setUser] = useState(userState)

    const login = (user) => {
        if (user === "admin") {
            setUser({ username: user, permissions: ["view_extra", "view_about"] })
        } else {
            setUser({ username: user, permissions: ["view_about"] })
        }
        navigate(redirectPath, { replace: true })
    }
    const logout = () => {
        setUser({ username: "", permissions: [] })
    }

    useEffect(() => {
        window.localStorage.setItem("USER_STATE", JSON.stringify(user))
    }, [user])

    function handlePageChange() {
        setUser(JSON.parse(window.localStorage?.getItem("USER_STATE")) || {
            username: "",
            permissions: []
        })
    }

    useEffect(() => {
        handlePageChange()
    }, [location])

    const server = new Server(user, handlePageChange)

    return (
        <AuthContext.Provider value={{ user, login, logout, server }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
