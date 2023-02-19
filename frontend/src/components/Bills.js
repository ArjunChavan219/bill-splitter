import React, { useEffect } from "react"
import { Link } from "react-router-dom"


function BillData({ data }) {
    let amount, nStatus, iStatus
    const name = data.name.slice(0, -9)
    const date = data.name.slice(-8)

    if (data.amount === 0) {
        amount = "TBC"
        nStatus = data.locked ? "Locked" : "Edit"
        iStatus = data.locked ? "fa-lock" : "fa-pencil-square-o"
    } else {
        amount = data.amount
        nStatus = data.paid ? "Paid" : "Pending"
        iStatus = data.paid ? "fa-check-circle-o" : "fa-credit-card"
    }
    const status = (<><i className={`fa ${iStatus}`} aria-hidden="true" /> {nStatus}</>)
    
    return (
        <li className="table-row">
            <div className="col col-1">{nStatus === "Edit" ? (<Link to="/user/bill" state={data}>{status}</Link>) : status}</div>
            <div className="col col-2">{name}</div>
            <div className="col col-3">{date}</div>
            <div className="col col-4">{amount}</div>
        </li>
    )
}


const Bills = ({ userBills, updateBills }) => {
    useEffect(() => {
        updateBills()
    }, [])

    return (
        <div style={{marginBottom: "10px"}}>
            {userBills.length !== 0 && (<>
                <ul className="responsive-table">
                    <li className="table-header">
                        <div className="col col-1">Status</div>
                        <div className="col col-2">Name</div>
                        <div className="col col-3">Date</div>
                        <div className="col col-4">Amount</div>
                    </li>
                    <div className="children">
                        {userBills.map((bill, itr) => <BillData key={itr} data={bill} />)}
                    </div>
                </ul>
            </>)}
            
        </div>
    )
}

export default Bills
