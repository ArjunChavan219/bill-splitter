import React, { useState } from "react"

import styles from "../../styles/Password.module.css"

import { useAuth } from "../../provider/AuthProvider"


function Input({ text, errorState, password, newPswdState }) {

    const [error, setError] = errorState
    const [newPswd, setnewPswd] = newPswdState

    let errorContent = (<></>)
    if (error[0] !== 0) {
        let errorMessage;
        if (error === 1 && text === "Old") {
            errorMessage = "Invalid Password"
        } else if (error === 2 && text === "New") {
            errorMessage = "Cannot be same as the Old Password"
        } else if (error === 3 && text === "Re-Enter") {
            errorMessage = "Password does not match the New Password"
        }
        errorContent = (<div className={styles.ErrorDiv}>{errorMessage}</div>)
    }
    const ac = text === "Old" ? "current-password" : "new-password"

    async function handleExit(event) {
        setError(0)
        const pswd = event.target.value
        if (text === "Old" && pswd !== password) {
            setError(1)
        } else if (text === "New" && pswd === password) {
            setError(2)
        } else if (text === "Re-Enter" && pswd !== newPswd) {
            setError(3)
        } else if (text === "New" && pswd !== password) {
            setnewPswd(pswd)
        }
    }

    return (
        <>
            <div className={styles.InputParentDiv}>
                <div className={styles.LabelDiv}>
                    <label>{text} {"Password"}</label>
                </div>
                <div className={styles.InputDiv}>
                    <input type="password" className={styles.Input} autoComplete={ac} onBlur={handleExit}/>
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

const Password = ({ password, onRequestClose }) => {
    const { user, login, server } = useAuth()
    const [error, setError] = useState(0)
    const [newPswd, setnewPswd] = useState("")
    
    function handleChange(event) {
        event.preventDefault()
        
        server.changePassword(newPswd).then(data => {
            if (data.success) {
                onRequestClose()
            }
        })
    }

    return (
        <>
            <form id="login" onSubmit={handleChange}>
                <input hidden type="text" autoComplete="username" value={user.username} readOnly/>
                <Input text="Old" errorState={[error, setError]} password={password} newPswdState={[newPswd, setnewPswd]}/>
                <Input text="New" errorState={[error, setError]} password={password} newPswdState={[newPswd, setnewPswd]}/>
                <Input text="Re-Enter" errorState={[error, setError]} password={password} newPswdState={[newPswd, setnewPswd]}/>
                <Button />
            </form>
            
        </>
    )
}

export default Password
