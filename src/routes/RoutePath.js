import React from "react"
import { Routes, Route } from "react-router-dom"

// import About from "../components/About"
import Bill from "../components/User/Bill"
import BillSplit from "../components/Admin/BillSplit"
import Dashboard from "../components/User/Dashboard"
import Home from "../components/Home"
import Manage from "../components/Admin/Manage"
import ManageBill from "../components/Admin/ManageBill"
import PageNotFound from "../components/Errors/PageNotFound"
import User from "../components/User/User"
import UserSplit from "../components/Admin/UserSplit"

import Authentication from "./Authentication"
import Authorization from "./Authorization"

import PERMISSIONS from "../permissions/Permissions"


function RoutePath() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_ABOUT]} />}>
                <Route path="about" element={<About />} />
            </Route> */}
            <Route path="user" element={
                <Authentication>
                    <User />
                </Authentication>
            }>
                <Route index element={<Dashboard />}/>
                <Route path="bill" element={<Bill />} />
                <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_ADMIN]} />}>
                    <Route path="manage" element={<Manage />} />
                    <Route path="manage-bill" element={<ManageBill />} />
                    <Route path="bill-split" element={<BillSplit />} />
                    <Route path="user-split" element={<UserSplit />} />
                </Route>
            </Route>
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    )
}

export default RoutePath
