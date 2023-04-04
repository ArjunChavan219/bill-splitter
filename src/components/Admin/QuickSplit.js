import React, { useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigate, useOutletContext } from "react-router-dom"

import { useAuth } from "../../provider/AuthProvider"
import { AddRemoveModal, UpdateUser } from "../Modals/Modals"

import Unauthorized from "../Errors/Unauthorized"

function UserShare({ itr, shareChange, users }) {
    const [share, setShare] = useState(0)

    useEffect(() => {
        setShare(users[itr][1])
    }, [users])

    function changeShare(event) {
        setShare(event.target.value)
    }
    function saveShare() {
        shareChange(parseFloat(share), itr)
    }

    return (
        <div className="divFlex flexCol">
            <label style={{margin: "0 10px"}}>{users[itr][0]}</label>
            <input type="number" value={share} min={0.01} max={1} step={0.01}
             style={{textAlign: "center", width: "auto"}} onChange={changeShare} onBlur={saveShare}/>
        </div>
    )
}


function ItemData({ itemData, updateBill, billUsers }) {
    const [itemItr, item, itemUsers] = itemData
    const [users, setUsers] = useState([])
    const [saved, setSaved] = useState(true)
    const totalShare = useMemo(() => {
        let sum = 0

        users.forEach(user => {
            sum += parseFloat(user[1])
        })

        return parseFloat(sum.toFixed(2))
    }, [users])
    const saveItem = () => {
        setSaved(true)
        updateBill(itemItr, users)
    }
    const itemStatus = useMemo(() => {
        let icon, color, saveAble = false

        if (totalShare != 1) {
            icon = "exclamation-circle"
            color = "red"
        } else if (saved) {
            icon = "lock"
            color = "#814ddb"
        } else {
            icon = "unlock-alt"
            color = "blue"
            saveAble = true
        }
        return (<i className={`fa fa-${icon}`} style={{color: color, fontSize: "25px"}} aria-hidden="true" 
        onClick={saveAble ? saveItem : null}/>)
    }, [totalShare, saved])

    useEffect(() => {
        const userShares = []
        itemUsers.forEach(user => {
            userShares.push([user.username, user.share])
        })
        setUsers(userShares)
    }, [])

    function shareChange(newShare, userItr) {
        setUsers(users.map((user, itr) => {
            if (itr !== userItr) {
                return user
            }
            let newUser = user
            user[1] = newShare
            return newUser
        }))
        setSaved(false)
    }

    function calculateShare() {
        const commonShare = parseFloat((1/users.length).toFixed(2))
        setUsers(users.map( user => {
            return [user[0], commonShare]
        }))
        setSaved(false)
    }

    function clearShare() {
        setUsers(users.map( user => {
            return [user[0], 0]
        }))
        setSaved(false)
    }

    return (
        <li className="table-row" style={{padding: "7.5px 30px"}}>
            <div className="col col-item">{item}</div>
            <div className="col col-icon">{itemStatus}</div>
            <div className="col col-share">{totalShare}</div>
            <div className="col col-share divFlex flexrow">
                <div className="divFlex flexCol">
                    <AddRemoveModal user={[users, setUsers, billUsers]}
                    type={"item-users"} add={true} />
                    <AddRemoveModal user={[users, setUsers, billUsers]}
                    type={"item-users"} add={false}/>
                </div>
                <div className="divFlex flexCol">
                    <button onClick={calculateShare} className={`manage-button calculate-mini-button`}><i className="fa fa-calculator" aria-hidden="true"/></button>
                    <button onClick={clearShare} className={`manage-button clear-mini-button`}><i className="fa fa-refresh" aria-hidden="true"/></button>
                </div>
            </div>
            <div className="col col-shares">
                <div  className="divFlex flexRow">
                    {users.map((userShare, keyItr) => (<UserShare key={keyItr} itr={keyItr}
                     shareChange={shareChange} users={users}/>))}
                </div>
            </div>
        </li>
    )
}


