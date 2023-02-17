import React, { useState } from "react"

import { useAuth } from "../provider/AuthProvider"
import Bills from "./Bills"
import BillsSummary from "./BillsSummary"
import Profile from "./Profile"



const User = () => {
    const { user, logout, server } = useAuth()
    const [userBills, setUserBills] = useState([])

    function updateBills() {
        server.getUserBills().then(data => {
            setUserBills(data.bills)
        })
    }

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
            <BillsSummary userBills={userBills}/>
            <br /><br /><br />
            <Bills userBills={userBills} updateBills={updateBills}/>
        </>
    )
}

export default User
