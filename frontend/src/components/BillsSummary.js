import React, { useState, useEffect } from "react"

const Block = ({ bg, image, alt, size, value, text }) => {
    return (
        <div className={"flex items-center p-8 bg-white shadow rounded-lg"} style={{padding: "20px"}}>
            <div className={`inline-flex flex-shrink-0 items-center justify-center h-16 w-16 bg-${bg}-100 rounded-full mr-6`} style={{backgroundColor: `#${bg}`}}>
                <img src={`https://cdn.onlinewebfonts.com/svg/download_${image}.png`} alt={`${alt} image`} className={`h-${size} w-${size}`}/>
            </div>
            <div>
                <span className={"block text-2xl font-bold"}>{value}</span>
                <span className={"block text-gray-500"}>{text}</span>
            </div>
        </div>
    )
}

const BillsSummary = ({ userBills }) => {
    const [summary, setSummary] = useState([])

    useEffect(() => {
        let smry = [0, 0, 0]
        userBills.forEach(bill => {
            smry[0] += 1
            if (!bill.paid) {
                smry[1] += 1
                smry[2] += bill.amount
            }
        });
        setSummary(smry)
    }, [userBills])

    return (
        <section className={"grid md:grid-cols-2 xl:grid-cols-3 gap-6"}>
            <Block bg="bc99f1" image="86734" alt="bill" size="7" value={summary[0]} text="Total Bills"/>
            <Block bg="f8b0b0" image="370713" alt="pending" size="6" value={summary[1]} text="Pending Bills"/>
            <Block bg="9ff8d1" image="102210" alt="cash" size="9" value={summary[2]} text="Pending Amount"/>
        </section>
    )
}

export default BillsSummary
