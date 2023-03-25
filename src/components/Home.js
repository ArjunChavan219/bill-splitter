import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../provider/AuthProvider"

import "../styles/Home.css"


function Home() {
    const [error, setError] = useState("")
    const [ifDisplay, setIfDisplay] = useState(false)
    const { user, login, server, serverDown } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        server.pingServer().then(res => {
            if (!res) {
                serverDown()
            } else if (user.username) {
                navigate("/user", { replace: true })
            } else {
                setIfDisplay(true)
                document.title = "PerePro Login"
            }
        })
        
    }, [])

    function handleLogin(event) {
        event.preventDefault()
        const username = event.target.elements[0].value
        const password = event.target.elements[1].value
        
        server.login(username, password).then(data => {
            if (data.success) {
                login(username, data.userGroup, data.token)
            } else {
                setError(data.error)
            }
        }).catch(err => {
            serverDown()
        })
    }

    function onExit() {
        setError("")
    }

    return (
        <>
            {ifDisplay &&
            <div className={"container"} style={{maxWidth: "none"}}>
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
                    <h2>&nbsp;</h2>
                </div>
            </div>
        }
        </>
    )
}

export default Home
