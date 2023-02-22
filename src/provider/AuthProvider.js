import React, { createContext, useContext, useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

import Server from "../routes/Server"


const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const userState = JSON.parse(window.localStorage?.getItem("USER_STATE")) || {
        username: "",
        permissions: []
    }
    const [user, setUser] = useState(userState)

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
        if (!window.localStorage?.getItem("USER_STATE") || JSON.parse(window.localStorage?.getItem("USER_STATE")).username === "") {
            Object.keys(window.localStorage).forEach(key => {
                if (key.startsWith("BUE-")) {
                    window.localStorage.removeItem(key)
                }
            })
        }
        handlePageChange()
    }, [location])

    const server = new Server(user, handlePageChange)

    const login = (user) => {
        server.permission(user).then(data => {
            if (data.userGroup === "admin") {
                setUser({ username: user, permissions: ["view_admin", "view_about"] })
            } else {
                setUser({ username: user, permissions: ["view_about"] })
            }
            navigate("/user", { replace: true })
        })
    }
    const logout = () => {
        setUser({ username: "", permissions: [] })
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, server }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
