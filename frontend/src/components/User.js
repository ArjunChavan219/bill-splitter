import React, { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"

import { useAuth } from "../provider/AuthProvider"

import Bills from "./Bills"
import BillsSummary from "./BillsSummary"
import Profile from "./Profile"
import { AddBill, RemoveBill } from "./Modals"

import "../styles/Dashboard.css"


const User = () => {
    return (
        <div className={"flex bg-gray-100 min-h-screen"}>
            <div className={"flex-grow text-gray-800"}>
                <Profile />
                <main className={"p-6 sm:p-10 space-y-6"} style={{padding: "25px 40px"}}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default User
