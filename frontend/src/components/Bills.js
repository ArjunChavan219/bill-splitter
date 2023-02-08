import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { useAuth } from "../provider/AuthProvider"
import { AddBill, RemoveBill } from "./Modals"


function BillData({ data }) {
    let amount, status

    if (data.amount === 0) {
        amount = "TBC"
        status = data.locked ? "Locked" : "Editable"
    } else {
        amount = data.amount
        status = data.paid ? "Paid" : "Pending"
    }

    return (
        <tr>
            <td>{data.locked ? data.name : (<Link to="/bill" state={data}>{data.name}</Link>)}</td>
            <td>{status}</td>
            <td>{amount}</td>
        </tr>
    )
}


const Bills = () => {
    const { server } = useAuth()
    const [userBills, setUserBills] = useState([])

    function updateBills() {
        server.getUserBills().then(data => {
            setUserBills(data.bills)
        })
    }

    useEffect(() => {
        updateBills()
    }, [])

    return (
        <>
            <div>Bills</div>
            {userBills.length === 0 ? (<>
                <div>You have no Bills in the account. Please add.</div>
            </>) : (<>
                <table><tbody>
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Amount</th>
                    </tr>
                    {userBills.map((bill, itr) => <BillData key={itr} data={bill} />)}
                    </tbody></table>
            </>)}
            <AddBill updateBills={updateBills} userBills={userBills.map(bill => bill.name)}/>
            <RemoveBill updateBills={updateBills} userBills={userBills.filter(bill => !bill.locked).map(bill => bill.name)} />
        </>
    )
}

export default Bills
