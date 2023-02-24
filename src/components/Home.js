import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../provider/AuthProvider"

import "../styles/Home.css"


function Home() {
    const [error, setError] = useState("")
    const { user, login, server } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (user.username) {
            navigate("/user", { replace: true })
        } else {
            document.title = "PerePro Login"
        }
    }, [])

    function handleLogin(event) {
        event.preventDefault()
        const username = event.target.elements[0].value
        const password = event.target.elements[1].value
        
        server.login(username, password).then(data => {
            if (data.success) {
                login(username)
            } else {
                setError(data.error)
            }
        })
    }

    function onExit() {
        setError("")
    }

    return (
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
    )
}

export default Home
