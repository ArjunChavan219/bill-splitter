import React, { useEffect } from "react"
import { Link } from "react-router-dom"

import { useAuth } from "../provider/AuthProvider"
import { AddBill, RemoveBill } from "./Modals"


function BillData({ data }) {
    let amount, status

    if (data.amount === 0) {
        amount = "TBC"
        status = data.locked ? "Locked" : (<Link to="/bill" state={data}>{"Edit"}</Link>)
    } else {
        amount = data.amount
        status = data.paid ? "Paid" : "Pending"
    }

    return (
        <tr>
            <td>{data.name}</td>
            <td>{status}</td>
            <td>{amount}</td>
        </tr>
    )
}


const Bills = ({ userBills, updateBills }) => {
    useEffect(() => {
        updateBills()
    }, [])

    return (
        <>
            <div>Bills</div>
            {userBills.length !== 0 && (<>
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
