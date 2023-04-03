import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../provider/AuthProvider"
import { Gears } from "./Common"

import "../styles/Home.css"


function Home() {
    const [error, setError] = useState("")
    const [ifDisplay, setIfDisplay] = useState(false)
    const [isLoading, setIsLoading] = useState(" loading")
    const [isReceiving, setIsReceiving] = useState("white")
    const [hover, setHover] = useState("")
    const { user, login, server } = useAuth()
    const navigate = useNavigate()

    const serverDown = () => {
        const timer = setTimeout(() => {
            setIsLoading("")
        }, 1000);
        return () => clearTimeout(timer);
    }

    useEffect(() => {
        server.pingServer().then(res => {
            if (!res) {
                return serverDown()
            } else if (user.username) {
                navigate("/user", { replace: true })
            } else {
                setIfDisplay(true)
                document.title = "PerePro Login"
                setTimeout(() => {
                    setHover(" container_active")
                }, 500)
            }
        })
        
    }, [])

    function handleLogin(event) {
        event.preventDefault()
        const username = event.target.elements[0].value
        const password = event.target.elements[1].value
        setIsReceiving("black")
        server.login(username, password).then(data => {
            if (data.success) {
                login(username, data.userName, data.userGroup, data.token)
            } else {
                setError(data.error)
                setIsReceiving("white")
            }
        }).catch(err => {
            setIfDisplay(false)
            return serverDown()
        })
    }

    function onExit() {
        setError("")
    }

    return (
        <>
            {ifDisplay ?
                <div className={`container${hover}`} style={{maxWidth: "none"}}>
                    <div className={"top"}></div>
                    <div className={"bottom"}></div>
                    <div className={"center"}>
                        <h2>Please Sign In</h2>
                        <form id="login" onSubmit={handleLogin}>
                            <input type="username" placeholder="Email" autoComplete="username" className={error === "Username" ? "error" : "normal"} onBlur={onExit}/>
                            <input type="password" placeholder="Password" autoComplete="password" className={error === "Password" ? "error" : "normal"} onBlur={onExit}/>
                            <button type="submit" className={"button"}>
                                Login
                            </button>
                        </form>
                        <i style={{color: isReceiving, marginTop: "50px", marginBottom: "-50px"}} className="fa fa-cog fa-spin fa-3x fa-fw"></i>

                    </div>
                </div> : <div className={`serverDown${isLoading}`}>
                    <h1>500</h1>
                    <h2 style={{margin: "10px 0px 0px"}}>Server is Down <b>:(</b></h2>
                    <h2 style={{margin: "0px 0px 20px"}}>Contact Admin </h2>
                    <Gears />
                </div>
            }
        </>
    )
}

export default Home
