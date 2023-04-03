import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, useOutletContext } from "react-router-dom"

import { useAuth } from "../../provider/AuthProvider"

import Unauthorized from "../Errors/Unauthorized"


function UserData({ itr, userData }) {
    const status = userData.paid ? "Paid" : "Not Paid"
    const statusColor = userData.paid ? "green" : "red"
    return (
        <li className="table-row" style={{padding: "7.5px 30px"}}>
            <div className="col col-3">{itr}</div>
            <div className="col col-4">{userData.name}</div>
            <div className="col col-4">{userData.share}</div>
            <div className="col col-4" style={{color: statusColor}}>{status}</div>
        </li>
    )
}


const BillSplit = () => {
    const location = useLocation()
    const navigate = useNavigate()
    if (location.state === null) {
        return (<Unauthorized />)
    }
    
    const { name } = location.state
    const billName = name.slice(0, -9)
    const billDate = name.slice(-8)
    const { server, serverDown } = useAuth()
    const [usersData, setUsersData] = useState([])
    const [loading, setLoading] = useState(true)
    const LoadingScreen = useOutletContext()

    function closePage() {
        navigate("/user/manage", {replace: true})
    }

    useEffect(() => {
        server.billSplit(name).then(data => {
            setUsersData(data.users)
            setLoading(false)
        }).catch(err => {
            serverDown()
        })
    }, [])

    return (
        <LoadingScreen loading={loading}>
            <h2 className={"text-3xl font-semibold mb-2"}>Bill: &nbsp; {`${billName} (${billDate})`}</h2>
            <div className={"flex bg-white shadow rounded-lg"} style={{padding: "20px"}}>
                <div className={"p-4 flex-grow"}>
                        <div style={{marginBottom: "10px"}}>
                            <ul className="responsive-table">
                                <div className="parent">
                                    <li className="table-header">
                                        <div className="col col-3">Sr No.</div>
                                        <div className="col col-4">Item</div>
                                        <div className="col col-4">Shares</div>
                                        <div className="col col-4">Status</div>
                                    </li>
                                </div>
                                <div className="children">
                                    {usersData.map((user, itr) => <UserData key={"item"+itr} itr={itr+1}userData={user}/>)}
                                </div>
                            </ul>
                        </div>
                    <div className="btnDiv">
                        <button onClick={closePage} className={`manage-button close-button`}><span>Close</span></button>
                    </div>
                </div>
            </div>
        </LoadingScreen>
    )
}

export default BillSplit
