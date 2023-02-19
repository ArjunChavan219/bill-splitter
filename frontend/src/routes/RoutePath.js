import React from "react"
import { Routes, Route } from "react-router-dom"

import About from "../components/About"
import Bill from "../components/Bill"
import ManageBill from "../components/Calculate"
import Home from "../components/Home"
import Manage from "../components/Manage"
import PageNotFound from "../components/PageNotFound"
import Dashboard from "../components/Dashboard"
import User from "../components/User"

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
                        <Route path="calculate" element={<ManageBill />} />
                    </Route>
                </Route>
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    )
}

export default RoutePath
