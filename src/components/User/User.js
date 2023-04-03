import React from "react"
import { Outlet } from "react-router-dom"

import Profile from "./Profile"
import { Gears } from "../Common"

import "../../styles/Dashboard.css"


const LoadingScreen = ({ loading, children }) => {
    return (
        <>{loading ? 
            <div className={`serverDown loading`} style={{height: "500px"}}>
                <h1>$nbsp</h1>
                <Gears />
            </div> : <>{children}</>
        }</>
    )
}


const User = () => {
    return (
        <div className={"flex bg-gray-100 min-h-screen"}>
            <div className={"flex-grow text-gray-800"}>
                <Profile />
                <main className={"p-6 sm:p-10 space-y-6"} style={{padding: "25px 40px", overflow: "auto", scrollbarGutter: "stable both-edges"}}>
                    <Outlet context={LoadingScreen}/>
                </main>
            </div>
        </div>
    )
}

export default User
