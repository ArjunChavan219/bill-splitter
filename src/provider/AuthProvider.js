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
        const new_state = getUserState()
        if (new_state.username === "") {
            setUser({
                username: "",
                permissions: []
            })
        }
        
    }

    function clearCache() {
        Object.keys(window.localStorage).forEach(key => {
            if (key.startsWith("BUE-")) {
                window.localStorage.removeItem(key)
            }
        })
    }

    useEffect(() => {
        if (!window.localStorage?.getItem("USER_STATE") || Decrypt(window.localStorage?.getItem("USER_STATE")).username === "") {
            clearCache()
        }
        handlePageChange()
    }, [location])

    const server = new Server(user, handlePageChange)

    const login = (user, userGroup, token) => {
        if (userGroup === "admin") {
            setUser({ username: user, permissions: ["view_admin", "view_about"], userGroup: userGroup, token: token })
        } else {
            setUser({ username: user, permissions: ["view_about"], userGroup: userGroup, token: token })
        }
        navigate("/user", { replace: true })
    }

    const logout = () => {
        setUser({ username: "", permissions: [] })
    }

    const serverDown = () => {
        clearCache()
        navigate("/down", { replace: true })
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, server, serverDown }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
