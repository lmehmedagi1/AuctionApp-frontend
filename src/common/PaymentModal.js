import React, { useEffect, useState } from 'react'
import { Form, Col, Row, Button, Modal } from 'react-bootstrap'
import { Formik } from "formik"
import * as yup from 'yup'
import { getUser } from 'api/auth'
import payments from 'api/payments'

import { getMonthNames, getMonthName, getMonthFromName } from 'utils/converters'
import { getCountries, getStatesInCountry, getCitiesInStates, getFirstState, getFirstCity } from 'utils/constants'

import Mastercard from 'assets/images/mastercard.jpg'
import Maestro from 'assets/images/maestro.jpg'
import AmericanExpress from 'assets/images/americanexpress.png'
import Visa from 'assets/images/visa.jpg'

const schema = yup.object().shape({
    nameOnCard: yup.string().required("*Name on card is required"),
    cardNumber: yup.string().required("*Card number is required").matches(/^[0-9]*$/,  "*Card number must only contain digits"),
    cvc: yup.string().required("*Cvc is required").matches(/^([0-9][0-9][0-9])$/,  "*CVC must be three digits long"),
    street: yup.string().required("*Street is required"),
    zipcode: yup.string().required("*Zipcode is required")
        .matches(/^[A-Z0-9]{1,10}[- ]{0,1}[A-Z0-9]{1,10}$/,  "*Zipcode can only contain digits, characters, a dash or a space")
        .max(10, "*Zipcode can't be longer than 10 characters")
}); 

