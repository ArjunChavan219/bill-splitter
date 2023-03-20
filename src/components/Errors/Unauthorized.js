import React, { useEffect } from "react"

import { useAuth } from "../../provider/AuthProvider"

const Unauthorized = () => {
    const { server, serverDown } = useAuth()
    
    useEffect(() => {
        server.pingServer().then(res => {
            if (!res) {
                serverDown()
            }
        })
        
    }, [])

    return (
        <>
            <br />
            <div>You do not have permission to view this page</div>
        </>
    )
}

export default Unauthorized
