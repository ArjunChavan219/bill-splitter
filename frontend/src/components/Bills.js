import React from "react"

import { useAuth } from "../provider/AuthProvider"


const Bills = () => {
    const { user } = useAuth()

    return (
        <>
            <div>Bills</div>
        </>
    )
}

export default Bills
