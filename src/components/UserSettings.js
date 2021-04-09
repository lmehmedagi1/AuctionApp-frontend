import React, { useState } from 'react'
import { Form, Button, Modal } from 'react-bootstrap'
import auth, { getUser } from '../api/auth'

import { handleAlerts } from '../utils/handlers'

function UserSettings(props) {

    const [initialChecked, setInitialChecked] = useState(["email", "push"]);
    const [checked, setChecked] = useState(["email", "push"]);

    const [showModal, setShowModal] = useState(false);

    const checkboxChange = (e) => {
        let currValues = checked;
        if (currValues.includes(e.target.id))
            currValues = currValues.filter(v => v !== e.target.id);
        else
            currValues.push(e);
        
        setChecked(currValues);
    }

    const handleCloseModal = (e) => {
        setShowModal(false);
    }

    const handleDeactivate = (e) => {
        setShowModal(false);
        auth.deactivateAccount((message, variant, data) => {
            handleAlerts(props.setShow, props.setMessage, props.setVariant, null, message, variant, data);
        }, props.getToken(), props.setToken);
    }

    return (
        <div className="userSettingsContainer">
            <div className="settingsCard">
                <div className="header">
                <p>Policy and Community</p>
                </div>
                <div className="body">
                    <p>Recieve updates on bids and seller's offers. <br/>Stay informed through:</p>
                    <Form>
                        <Form.Check label="Email" type='checkbox' id='email' defaultChecked={initialChecked.includes("email")}  onClick={checkboxChange}/>
                        <Form.Check label="Push notification" type='checkbox' id='push' defaultChecked={initialChecked.includes("push")} onChange={checkboxChange}/>
                        <Form.Check label="Text messages" type='checkbox'  id='text' defaultChecked={initialChecked.includes("text")} onChange={checkboxChange}/>
                    </Form>
                </div>
            </div>
            <div className="settingsCard">
                <div className="header">
                <p>Contact Information</p>
                </div>
                <div className="body">
                    <p>This information can be edited on your profile.</p>
                    <p>Email: <span>{getUser().email}</span> </p>
                    <p>Phone: <span>{getUser().phoneNumber}</span></p>
                </div>
            </div>
            <div className="settingsCard">
                <div className="header">
                <p>Account</p>
                </div>
                <div className="body">
                    <p>Do you want to deactivate your account?</p>
                    <button onClick={() => {setShowModal(true)}}>DEACTIVATE</button>
                </div>
            </div>

            <Modal
                show={showModal}
                onHide={handleCloseModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                <Modal.Title>Account deactivation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                Are you sure you want to deactivate your account? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleDeactivate}>Deactivate</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default UserSettings;
