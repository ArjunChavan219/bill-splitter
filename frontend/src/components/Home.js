import React from "react"
import { useAuth } from "../provider/AuthProvider"

import { LoginDiv, SignUp } from "./Modals"
import Login from "./Modals/Login"


function Home() {
    const { user } = useAuth()

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
