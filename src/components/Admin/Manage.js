import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { useAuth } from "../../provider/AuthProvider"


function BillData({ data }) {
    const name = data.name.slice(0, -9)
    const date = data.name.slice(-8)
    let nStatus = data.status.charAt(0).toUpperCase() + data.status.slice(1)
    let iStatus = nStatus === "Open" ? "fa-ellipsis-h" : (nStatus === "Pending" ? "fa-unlock-alt" :
     (nStatus === "Ready" ? "fa-pencil-square-o" : "fa-check-circle-o"))
    const statusName = (<><i className={`fa ${iStatus}`} aria-hidden="true" /> {nStatus}</>)
    let status
    if (data.status === "ready") {
        status = <Link to="/user/manage-bill" state={data}>{statusName}</Link>
    } else if (data.status === "settled") {
        status = <Link to="/user/bill-split" state={data}>{statusName}</Link>
    } else {
        status = statusName
    }

    return (
        <li className="table-row">
            <div className="col col-1">{status}</div>
            <div className="col col-2">{name}</div>
            <div className="col col-1">{date}</div>
            <div className="col col-1">{data.members}</div>
        </li>
    )
}


const Manage = () => {
    const navigate = useNavigate()
    const { server, serverDown } = useAuth()
    const [allBills, setAllBills] = useState([])

    function updateBills() {
        server.getAllBills().then(data => {
            setAllBills(data.bills)
        }).catch(err => {
            serverDown()
        })
    }

    function closePage() {
        navigate("/user", {replace: true})
    }

    useEffect(() => {
        updateBills()
    }, [])

    return (
        <>
            <h2 className={"text-3xl font-semibold mb-2"}>All Bills</h2>
            <div className={"flex bg-white shadow rounded-lg"} style={{padding: "20px"}}>
                <div className={"p-4 flex-grow"}>
                    {allBills.length !== 0 && (
                        <ul className="responsive-table">
                            <div className="parent">
                                <li className="table-header">
                                    <div className="col col-1">Status</div>
                                    <div className="col col-2">Name</div>
                                    <div className="col col-1">Date</div>
                                    <div className="col col-1">Members</div>
                                </li>
                            </div>
                            <div className="children">
                                {allBills.map((bill, itr) => <BillData key={itr} data={bill} />)}
                            </div>
                        </ul>
                    )}
                    <div className="btnDiv">
                        <button onClick={closePage} className={`manage-button close-button`}><span>Close</span></button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Manage
