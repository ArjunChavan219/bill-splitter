import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { useAuth } from "../provider/AuthProvider"


function BillData({ data }) {
    return (
        <tr>
            <td>{data.status === "ready" ? (<Link to="/manage-bill" state={data}>{data.name}</Link>) : data.name}</td>
            <td>{data.status}</td>
        </tr>
    )
}


const Manage = () => {
    const { server } = useAuth()
    const [allBills, setAllBills] = useState([])

    function updateBills() {
        server.getAllBills().then(data => {
            setAllBills(data.bills)
        })
    }

    useEffect(() => {
        updateBills()
    }, [])

    return (
        <>
            <div>Bills</div>
            {allBills.length === 0 ? (<>
                <div>You have no Bills in the account. Please add.</div>
            </>) : (<>
                <table><tbody>
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Amount</th>
                    </tr>
                    {allBills.map((bill, itr) => <BillData key={itr} data={bill} />)}
                    </tbody></table>
            </>)}
        </>
    )
}

export default Manage
