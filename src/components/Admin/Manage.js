import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { useAuth } from "../../provider/AuthProvider"


function BillData({ data }) {
    const name = data.name.slice(0, -9)
    const date = data.name.slice(-8)
    let nStatus = data.status.charAt(0).toUpperCase() + data.status.slice(1)
    let iStatus = nStatus === "Open" ? "fa-ellipsis-h" : (nStatus === "Pending" ? "fa-unlock-alt" :
     (nStatus === "Ready" ? "fa-pencil-square-o" : "fa-check-circle-o"))
    const status = (<><i className={`fa ${iStatus}`} aria-hidden="true" /> {nStatus}</>)

    return (
        <li className="table-row">
            <div className="col col-1">{data.status === "ready" ? (<Link to="/user/manage-bill" state={data}>{status}</Link>) : status}</div>
            <div className="col col-2">{name}</div>
            <div className="col col-1">{date}</div>
            <div className="col col-1">{data.members}</div>
        </li>
    )
}


const Manage = () => {
    const { server, serverDown } = useAuth()
    const [allBills, setAllBills] = useState([])

    function updateBills() {
        server.getAllBills().then(data => {
            setAllBills(data.bills)
        }).catch(err => {
            serverDown()
        })
    }

    useEffect(() => {
        updateBills()
    }, [])

    return (
        <>
            <h2 className={"text-3xl font-semibold mb-2"}>All Bills</h2>
            <div className={"flex bg-white shadow rounded-lg"} style={{padding: "20px"}}>
                {allBills.length !== 0 && (
                    <div className={"p-4 flex-grow"}>
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
                    </div>
                )}
            </div>
        </>
    )
}

export default Manage
