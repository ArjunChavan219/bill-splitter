import React, { useState } from "react"
import { Navigate } from "react-router-dom"

import styles from "../styles/Login.module.css"

import { useAuth } from "../provider/AuthProvider"


function Input({ text, error }) {
    const type = text === "Username" ? "text" : "password"
    const ac = text === "Username" ?  "username" : "current-password"
    const id = text === "Username" ?  "usernameInput" : "passwordInput"

    let errorContent = (<></>)
    if (error !== 0 && error === text) {
        const errorMessage = text === "Username" ? "Username is invalid" : "Password does not match"
        errorContent = (<div className={styles.ErrorDiv}>{errorMessage}</div>)
    }
    
    return (
        <>
            <div className={styles.InputParentDiv}>
                <div className={styles.LabelDiv}>
                    <label>{text}</label>
                </div>
                <div className={styles.InputDiv}>
                    <input id={id} type={type} className={styles.Input} autoComplete={ac}/>
                </div>
                {errorContent}
            </div>
        </>
    )
}

function Button() {
    return (
        <>
            <div className={styles.ButtonDiv}>
                <button type="submit" className={styles.Button}>
                    Login
                </button>
            </div>
        </>
    )
}

const Login = () => {
    const [error, setError] = useState("")
    const { user, login, server } = useAuth()

    if (user.username) {
        return <Navigate to="/profile" replace />
    }

    function handleLogin(event) {
        event.preventDefault()
        const username = event.currentTarget.elements.usernameInput.value
        const password = event.currentTarget.elements.passwordInput.value
        
        server.login(username, password).then(
			data => {
                if (data.success) {
                    login(username)
                    setError("")
                } else {
                    setError(data.error)
                }
			}
		)
    }

    return (
        <>
            <h1>Login Page</h1>

            <form id="login" onSubmit={handleLogin}>
                <Input text="Username" type="text" error={error}/>
                <Input text="Password" type="password" error={error}/>
                <Button />
            </form>
            
        </>
    )
}

export default Login
