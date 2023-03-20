import React, { useState, useEffect } from "react"

import { useAuth } from "../../provider/AuthProvider"

import "../../styles/Checkbox.css"


const Checkbox = ({ type, updateWindow, onRequestClose, userValueState, add }) => {
    const { server, serverDown } = useAuth()
    const [values, setValues] = useState([])
    const [valueChecked, setValueChecked] = useState([])
    let billData, userValues, setUserValues;
    if (type === "bills") {
        userValues = userValueState[0]
    } else if (type === "update-users") {
        [billData, userValues] = userValueState
    } else {
        [userValues, setUserValues, billData] = userValueState
    }

    useEffect(() => {
        let finalValues;
        if (type === "update-users" || !add) {
            if (type === "item-users") {
                finalValues = userValues.map(user => user[0])
            } else if (type === "users") {
                finalValues = userValues.filter(user => !billData[1].includes(user))
            } else {
                finalValues = userValues
            }
            setValues(finalValues)
            setValueChecked(new Array(finalValues.length).fill(false))
        } else if (type === "bills") {
            server.getBills().then(data => {
                finalValues = data.bills.filter(bill => !userValues.includes(bill))
                setValues(finalValues)
                setValueChecked(new Array(finalValues.length).fill(false))
            }).catch(err => {
                serverDown()
            })
        } else if (type === "item-users") {
            const userValueNames = userValues.map(user => user[0])
            finalValues = billData.filter(user => !userValueNames.includes(user))
            setValues(finalValues)
            setValueChecked(new Array(finalValues.length).fill(false))
        } else if (type === "users") {
            server.getUsers(billData[0]).then(data => {
                finalValues = data.users.filter(user => !userValues.includes(user))
                setValues(finalValues)
                setValueChecked(new Array(finalValues.length).fill(false))
            }).catch(err => {
                serverDown()
            })
        } else {
            server.getBill(billData).then(data => {
                const userValueNames = userValues.map(item => item.name)
                finalValues = data.items.filter(item => !userValueNames.includes(item.name))
                setValues(finalValues)
                setValueChecked(new Array(finalValues.length).fill(false))
            }).catch(err => {
                serverDown()
            })
        }
    }, [])

    function handleChange(itr) {
        setValueChecked(valueChecked.map((check, i) => i === itr ? !check : check))
    }

    function handleAdd() {
        const selectedValues = values.filter((value, itr) => valueChecked[itr])
        if (type === "update-users") {
            server.unlockBill(billData, selectedValues).then(data => {
                onRequestClose()
                updateWindow()
            }).catch(err => {
                serverDown()
            })
        } else if (type === "bills") {
            if (add) {
                server.addUserBills(selectedValues).then(data => {
                    onRequestClose()
                    updateWindow()
                }).catch(err => {
                    serverDown()
                })
            } else {
                server.removeUserBills(selectedValues).then(data => {
                    onRequestClose()
                    updateWindow()
                }).catch(err => {
                    serverDown()
                })
            }
        } else if (type === "item-users") {
            if (add) {
                setUserValues([...userValues, ...selectedValues.map(user => [user, 0])])
                onRequestClose()
            } else {
                setUserValues(userValues.filter(user => !selectedValues.includes(user[0])))
                onRequestClose()
            }
        } else if (type === "users") {
            if (add) {
                setUserValues([...userValues, ...selectedValues])
                onRequestClose()
            } else {
                setUserValues(userValues.filter(user => !selectedValues.includes(user)))
                onRequestClose()
            }
        } else {
            if (add) {
                setUserValues([...userValues, ...selectedValues])
                onRequestClose()
            } else {
                setUserValues(userValues.filter(value => !selectedValues.includes(value)))
                onRequestClose()
            }
        }
    }

    const typeContent = type.endsWith("users") ? "Users" : type.charAt(0).toUpperCase() + type.slice(1)

    return (
        <>
            <h3>Select {typeContent} to be {type === "update-users" ? "Requested" : (add ? "Added" : "Removed")}:</h3>
            <div className={"group"} style={{width: "auto", justifyContent: "center", margin: "10px"}}>
            {values.map((value, itr) => {
                return (
                    <div key={itr} style={{width: "auto"}}>
                        <input id={`cb-${itr}`} type="checkbox" checked={valueChecked[itr]} onChange={() => handleChange(itr)} />
                        <label className="cbLabel" htmlFor={`cb-${itr}`}>{type !== "items" ? value : value["name"]}</label>
                    </div>
                )
            })}

            <button onClick={handleAdd} className={`manage-button confirm-button`}><span>Confirm</span></button>
            </div>
        </>
    )
}

export default Checkbox
