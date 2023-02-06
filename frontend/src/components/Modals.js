import { useState } from "react"
import Modal from "react-modal"

import Login from "./Login"


function MainModal({ content, children }) {
    const [modalIsOpen, setIsOpen] = useState(false)
    const modalStyle = {
        content: {
            top: '30%',
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

function LoginDiv({ modalIsOpen, closeModal }) {

    return (
        <>
            <MainModal content="Login">
                <div>This is the Login Modal</div>
                <Login />
            </MainModal>
        </>
    )
}

function SignUp({ modalIsOpen, closeModal }) {

    return (
        <>
            <MainModal content="Sign Up">
                <div>This is the Sign Up Modal</div>
            </MainModal>
        </>
    )
}

Modal.setAppElement("#root")

export { SignUp, LoginDiv }