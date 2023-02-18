import React, { useState, useEffect } from "react"
import { useAuth } from "../provider/AuthProvider"

import Bills from "./Bills"
import BillsSummary from "./BillsSummary"
import Profile from "./Profile"
import { AddBill, RemoveBill } from "./Modals"

import "../styles/Dashboard.css"


const Dashboard = () => {
    const { server } = useAuth()
    const [userBills, setUserBills] = useState([])

    useEffect(() => {
        updateBills()
    }, [])

    function updateBills() {
        server.getUserBills().then(data => {
            setUserBills(data.bills)
        })
    }

    return (
        <div className={"flex bg-gray-100 min-h-screen"}>
            <div className={"flex-grow text-gray-800"}>
                <Profile />
                <main className={"p-6 sm:p-10 space-y-6"} style={{padding: "30px 40px"}}>
                    {/* <h1 className={"text-4xl font-semibold mb-2"}>Dashboard</h1> */}
                    <BillsSummary userBills={userBills}/>
                    <div className={"flex bg-white shadow rounded-lg"} style={{padding: "20px"}}>
                        <div className={"p-4 flex-grow"}>
                            <Bills userBills={userBills} updateBills={updateBills}/>
                            <div className="btnDiv">
                                <AddBill updateBills={updateBills} userBills={userBills.map(bill => bill.name)}/>
                                <RemoveBill updateBills={updateBills} userBills={userBills.filter(bill => !bill.locked).map(bill => bill.name)} />
                            </div>
                        </div>
                        
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Dashboard
