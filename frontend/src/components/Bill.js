import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { useAuth } from "../provider/AuthProvider"

import { AddItem, RemoveItem, SaveBill } from "./Modals"
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
    const [share, setShare] = useState(data.share)
    const [userItems, setUserItems] = itemState

    useEffect(() => {
        setUserItems(userItems.map(item => {
            if (data.name !== item.name) {
                return item
            }
            let newItem = item
            newItem["share"] = share
            return newItem
        }))
    }, [share])

    let shareContent = ""
    if (data.type === "liquor") {
        shareContent = (<TextInput setShare={setShare} outOf={data.quantity + "x " + data.name.match(/ (\d+Ml)$/)[1]}
         quantity={data.quantity} share={share}/>)
    } else if (data.type === "miscellaneous") {
        shareContent = (<TextInput setShare={setShare} outOf={data.quantity} share={share}/>)
    } else {
        shareContent = (<Dropdown setShare={setShare} quantity={data.quantity} share={share}/>)
    }

    
    return (
        <li className="table-row">
            <div className="col col-1">{data.type.charAt(0).toUpperCase() + data.type.slice(1)}</div>
            <div className="col col-2">{data.name}</div>
            <div className="col col-3">{data.quantity}</div>
            <div className="col col-4">{shareContent}</div>
        </li>
    )
}


const Bill = () => {
    const location = useLocation()
    const navigate = useNavigate()
    if (location.state === null) {
        return (<Unauthorized />)
    }
    const { name } = location.state
    const billName = name.slice(0, -9)
    const billDate = name.slice(-8)
    const { server } = useAuth()
    const [userItems, setUserItems] = useState([])
    const [saved, setSaved] = useState(false)

    function updateItems() {
        server.getUserBill(name).then(data => {
            setUserItems(data.items)
        })
    }

    function saveItems() {
        server.updateUserBill(name, userItems).then(data => {
            setSaved(true)
        })
    }

    function submit() {
        server.lockUserBill(name).then(data => {
            navigate("/user", {replace: true})
        })
    }

    function cancel() {
        navigate("/user", {replace: true})
    }

    useEffect(() => {
        updateItems()
    }, [])

    useEffect(() => {
        setSaved(false)
    }, [userItems])

    return (
        <>
            <h2 className={"text-3xl font-semibold mb-2"}>Bill: &nbsp; {`${billName} (${billDate})`}</h2>
            <div className={"flex bg-white shadow rounded-lg"} style={{padding: "20px"}}>
                <div className={"p-4 flex-grow"}>
                    {userItems.length !== 0 && (
                        <div style={{marginBottom: "10px"}}>
                            <ul className="responsive-table">
                                <li className="table-header">
                                    <div className="col col-1">Type</div>
                                    <div className="col col-2">Item</div>
                                    <div className="col col-3">Quantity</div>
                                    <div className="col col-4">Share</div>
                                </li>
                                <div className="children">
                                    {userItems.map((item, itr) => <ItemData key={"item"+itr} data={item} itemState={[userItems, setUserItems]} />)}
                                </div>
                            </ul>
                        </div>
                    )}
                    <div className="btnDiv">
                        <AddItem updateItems={updateItems} userItems={[name, userItems, setUserItems]} />
                        <RemoveItem updateItems={updateItems} userItems={[name, userItems, setUserItems]} />
                    </div>
                    {userItems.length !== 0 && (
                        <div className="btnDiv">
                            <SaveBill saveItems={saveItems}/>
                            {/* {!saved && <button onClick={submit} className={`manage-button submit-button`}><span>Submit</span></button>} */}
                            {saved && <button onClick={submit} className={`manage-button submit-button`}><span>Submit</span></button>}
                        </div>
                    )}
                </div>
            </div>
            
            {/* <br />
            <SaveBill saveItems={saveItems}/>
            {saved && <button onClick={submit}>Submit</button>}
            <button onClick={cancel}>Cancel</button> */}
        </>
    )
}

export default Bill
