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
        <tr>
            <td>{data.name}</td>
            <td><table><tbody>
                <tr>
                    {users.map(user => <td key={user}>{user}</td>)}
                </tr>
                <tr>
                    {shares.map(share => <td key={share}>{share}</td>)}
                </tr>
            </tbody></table></td>
        </tr>
    )
}


const ManageBill = () => {
    const location = useLocation()
    const navigate = useNavigate()
    if (location.state === null) {
        return (<Unauthorized />)
    }
    
    const { name } = location.state
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
            navigate("/manage", {replace: true})
        })        
    }

    function closePage() {
        navigate("/manage", {replace: true})
    }

    useEffect(() => {
        updateItems()
    }, [])

    return (
        <>
            <div>Bill: &nbsp; {name}</div>
            <div>Items</div>
            <table><tbody>
                <tr>
                    <th>Item</th>
                    <th>Shares</th>
                </tr>
                {billItems.map((item, itr) => <ItemData key={"item"+itr} data={item} itemState={[billItems, setBillItems]} />)}
            </tbody></table>
            <button onClick={saveBill}>Save</button>
            <UpdateUser closePage={closePage} userState={[name, billUsers]}/>
        </>
    )
}

export default ManageBill
