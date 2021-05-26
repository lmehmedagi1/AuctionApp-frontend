import React from 'react'
import { Button, Modal } from 'react-bootstrap'

function PaymentModal(props) {

    const printLocation = location => {
        if (location == null) return "Unknown";
        
        let locationString = "";
        if (location.city) locationString += location.city;
        locationString += ", " + location.state + ", " + location.country;

        return locationString;
    }

    const printDate = date => {
        return new Date(date).toString();
    }

    return (
        <div className="receiptModalContainer">
        <Modal
            show={props.showModal}
            onHide={props.handleCloseReceiptModal}
            backdrop="static"
            className="receiptModalContainer"
        >
            <Modal.Header closeButton>
            <Modal.Title>RECEIPT</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div>
                <p><span>Transaction ID:</span> {props.receipt && props.receipt && props.receipt.price ? props.receipt.chargeId: ''}</p>
                <p><span>Date:</span> {props.receipt && props.receipt && props.receipt.price ? printDate(props.receipt.time) : ''}</p>

                <div className="divider">Seller information</div>
                <p><span>First name:</span> {props.receipt && props.receipt.price ? props.receipt.seller.firstName : ''}</p>
                <p><span>Last name:</span> {props.receipt && props.receipt.price ? props.receipt.seller.lastName : ''}</p>
                <p><span>Address:</span> {printLocation(props.receipt && props.receipt.price ? props.receipt.seller.location : null)}</p>

                <div className="divider">Buyer information</div>
                <p><span>First name:</span> {props.receipt && props.receipt.price ? props.receipt.buyer.firstName : ''}</p>
                <p><span>Last name:</span> {props.receipt && props.receipt.price ? props.receipt.buyer.lastName : ''}</p>
                <p><span>Shipping address:</span> {printLocation(props.receipt && props.receipt.price ? props.receipt.location : null)}</p>

                <div className="productInformation">
                <p><span>Product:</span> {props.receipt && props.receipt.price ? props.receipt.productName : ''}</p>
                <p><span>Total:</span> ${props.receipt && props.receipt.price ? props.receipt.price : ''}</p>
                </div>
            </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={props.handleCloseReceiptModal}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
        </div>
    )
}

export default PaymentModal;


