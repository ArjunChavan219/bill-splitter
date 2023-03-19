import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"

import { useAuth } from "../../provider/AuthProvider"

import "../../styles/ServerDown.css"

const ServerDown = () => {
    const { server} = useAuth()
    const [isLoading, setIsLoading] = useState(" loading")
    const navigate = useNavigate()

    useEffect(() => {
        server.pingServer().then(res => {
            if (res) {
                navigate("/", { replace: true })
            }
        })
        
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading("")
        }, 1000);
        return () => clearTimeout(timer);
    }, [])

    return (
        <div height="100%">
            <div className={`serverDown${isLoading}`}>
                <h1>500</h1>
                <h2 style={{margin: "10px 0px 0px"}}>Server is Down <b>:(</b></h2>
                <h2 style={{margin: "0px 0px 20px"}}>Contact Admin </h2>
                <div className="gears">
                    <div className="gear one">
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    </div>
                    <div className="gear two">
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    </div>
                    <div className="gear three">
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServerDown;