function PaymentModal(props) {

    const [address, setAddress] = useState({'country': '', 'state': '', 'city': ''});
    const [errorMessage, setErrorMessage] = useState("");
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if (getUser() != null)
            setAddress({'country': getUser().country, 'state': getUser().state, 'city': getUser().city});
    }, []);

    const getInitialValues = () => {

        return {
            nameOnCard: getUser() && getUser().nameOnCard ? getUser().nameOnCard : '',
            cardNumber: getUser() && getUser().cardNumber ? getUser().cardNumber : '',
            expYear: getUser() && getUser().expYear ? getUser().expYear : '',
            expMonth: getUser() && getUser().expMonth ? getUser().expMonth : '',
            cvc: getUser() && getUser().cvc ? getUser().cvc : '',

            street: getUser() && getUser().street ? getUser().street : '',
            zipcode: getUser() && getUser().zipcode ? getUser().zipcode : '',
            city: getUser() ? getUser().city : '',
            state: getUser() ? getUser().state : '',
            country: getUser() ? getUser().country : ''
        }
    }

    const handleSubmit = (information) => {

        setErrorMessage("");

        let parameters = {}
        parameters.nameOnCard = information.nameOnCard ? information.nameOnCard : getUser().nameOnCard;
        parameters.cardNumber = information.cardNumber ? information.cardNumber : getUser().cardNumber;
        parameters.cardExpirationYear = information.expYear ? information.expYear : getUser().cardExpirationYear;
        parameters.cardExpirationMonth = information.expMonth ? getMonthFromName(information.expMonth) : getUser().cardExpirationMonth;
        parameters.cvc = information.cvc ? information.cvc : getUser().cvc;

        parameters.street = information.street ? information.street : getUser().street;
        parameters.zipcode = information.zipcode ? information.zipcode : getUser().zipcode;
        parameters.city = address.city;
        parameters.state = address.state;
        parameters.country = address.country;

        parameters.productId = props.productId;

        if (parameters.cardExpirationYear == null) parameters.cardExpirationYear = new Date().getFullYear();
        if (parameters.cardExpirationMonth == null) parameters.cardExpirationMonth = 1;

        setDisabled(true);

        payments.payForProduct((message, variant, data) => {
            setDisabled(false);

            if (message != null && variant == "success") {
                props.handlePay();
                return;
            }
            setErrorMessage(message);
        }, parameters, props.getToken(), props.setToken);
    }

    const locationChange = (event, handleChange, country, state, city) => {
        event.preventDefault();
        setAddress({'country': country, 'state': state, 'city': city});
        handleChange(event);
    }

    const countryChange = (event, handleChange) => {
        let newCountry = event.target.value;
        let newState = getFirstState(newCountry);
        let newCity = getFirstCity(newCountry, newState);
        locationChange(event, handleChange, newCountry, newState, newCity);
    }

    const stateChange = (event, handleChange) => {
        locationChange(event, handleChange, address.country, event.target.value, getFirstCity(address.country, event.target.value));
    }

    const cityChange = (event, handleChange) => {
        locationChange(event, handleChange, address.country, address.state, event.target.value);
    }

    return (
        <div className="paymentModalContainer">
        <Modal
            show={props.showModal}
            onHide={props.handleClosePaymentModal}
            backdrop="static"
            keyboard={false}
            className="paymentModalContainer"
        >
            <Modal.Header closeButton>
            <Modal.Title>PAYMENT</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="paymentForm cardInfo">
                <Formik
                    validationSchema={schema}
                    initialValues={getInitialValues()}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {( {handleSubmit, handleChange, touched, errors }) => (
                        <Form noValidate className="formBasic" onSubmit={handleSubmit}>
                            <div className="profileCard">
                                <div className="title"><p>CARD INFORMATION</p></div>
                                <div className="cardInfo">

                                    <div className="acceptedCards">
                                        <p>We accept the following credit cards</p>
                                        <div className="cardImages">
                                            <div><img src={Visa} alt="Visa"/></div>
                                            <div><img src={Mastercard} alt="Mastercard"/></div>
                                            <div><img src={Maestro} alt="Maestro"/></div>
                                            <div><img src={AmericanExpress} alt="American express"/></div>
                                        </div>
                                    </div>

                                    <Form.Row>
                                        <Form.Group as={Col} controlId="formGridCardName">
                                        <Form.Label>Name on card</Form.Label>
                                        <Form.Control type="text" name="nameOnCard" defaultValue={getUser().nameOnCard} onChange={handleChange} isInvalid={touched.nameOnCard && errors.nameOnCard} />
                                        <Form.Control.Feedback type="invalid">{errors.nameOnCard}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridCardNumber">
                                        <Form.Label>Card Number</Form.Label>
                                        <Form.Control type="text" name="cardNumber" defaultValue={getUser().cardNumber} onChange={handleChange} isInvalid={touched.cardNumber && errors.cardNumber} />
                                        <Form.Control.Feedback type="invalid">{errors.cardNumber}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Form.Row>
                                    
                                    <Form.Row>

                                        <Form.Group as={Col} controlId="formGridYearMonthCol">
                                            <Form.Group as={Row} controlId="formGridYearMonth">
                                            
                                                <Form.Group as={Col} controlId="formGridYear">
                                                <Form.Label>Expiration Date</Form.Label>
                                                <Form.Control name="expYear" as="select" defaultValue={getUser().cardExpirationYear} onChange={handleChange}>
                                                {[...Array(40).keys()].map((year, i) => {return <option>{new Date().getFullYear()+year}</option>})}
                                                </Form.Control>
                                                </Form.Group>

                                                <Form.Group as={Col} controlId="formGridMonth">
                                                <Form.Label><br/></Form.Label>
                                                <Form.Control name="expMonth"  as="select" defaultValue={getMonthName(getUser().cardExpirationMonth)} onChange={handleChange}>
                                                {getMonthNames().map((name, i) => {return <option>{name}</option>})}
                                                </Form.Control>
                                                </Form.Group>

                                            </Form.Group>
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formCVC">
                                        <Form.Label>CVC/CW</Form.Label>
                                        <Form.Control type="text" name="cvc" defaultValue={getUser().cvc} onChange={handleChange} isInvalid={touched.cvc && errors.cvc} />
                                        <Form.Control.Feedback type="invalid">{errors.cvc}</Form.Control.Feedback>
                                        </Form.Group>

                                    </Form.Row>
                                </div>
                            </div>

                            <div className="profileCard">
                                <div className="title"><p>SHIPPING INFORMATION</p></div>
                                <div className="optionalInfo">

                                    <div>
                                        <p>Address</p>
                                    </div>

                                    <Form.Group controlId="formStreet">
                                        <Form.Label>Street</Form.Label>
                                        <Form.Control type="text" name="street" defaultValue={getUser().street} onChange={handleChange} isInvalid={touched.street && errors.street} />
                                        <Form.Control.Feedback type="invalid">{errors.street}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Row>
                                        <Form.Group as={Col} controlId="formCity">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control as="select" name="city" value={address.city} onChange={ event => cityChange(event, handleChange) } >
                                        {getCitiesInStates(address.country, address.state).map((name, i) => {return <option>{name}</option>})}
                                        </Form.Control>
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formZipcode">
                                        <Form.Label>ZipCode</Form.Label>
                                        <Form.Control type="text" name="zipcode" defaultValue={getUser().zipcode} onChange={handleChange} isInvalid={touched.zipcode && errors.zipcode} />
                                        <Form.Control.Feedback type="invalid">{errors.zipcode}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Group controlId="formBasicState">
                                        <Form.Label>State</Form.Label>
                                        <Form.Control as="select" name="state" value={address.state} onChange={ event => stateChange(event, handleChange) } >
                                        {getStatesInCountry(address.country).map((name, i) => <option>{name}</option>)}
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicCountry">
                                        <Form.Label>Country</Form.Label>
                                        <Form.Control as="select" name="country" value={address.country} onChange={ event => countryChange(event, handleChange) } >
                                        {getCountries().map((name, i) => <option>{name}</option>)}
                                        </Form.Control>
                                    </Form.Group>
                                        
                                </div>
                            </div>

                            <div className="paymentInfo">By pressing the Pay button you will be charged <span>${props.price}</span>.</div>
                            <div className="paymentInfo paymentError">{errorMessage}</div>

                            <Form.Group className="submitButtonWrapper">
                                <Button variant="primary" type="submit" disabled={disabled}>
                                    PAY
                                </Button>
                            </Form.Group>
                        </Form>
                    )}
                </Formik>
            </div>
            </Modal.Body>
        </Modal>
        </div>
    )
}

export default PaymentModal;


