import { useState } from "react"
import Modal from "react-modal"

import Login from "./Login"
import Password from "./Password"


function MainModal({ content, children }) {
    const [modalIsOpen, setIsOpen] = useState(false)
    const modalStyle = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)'
        }
    }

    function openModal() {
        setIsOpen(true)
    }

    function closeModal() {
        setIsOpen(false)
    }

    return (
        <>
            <button onClick={openModal}>{content}</button>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyle}>
                {children}
            </Modal>
        </>
    )
}

function LoginDiv() {

    return (
        <>
            <MainModal content="Login">
                <div>This is the Login Modal</div>
                <Login />
            </MainModal>
        </>
    )
}

function SignUp() {

    return (
        <>
            <MainModal content="Sign Up">
                <div>This is the Sign Up Modal</div>
            </MainModal>
        </>
    )
}

function ChangePassword({ password }) {
    const [modalIsOpen, setIsOpen] = useState(false)
    const modalStyle = {
        content: {
            top: '40%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)'
        }
    }

    function openModal() {
        setIsOpen(true)
    }

    function closeModal() {
        setIsOpen(false)
    }

    return (
        <>
            <button onClick={openModal}>Change Password</button>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyle}>
                <div>This is the Change Password Modal</div>
                <Password password={password} onRequestClose={closeModal}/>
            </Modal>
        </>
    )
}

Modal.setAppElement("#root")

export { SignUp, LoginDiv, ChangePassword }