import React, { useState, useEffect } from "react"

import { useAuth } from "../../provider/AuthProvider"


const Checkbox = ({ type, updateWindow, onRequestClose, userValueState, add }) => {
    const { server } = useAuth()
    const [values, setValues] = useState([])
    const [valueChecked, setValueChecked] = useState([])
    let billName, userValues, setUserValues;
    if (type === "bills") {
        userValues = userValueState
    } else if (type === "users") {
        [billName, userValues] = userValueState
    } else {
        [billName, userValues, setUserValues] = userValueState
    }

    useEffect(() => {
        if (type === "users" || !add) {
            setValues(userValues)
            setValueChecked(new Array(userValues.length).fill(false))
        } else {
            if (type === "bills") {
                server.getBills().then(data => {
                    setValues(data.bills.filter(bill => !userValues.includes(bill)))
                    setValueChecked(new Array(data.bills.length).fill(false))
                })
            } else {
                server.getBill(billName).then(data => {
                    const userValueNames = userValues.map(item => item.name)
                    setValues(data.items.filter(item => !userValueNames.includes(item.name)))
                    setValueChecked(new Array(data.items.length).fill(false))
                })
            }
        }
    }, [])

    function handleChange(itr) {
        setValueChecked(valueChecked.map((check, i) => i === itr ? !check : check))
    }

    function handleAdd() {
        const selectedValues = values.filter((value, itr) => valueChecked[itr])
        if (type === "users") {
            server.unlockBill(billName, selectedValues).then(data => {
                onRequestClose()
                updateWindow()
            })
        } else if (type === "bills") {
            if (add) {
                server.addUserBills(selectedValues).then(data => {
                    onRequestClose()
                    updateWindow()
                })
            } else {
                server.removeUserBills(selectedValues).then(data => {
                    onRequestClose()
                    updateWindow()
                })
            }
        } else {
            if (add) {
                setUserValues([...userValues, ...selectedValues])
                onRequestClose()
            } else {
                setUserValues(userValues.filter(item => !selectedValues.includes(item)))
                onRequestClose()
            }
        }
    }

    return (
        <>
            <div>Select {type}</div>
            {values.map((value, itr) => {
                return (
                    <div key={itr}>
                        <label>
                            <input type="checkbox" checked={valueChecked[itr]} onChange={() => handleChange(itr)} />
                            {type !== "items" ? value : value["name"]}
                        </label>
                    </div>
                )
            })}
            <button onClick={handleAdd}>{type === "users" ? "Request" : (add ? "Add" : "Remove")}</button>
        </>
    )
}

export default Checkbox
