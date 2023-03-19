import React, { useState, useEffect } from "react"
import { useAuth } from "../provider/AuthProvider"

import Bills from "./Bills"
import BillsSummary from "./BillsSummary"
import { AddRemoveModal } from "./Modals"

import "../styles/Dashboard.css"


const Dashboard = () => {
    const { server, serverDown } = useAuth()
    const [userBills, setUserBills] = useState([])

    useEffect(() => {
        document.title = "PerePro Dashboard"
        updateBills()
    }, [])

    function updateBills() {
        server.getUserBills().then(data => {
            setUserBills(data.bills)
        }).catch(err => {
            serverDown()
        })
    }

    return (
        <>
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
        </>
    )
}

export default Dashboard
