import React from "react"
import { Routes, Route } from "react-router-dom"

import About from "../components/About"
import Bill from "../components/Bill"
import ManageBill from "../components/Calculate"
import Home from "../components/Home"
import Manage from "../components/Manage"
import PageNotFound from "../components/PageNotFound"
import Dashboard from "../components/Dashboard"

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
            <Route path="dashboard" element={
                <Authentication>
                    <Dashboard />
                </Authentication>
            } />
            <Route path="bill" element={
                <Authentication>
                    <Bill />
                </Authentication>
            } />
            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_ADMIN]} />}>
                <Route path="manage" element={<Manage />} />
                <Route path="calculate" element={<ManageBill />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    )
}

export default RoutePath