function GetItems({setAllUsers, setItems, setBill, setPage}) {
    const [names, setNames] = useState("")
    const [costs, setCosts] = useState("")
    const [users, setUsers] = useState("")

    function onNameBlur(event) {
        setNames(event.target.value)
    }
    function onCostBlur(event) {
        setCosts(event.target.value)
    }
    function onUserBlur(event) {
        setUsers(event.target.value)
    }

    function saveData() {
        const items = new Map();
        const bill = [];
        const costs_arr = costs.split("\n").map(cost => parseFloat(cost))
        names.split("\n").forEach((name, itr) => {
            items.set(name, costs_arr[itr])
            bill.push({
                name: name,
                users: [],
                locked: false
            })
        })
        setPage("main")
        setAllUsers(users.split("\n"))
        setItems(items)
        setBill(bill)
    }

    return (
        <>
            <div>
                <label>Names</label><br/>
                <textarea id="names" name="names" rows="4" cols="50" onBlur={onNameBlur}>
                </textarea><br/><br/>
                <label>Costs</label><br/>
                <textarea id="costs" name="costs" rows="4" cols="50" onBlur={onCostBlur}>
                </textarea><br/><br/>
                <label>Users</label><br/>
                <textarea id="users" name="users" rows="4" cols="50" onBlur={onUserBlur}>
                </textarea><br/><br/>
                <button onClick={saveData}>Next</button>
            </div>
        </>
    )
}

function ShowOutput({billItems, items, users}) {
    console.log(billItems);
    console.log(items);
    const userShares = new Map();
    users.forEach(val => {
        userShares.set(val, 0)
    })
    billItems.forEach(item => {
        const cost = items.get(item.name)
        item.users.forEach(user => {
            let userShare = userShares.get(user.username)
            userShare += user.share*cost
            userShares.set(user.username, userShare)
        })
    })


    return (
        <>
            <h2>Split:</h2>
            {Array.from(userShares, (entry, itr) => {
                return (<><label key={itr}>{`${entry[0]} -> ${entry[1].toFixed(2)}`}</label><br/></>)
            })}
        </>
    )
}


const QuickSplit = () => {
    const [page, setPage] = useState("input")
    const [billItems, setBillItems] = useState([])
    const [items, setItems] = useState([])
    const [billUsers, setBillUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [saved, setSaved] = useState(true)
    const LoadingScreen = useOutletContext()

    const isSaveable = useMemo(() => {
        return billItems.every(item => item.locked)
    }, [billItems])

    const statusColor = useMemo(() => {
        return isSaveable ? "black" : "#a64444"
    }, [isSaveable])

    function updateBill(itemItr, userItems) {
        setBillItems(billItems.map((item, itr) => {
            if (itr !== itemItr) {
                return item
            }
            let newItem = item
            newItem.locked = true
            newItem.users = userItems.map(user => {
                return {
                    share: user[1],
                    username: user[0]
                }
            })
            return newItem
        }))
        setSaved(false)
    }

    function saveBill() {
        setPage("output")
    }


    useEffect(() => {
        setLoading(false)
    }, [])

    return (
        <LoadingScreen loading={loading}>
            {page === "input" ? <GetItems setAllUsers={setBillUsers} setItems={setItems} setBill={setBillItems} setPage={setPage}/> : (page === "output" ? <ShowOutput billItems={billItems} items={items} users={billUsers}/> : <>
                <h2 className={"text-3xl font-semibold mb-2"}>New Bill:</h2>
                <div className={"flex bg-white shadow rounded-lg"} style={{padding: "20px"}}>
                    <div className={"p-4 flex-grow"}>
                            <div style={{marginBottom: "10px"}}>
                                <ul className="responsive-table">
                                    <div className="parent">
                                        <li className="table-header">
                                            <div className="col col-item">Item</div>
                                            <div className="col col-status" style={{color: statusColor}}>Status</div>
                                            <div className="col col-shares">Shares</div>
                                        </li>
                                    </div>
                                    <div className="children">
                                        {billItems.map((item, itr) => <ItemData key={"item"+itr} itemData={[itr, item.name, item.users]} billUsers={billUsers} updateBill={updateBill}/>)}
                                    </div>
                                </ul>
                            </div>
                        <div className="btnDiv">
                            {!saved && <button onClick={saveBill} className={`manage-button save-button`}><span>Save</span></button>}
                        </div>
                    </div>
                </div>
            </>)}
        </LoadingScreen>
    )
}



export default QuickSplit
