import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../../provider/AuthProvider"


function UserBill({ userBill }) {
    const name = userBill.name.slice(0, -9)
    const date = userBill.name.slice(-8)
    return (
        <div className="divFlex flexCol">
            <label style={{margin: "0 10px", width: "max-content"}}>{name}</label>
            <label style={{margin: "0 10px", width: "max-content"}}>{date}</label>
            <label style={{margin: "0 10px"}}>{userBill.amount}</label>
        </div>
    )
}


function UserData({ userData }) {

    return (
        <li className="table-row" style={{padding: "7.5px 30px"}}>
            <div className="col col-1">{userData.username}</div>
            <div className="col col-all-bills">
                <div className="divFlex flexRow">
                    {userData.bills.map((userBill, keyItr) => (<UserBill key={keyItr} userBill={userBill}/>))}
                </div>
            </div>
        </li>
    )
}


const UserSplit = () => {
    const navigate = useNavigate()
    const { server, serverDown } = useAuth()
    const [users, setUsers] = useState([])
    
    function closePage() {
        navigate("/user", {replace: true})
    }

    useEffect(() => {
        server.allUsers().then(data => {
            setUsers(data.users)
        }).catch(err => {
            serverDown()
        })
    }, [])

    return (
        <>
            <h2 className={"text-3xl font-semibold mb-2"}>All Users</h2>
            <div className={"flex bg-white shadow rounded-lg"} style={{padding: "20px"}}>
                <div className={"p-4 flex-grow"}>
                        <div style={{marginBottom: "10px"}}>
                            <ul className="responsive-table">
                                <div className="parent">
                                    <li className="table-header">
                                        <div className="col col-1">User</div>
                                        <div className="col col-all-bills">Bills</div>
                                    </li>
                                </div>
                                <div className="children">
                                    {users.map((user, itr) => <UserData key={"item"+itr} userData={user}/>)}
                                </div>
                            </ul>
                        </div>
                    <div className="btnDiv">
                        <button onClick={closePage} className={`manage-button close-button`}><span>Close</span></button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserSplit
