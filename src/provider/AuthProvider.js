import React, { createContext, useContext, useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

import Server from "../routes/Server"
import { Encrypt, Decrypt } from "../permissions/Encryption"


const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()

    function getUserState() {
        let existingState = window.localStorage?.getItem("USER_STATE")
        return existingState ? Decrypt(existingState) : {
            username: "",
            permissions: []
        }
    }
    
    const [user, setUser] = useState(getUserState())

    useEffect(() => {
        window.localStorage.setItem("USER_STATE", Encrypt(user))
    }, [user])

    function handlePageChange() {
        setUser(getUserState())
    }

    useEffect(() => {
        if (!window.localStorage?.getItem("USER_STATE") || Decrypt(window.localStorage?.getItem("USER_STATE")).username === "") {
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
                setUser({ username: user, permissions: ["view_admin", "view_about"], userGroup: data.userGroup })
            } else {
                setUser({ username: user, permissions: ["view_about"], userGroup: data.userGroup })
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
