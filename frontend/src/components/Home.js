import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../provider/AuthProvider"

import { LoginDiv, SignUp } from "./Modals"
import Login from "./Modals/Login"


function Home() {
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (user.username) {
            navigate("/dashboard", { replace: true })
        }
    }, [])

    return (
        <>
            <br />
            <p>Logo</p>
            <div>Home Page</div>
            {!user.username && <Login />}
            {/* {!user.username && <LoginDiv />}
            {!user.username && <SignUp />} */}
            <div>Test data</div>
        </>
    )
}

export default Home
