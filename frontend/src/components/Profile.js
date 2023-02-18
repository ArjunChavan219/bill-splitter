import React, { useEffect, useState } from "react"

import { useAuth } from "../provider/AuthProvider"
import { ChangePassword } from "./Modals"


const Profile = () => {
    const { user, server } = useAuth()
    const [userData, setUserData] = useState({})

    useEffect(() => {
        server.getUserData().then(data => {
            setUserData(data)
        })
    }, [])    

    return (
        <>
            <div>Profile</div>
            <div>Name: {userData.firstName} {userData.lastName}</div>
            <div>Username: {user.username}</div>
            {/* <ChangePassword password={userData.password}/> */}
        </>
    )
}

export default Profile
