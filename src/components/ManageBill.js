import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { useAuth } from "../provider/AuthProvider"
import { UpdateUser } from "./Modals"

import Unauthorized from "./Unauthorized"


function ItemData({ data, itemState }) {
    const users = []
    const shares = []
    data.users.forEach(user => {
        users.push(user.username)
        shares.push(user.share)
    });

    return (
        <li className="table-row">
            <div className="col col-4">{data.name}</div>
            <div className="col col-5">
                <table><tbody>
                    <tr>
                        {users.map(user => <td key={user}>{user}</td>)}
                    </tr>
                    <tr>
                        {shares.map(share => <td key={share}>{share}</td>)}
                    </tr>
                </tbody></table>
            </div>
        </li>
    )
}


const ManageBill = () => {
    const location = useLocation()
    const navigate = useNavigate()
    if (location.state === null) {
        return (<Unauthorized />)
    }
    
    const { name } = location.state
    const billName = name.slice(0, -9)
    const billDate = name.slice(-8)
    const { server } = useAuth()
    const [billItems, setBillItems] = useState([])
    const [billUsers, setBillUsers] = useState([])

    function updateItems() {
        server.manageBill(name).then(data => {
            setBillItems(data.items)
            setBillUsers(data.users)
        })
    }

    function saveBill() {
        server.saveBill(name, billItems).then(data => {
            navigate("/user/manage", {replace: true})
        })        
    }

    function closePage() {
        navigate("/user/manage", {replace: true})
    }

    useEffect(() => {
        updateItems()
    }, [])

    return (
        <>
            <h2 className={"text-3xl font-semibold mb-2"}>Bill: &nbsp; {`${billName} (${billDate})`}</h2>
            <div className={"flex bg-white shadow rounded-lg"} style={{padding: "20px"}}>
                <div className={"p-4 flex-grow"}>
                        <div style={{marginBottom: "10px"}}>
                            <ul className="responsive-table">
                                <div className="parent">
                                    <li className="table-header">
                                        <div className="col col-4">Item</div>
                                        <div className="col col-5">Shares</div>
                                    </li>
                                </div>
                                <div className="children">
                                    {billItems.map((item, itr) => <ItemData key={"item"+itr} data={item} itemState={[billItems, setBillItems]} />)}
                                </div>
                            </ul>
                        </div>
                    <div className="btnDiv">
                        <button onClick={saveBill} className={`manage-button save-button`} style={{marginRight: "7.5em"}}><span>Save</span></button>
                        <UpdateUser closePage={closePage} userState={[name, billUsers]}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageBill
