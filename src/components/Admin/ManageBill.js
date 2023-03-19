import React, { useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { useAuth } from "../../provider/AuthProvider"
import { AddRemoveModal, UpdateUser } from "../Modals/Modals"

import Unauthorized from "..//Errors/Unauthorized"

function UserShare({ itr, shareChange, userShare }) {
    const [share, setShare] = useState(0)

    function changeShare(event) {
        setShare(event.target.value)
    }
    function saveShare() {
        shareChange(parseFloat(share), itr)
    }

    return (
        <div className="divFlex flexCol">
            <label style={{margin: "0 10px"}}>{userShare[0]}</label>
            <input type="number" defaultValue={userShare[1]} min={0.01} max={1} step={0.01}
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

        return sum
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

    return (
        <li className="table-row" style={{padding: "7.5px 30px"}}>
            <div className="col col-item">{item}</div>
            <div className="col col-icon">{itemStatus}</div>
            <div className="col col-share">{totalShare}</div>
            <div className="col col-icon">
                <div className="divFlex flexCol">
                    <AddRemoveModal user={[users, setUsers, billUsers]}
                    type={"item-users"} add={true} />
                    <AddRemoveModal user={[users, setUsers, billUsers]}
                    type={"item-users"} add={false}/>
                </div>
            </div>
            <div className="col col-shares">
                <div  className="divFlex flexRow">
                    {users.map((userShare, keyItr) => (<UserShare key={keyItr} itr={keyItr}
                     shareChange={shareChange} userShare={userShare}/>))}
                </div>
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
    const { server, serverDown } = useAuth()
    const [billItems, setBillItems] = useState([])
    const [billUsers, setBillUsers] = useState([])
    const [saved, setSaved] = useState(true)

    const billGroup = useRef("")
    const oldUsers = useRef(new Set())

    const activeUsers = useMemo(() => {
        const data = billItems.reduce((a, b) => [...new Set([...a, ...b.users.map(user => user.username)])], []);
        return data
    }, [billItems])

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
        const newUsers = new Set(activeUsers)
        const addUsers = activeUsers.filter(user => !oldUsers.current.has(user))
        const removeUsers = [...oldUsers.current].filter(user => !newUsers.has(user))
        server.saveBill(name, billItems, addUsers, removeUsers).then(data => {
            setSaved(true)
            oldUsers.current = newUsers
        }).catch(err => {
            serverDown()
        })
    }

    function closePage() {
        navigate("/user/manage", {replace: true})
    }

    function submitBill() {
        server.submitBill(name).then(data => {
            closePage()
        }).catch(err => {
            serverDown()
        })
    }

    useEffect(() => {
        server.manageBill(name).then(data => {
            setBillItems(data.items.map(item => {
                let totalShare = 0
                item.users.forEach(user => {
                    totalShare += user.share
                })
                item.locked = totalShare === 1
                return item
            }))
            setBillUsers(data.users)
            billGroup.current = data.group
            oldUsers.current = new Set(data.users)
        }).catch(err => {
            serverDown()
        })
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
                        <AddRemoveModal user={[billUsers, setBillUsers, [billGroup.current, activeUsers]]} type={"users"} add={true} />
                        {!saved && <button onClick={saveBill} className={`manage-button save-button`}><span>Save</span></button>}
                        <AddRemoveModal user={[billUsers, setBillUsers, [billGroup.current, activeUsers]]} type={"users"} add={false}/>
                    </div>
                    {saved && <div className="btnDiv">
                        <UpdateUser closePage={closePage} userState={[name, billUsers]}/>
                        <button onClick={submitBill} className={`manage-button submit-button`} style={{marginLeft: "5%"}} disabled={!isSaveable}><span>Submit</span></button>
                    </div>}
                </div>
            </div>
        </>
    )
}

export default ManageBill
