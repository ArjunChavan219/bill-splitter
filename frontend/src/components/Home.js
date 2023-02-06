import React from "react"
import { useAuth } from "../provider/AuthProvider"

import { LoginDiv, SignUp } from "./Modals"


function Home() {
    const { user } = useAuth()

    return (
        <>
            <br />
            <p>Logo</p>
            <div>Home Page</div>
            {!user.username && <LoginDiv />}
            {!user.username && <SignUp />}
            <div>Test data</div>
        </>
    )
}

export default Home
