import { useEffect, useState } from "react"
import Modal from "react-modal"

import Checkbox from "./Modals/Checkbox"
import Login from "./Modals/Login"
import Password from "./Modals/Password"

class ParentModal {
    constructor(customFunction) {
        this.modalStyle = {
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(-50%, -50%)'
            }
        }
        const [modalIsOpen, setIsOpen] = useState(false)
        this.modalIsOpen = modalIsOpen
        this.setIsOpen = setIsOpen

        this.openModal = () => {
            if (customFunction !== undefined) {
                customFunction()
            }
            this.setIsOpen(true)
        }

        this.closeModal = () => {
            this.setIsOpen(false)
        }
    }
}

function MainModal({ object, content, children }) {
    return (
        <>
            <button onClick={object.openModal}>{content}</button>
            <Modal isOpen={object.modalIsOpen} onRequestClose={object.closeModal} style={object.modalStyle}>
                {children}
            </Modal>
        </>
    )
}

function LoginDiv() {
    const modal = new ParentModal()

    return (
        <>
            <MainModal object={modal} content="Login">
                <div>This is the Login Modal</div>
                <Login />
            </MainModal>
        </>
    )
}

function SignUp() {
    const modal = new ParentModal()

    return (
        <>
            <MainModal object={modal} content="Sign Up">
                <div>This is the Sign Up Modal</div>
            </MainModal>
        </>
    )
}

function ChangePassword({ password }) {
    const modal = new ParentModal()
    modal.modalStyle.top = "40%"

    return (
        <>
            <MainModal object={modal} content="Change Password">
                <div>This is the Change Password Modal</div>
                <Password password={password} onRequestClose={modal.closeModal}/>
            </MainModal>
        </>
    )
}

function AddBill({ updateBills, userBills }) {
    const modal = new ParentModal()
    modal.modalStyle.top = "40%"

    return (
        <>
            <MainModal object={modal} content="Add Bills">
                <div>This is the Add Bill Modal</div>
                <Checkbox type={"bills"} updateWindow={updateBills} onRequestClose={modal.closeModal} userValueState={userBills} add={true}/>
            </MainModal>
        </>
    )
}

function RemoveBill({ updateBills, userBills }) {
    const modal = new ParentModal()
    modal.modalStyle.top = "40%"

    return (
        <>
            <MainModal object={modal} content="Remove Bills">
                <div>This is the Remove Bill Modal</div>
                {userBills.length === 0 ? (
                        <div>No active bills</div>
                    ) : (
                        <Checkbox type={"bills"} updateWindow={updateBills} onRequestClose={modal.closeModal} userValueState={userBills} add={false}/>
                )}
                
            </MainModal>
        </>
    )
}

function AddItem({ updateItems, userItems }) {
    const modal = new ParentModal()
    modal.modalStyle.top = "40%"

    return (
        <>
            <MainModal object={modal} content="Add Items">
                <div>This is the Add Item Modal</div>
                <Checkbox type={"items"} updateWindow={updateItems} onRequestClose={modal.closeModal} userValueState={userItems} add={true}/>
            </MainModal>
        </>
    )
}

function RemoveItem({ updateItems, userItems }) {
    const modal = new ParentModal()
    modal.modalStyle.top = "40%"

    return (
        <>
            <MainModal object={modal} content="Remove Items">
                <div>This is the Remove Item Modal</div>
                {userItems.length === 0 ? (
                        <div>No active items</div>
                    ) : (
                        <Checkbox type={"items"} updateWindow={updateItems} onRequestClose={modal.closeModal} userValueState={userItems} add={false}/>
                )}
                
            </MainModal>
        </>
    )
}

function SaveBill({ saveItems }) {
    const modal = new ParentModal(saveItems)
    modal.modalStyle.top = "50%"
    
    return (
        <>
            <MainModal object={modal} content="Save">
                <div>This is the Save Bill Modal</div>
                <div>Bill has been saved. Now Submit to begin calculation.</div>
            </MainModal>
        </>
    )
}

Modal.setAppElement("#root")

export { SignUp, LoginDiv, ChangePassword, AddBill, RemoveBill, AddItem, RemoveItem, SaveBill }