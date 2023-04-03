import React, { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"

import Bills from "./Bills"
import BillsSummary from "./BillsSummary"
import { AddRemoveModal } from "../Modals/Modals"
import { useAuth } from "../../provider/AuthProvider"


import "../../styles/Dashboard.css"


const Dashboard = () => {
    const { server, serverDown } = useAuth()
    const [userBills, setUserBills] = useState([])
    const [loading, setLoading] = useState(true)
    const LoadingScreen = useOutletContext()

    useEffect(() => {
        document.title = "PerePro Dashboard"
        updateBills()
    }, [])

    function updateBills() {
        server.getUserBills().then(data => {
            setUserBills(data.bills)
            setLoading(false)
        }).catch(err => {
            serverDown()
        })
    }

    return (
        <LoadingScreen loading={loading}>
            <BillsSummary userBills={userBills}/>
            <div className={"flex bg-white shadow rounded-lg"} style={{padding: "20px"}}>
                <div className={"p-4 flex-grow"}>
                    <Bills userBills={userBills} updateBills={updateBills}/>
                    <div className="btnDiv">
                        <AddRemoveModal update={updateBills} user={[userBills.map(bill => bill.name)]} type={"bills"} add={true} />
                        <AddRemoveModal update={updateBills} user={[userBills.filter(bill => !bill.locked).map(bill => bill.name)]} type={"bills"} add={false} />
                    </div>
                </div>
                
            </div>
        </LoadingScreen>
    )
}

export default Dashboard
