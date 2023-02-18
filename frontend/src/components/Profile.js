import React, { useEffect, useState } from "react"

import { useAuth } from "../provider/AuthProvider"
import { ChangePassword } from "./Modals"


const Profile = () => {
    const { logout, server } = useAuth()
    const [userData, setUserData] = useState({})

    const logoutHandler = () => {
        logout()
    }

    useEffect(() => {
        server.getUserData().then(data => {
            setUserData(data)
        })
    }, [])    

    return (
        <div className={"flex items-center h-20 px-6 sm:px-10 bg-white"}>
            <a href="/dashboard"><h1 className={"text-4xl font-semibold mb-2"}>Dashboard</h1></a>
            <div className={"flex flex-shrink-0 items-center ml-auto"}>
                <span className={"font-semibold"}>{userData.firstName} {userData.lastName}</span>
                <span className={"h-12 w-12 ml-2 sm:ml-3 mr-2 bg-gray-100 rounded-full overflow-hidden"}>
                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="user profile photo" className={"h-full w-full object-cover"}/>
                </span>
                <div className={"border-l pl-3 ml-3 space-x-1"}>
                    <button className={"relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full"} onClick={logoutHandler}>
                        <span className={"sr-only"}>Log out</span>
                        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={"h-6 w-6"}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Profile
