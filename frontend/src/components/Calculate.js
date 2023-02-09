import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { useAuth } from "../provider/AuthProvider"
import { UpdateUser } from "./Modals"

import Unauthorized from "./Unauthorized"


function TextInput({ setShare, outOf, quantity, share }) {

    let total
    if (typeof outOf === "number") {
        total = outOf
    } else if (outOf.endsWith("Ml")) {
        total = outOf.match(/(\d+)Ml$/)[1]*quantity
    } else if (outOf.startsWith("100%")) {
        total = 100
    } else {
        total = quantity
    }

    const [shareValue, setShareValue] = useState(share !== 0 ? share*total : 1)

    function handleChange(event) {
        setShareValue(event.target.value)
    }

    function handleExit(event) {
        setShare(shareValue/total)
    }

    return (
        <>
            <input type="number" onBlur={handleExit} onChange={handleChange} min={1} step={1} max={total} value={shareValue}/>
            <label>&nbsp;{((typeof outOf === "string" && outOf.endsWith("Ml")) && (<>ml&nbsp;</>))}Out of {outOf}</label>
        </>
    )
}

function Dropdown({ setShare, quantity, share }) {
    const options = ["Sharing", "1", "1/2 of 1", "1/4 of 1", "3/4 of 1", "Custom", "More than 1"]
    const values = [0, 1, 0.5, 0.25, 0.75]
    if (quantity === 1) {
        options.pop()
    }

    let index = values.indexOf(share*quantity)
    if (index === -1) {
        if (Number.isInteger(share*quantity)) {
            index = 6
        } else {
            index = 5
        }
    }
    const [selection, setSelection] = useState(index)

    function handleSelection(event) {
        const value = Number(event.target.value)
        setSelection(value)
        if (value < 5) {
            setShare(values[value]/quantity)
        }
    }

    return (
        <>
            <select onChange={handleSelection} defaultValue={selection}>
                {options.map((value, itr) => (
                    <option key={"selection"+itr} value={itr}>{value}</option>
                ))}
            </select>
            {selection > 4 && (<TextInput setShare={setShare} outOf={selection === 5 ? `100% of ${quantity}` : `${quantity}`}
             quantity={quantity} share={share}/>)}
        </>
    )
}

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
