import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Button, Col } from 'react-bootstrap'
import { Formik } from "formik"
import * as yup from 'yup'

import { getCountries, getStatesInCountry, getCitiesInStates, getFirstState, getFirstCity } from 'utils/constants'

function SellPageStep3(props) {

    const [address, setAddress] = useState({'country': '', 'state': '', 'city': ''});

    useEffect(() => {
        setAddress({'country': props.product.country, 'state': props.product.state, 'city': props.product.city});
    }, [props.product]);

    const schema = yup.object().shape({
        address: yup.string().required("*Address is required"),
        phoneNumber: yup.string().required("*Phone number is required")
            .test("digits-only", "*Phone number can only contain digits", value => /^\d*$/.test(value))
            .max(16, "*Phone number can't be longer than 16 characters"),
        zipcode: yup.string().matches(/^[A-Z0-9]{1,10}[- ]{0,1}[A-Z0-9]{1,10}$/,  "*Zipcode can only contain digits, characters, a dash or a space")
            .max(10, "*Zipcode can't be longer than 10 characters")
    });
    
    const initialValues = {
        address: props.product.address,
        country: props.product.country,
        state: props.product.state,
        city: props.product.city,
        zipcode: props.product.zipcode,
        phoneNumber: props.product.phoneNumber,
        shippingCost: props.product.shippingCost ? ["on"] : []
    }

    const handleSubmit = item => {

        let product = props.product;

        product.address = item.address;
        product.city = address.city;
        product.state = address.state;
        product.country = address.country;
        product.zipcode = item.zipcode;
        product.phoneNumber = item.phoneNumber;
        product.shippingCost = item.shippingCost != null && item.shippingCost.length > 0;

        props.handleSubmit(product);
    }

    const countryChange = (event, handleChange) => {
        event.preventDefault();
        let newCountry = event.target.value;
        let newState = getFirstState(newCountry);
        let newCity = getFirstCity(newCountry, newState);
        setAddress({'country': newCountry, 'state': newState, 'city': newCity});
        handleChange(event);
    }

    const stateChange = (event, handleChange) => {
        event.preventDefault();
        let newCountry = address.country;
        let newState = event.target.value;
        let newCity = getFirstCity(newCountry, newState);
        setAddress({'country': newCountry, 'state': newState, 'city': newCity});
        handleChange(event);
    }

    const cityChange = (event, handleChange) => {
        event.preventDefault();
        let newCountry = address.country;
        let newState = address.state;
        let newCity = event.target.value;
        setAddress({'country': newCountry, 'state': newState, 'city': newCity});
        handleChange(event);

    }

    const handleBackButton = (item) => {
        let product = props.product;

        product.address = item.address;
        product.city = address.city;
        product.state = address.state;
        product.country = address.country;
        product.zipcode = item.zipcode;
        product.phoneNumber = item.phoneNumber;
        product.shippingCost = item.shippingCost != null && item.shippingCost.length > 0;

        props.handleBackButton(product);
    }

    return (
        <div className="stepFormContainer">
            <div className="formTitle"><p>LOCATION {"&"} SHIPPING</p></div>
            <Formik
                validationSchema={schema}
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {({
                    handleSubmit,
                    handleChange,
                    values,
                    touched,
                    errors,
                }) => (
                    <Form noValidate className="formBasic" onSubmit={handleSubmit}>

                        <Form.Group controlId="formBasicName">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" name="address" defaultValue={props.product.address} onChange={handleChange} isInvalid={touched.address && errors.address} />
                            <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Row className="formLocation">
                            <Form.Group as={Col} controlId="formBasicCountry">
                                <Form.Label>Country</Form.Label>
                                <Form.Control as="select" name="country" value={address.country} onChange={ event => countryChange(event, handleChange) } >
                                {getCountries().map((name, i) => <option>{name}</option>)}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formBasicState">
                                <Form.Label>State</Form.Label>
                                <Form.Control as="select" name="state" value={address.state} onChange={ event => stateChange(event, handleChange) } >
                                {getStatesInCountry(address.country).map((name, i) => <option>{name}</option>)}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control as="select" name="city" value={address.city} onChange={ event => cityChange(event, handleChange) } >
                                {getCitiesInStates(address.country, address.state).map((name, i) => {return <option>{name}</option>})}
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>

                        <Form.Group controlId="formZipcode">
                            <Form.Label>ZipCode</Form.Label>
                            <Form.Control type="text" name="zipcode" defaultValue={props.product.zipcode} onChange={handleChange} isInvalid={touched.zipcode && errors.zipcode} />
                            <Form.Control.Feedback type="invalid">{errors.zipcode}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formBasicPhoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="text" name="phoneNumber" defaultValue={props.product.phoneNumber} onChange={handleChange} isInvalid={touched.phoneNumber && errors.phoneNumber} />
                            <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Check label="Do you want to bear shipping cost?" type='checkbox' id='shipping' name="shippingCost" defaultChecked={props.product.shippingCost} onChange={handleChange}/>
                        <p className="shippingDesc">The average priece of shipping cost is $10.00.<br/>You have to provide us payment infromations.</p>
                    
                        <Form.Group>
                            <div className="buttons">
                                <div className="backButton"><Button variant="primary" onClick={() => handleBackButton(values)}>BACK <i className="bi bi-chevron-left"></i></Button></div>
                                <div className="nextButton"><Button variant="primary" type="submit">DONE <i className="bi bi-chevron-right"></i></Button></div>
                            </div>
                        </Form.Group>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default withRouter(SellPageStep3);
