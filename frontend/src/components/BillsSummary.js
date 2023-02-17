import React, { useState, useEffect } from "react"


const BillsSummary = ({ userBills }) => {
    const [bills, setBills] = useState([])
    const [amount, setAmount] = useState(0)

    useEffect(() => {
        let totalBills = [0, 0]
        let amt = 0
        userBills.forEach(bill => {
            totalBills[0] += 1
            if (!bill.paid) {
                totalBills[1] += 1
                amt += bill.amount
            }
        });
        setBills(totalBills)
        setAmount(amt)
    }, [userBills])

    return (
        <>
            <div>Bills Summary</div>
            {userBills.length === 0 ? (<>
                <div>You have no Bills in the account. Please add.</div>
            </>) : (<>
                <div>Total Bills: {bills[0]}</div>
                <div>Pending Bills: {bills[1]}</div>
                <div>Total Amount to be Paid: {amount}</div>
            </>)}
        </>
    )
}

export default BillsSummary
