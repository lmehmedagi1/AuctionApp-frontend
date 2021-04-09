import React, { useState, useEffect } from 'react'
import { Form, Col, Row } from 'react-bootstrap'
import { Formik } from "formik"
import * as yup from 'yup'
import { getUser } from '../api/auth'

import { getMonthNames, getDaysInAMonth } from '../utils/converters'
import { imagePlaceholder } from '../utils/constants'

import Mastercard from '../assets/images/mastercard.jpg'
import Maestro from '../assets/images/maestro.jpg'
import AmericanExpress from '../assets/images/americanexpress.png'
import Visa from '../assets/images/visa.jpg'


const schema = yup.object().shape({
    email: yup.string().email("*Email must be valid").required("*Email is required"),
    password: yup.string().required("*Password is required")
});

const initialValues = {
    email: "",
    password: ""
}

function UserProfile(props) {

    const handleSubmit = user => {
        // To do: submitting a form
    }

    const handleSaveInfo = () => {
        
    }

    return (
        <div className="userProfileContainer">
            <div className="profileCard">
                <div className="title"><p>REQUIRED</p></div>
                <div className="accountInfo">
                    <div className="image">
                        <div>
                            <img src={imagePlaceholder} alt="Profile image"/>
                            <button>CHANGE PHOTO</button>
                        </div>
                    </div>
                    <div className="profileForm">
                    <Formik
                        validationSchema={schema}
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                    >
                        {({ handleSubmit, handleChange, touched, errors }) => (
                            <Form noValidate className="formBasic" onSubmit={handleSubmit}>
                                <Form.Group controlId="formBasicFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control type="text" name="firstName" defaultValue={getUser().firstName} onChange={handleChange} isInvalid={touched.firstName && errors.firstName} />
                                    <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="formBasicLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type="text" name="lastName" defaultValue={getUser().lastName} onChange={handleChange} isInvalid={touched.lastName && errors.lastName} />
                                    <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="formBasicGender">
                                    <Form.Label>I am</Form.Label>
                                    <Form.Control as="select" defaultValue={getUser().gender}>
                                    <option>Male</option>
                                    <option>Female</option>
                                    </Form.Control>
                                </Form.Group>
                                
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridMonth">
                                    <Form.Control as="select" defaultValue="January">
                                    {getMonthNames().map((name, i) => {return <option>{name}</option>})}
                                    </Form.Control>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridDay">
                                    <Form.Control as="select" defaultValue="12">
                                    {getDaysInAMonth(3).map((day, i) => {return <option>{day+1}</option>})}
                                    </Form.Control>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridYear">
                                    <Form.Control as="select" defaultValue="2021">
                                    {[...Array(70).keys()].map((year, i) => {return <option>{new Date().getFullYear()-year}</option>})}
                                    </Form.Control>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Group controlId="formBasicPhoneNumber">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control type="text" name="phoneNumber" defaultValue={getUser().phoneNumber} onChange={handleChange} isInvalid={touched.phoneNumber && errors.phoneNumber} />
                                    <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Enter Email</Form.Label>
                                    <Form.Control type="email" name="email" defaultValue={getUser().email} onChange={handleChange} isInvalid={touched.email && errors.email} />
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                </Form.Group>
                            </Form>
                        )}
                    </Formik>
                    </div>
                </div>
            </div>



            <div className="profileCard">
                <div className="title"><p>CARD INFORMATION</p></div>
                <div className="cardInfo">
                    <Formik
                        validationSchema={schema}
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                    >
                        {({ handleSubmit, handleChange, touched, errors }) => (
                            <Form noValidate className="formBasic" onSubmit={handleSubmit}>

                                <Form.Check label="Pay Pal" type='checkbox' id='paypal' defaultChecked={getUser().email.includes("email")} onChange={handleChange}/>
                                <Form.Check label="Credit Card" type='checkbox' id='creditcard' defaultChecked={getUser().email.includes("push")} onChange={handleChange}/>
                                
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
                                    <Form.Group as={Col} controlId="formGridName">
                                    <Form.Label>Name on card</Form.Label>
                                    <Form.Control type="text" name="nameOnCard" defaultValue={getUser().firstName} onChange={handleChange} isInvalid={touched.nameOnCard && errors.nameOnCard} />
                                    <Form.Control.Feedback type="invalid">{errors.nameOnCard}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridCardNumber">
                                    <Form.Label>Card Number</Form.Label>
                                    <Form.Control type="text" name="cardNumber" defaultValue={getUser().firstName} onChange={handleChange} isInvalid={touched.cardNumber && errors.cardNumber} />
                                    <Form.Control.Feedback type="invalid">{errors.cardNumber}</Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                
                                <Form.Row>

                                    <Form.Group as={Col} controlId="formGridYear">
                                        <Form.Group as={Row} controlId="formGridYear">
                                        
                                            <Form.Group as={Col} controlId="formGridYear">
                                            <Form.Label>Expiration Date</Form.Label>
                                            <Form.Control as="select" defaultValue="2021">
                                            {[...Array(40).keys()].map((year, i) => {return <option>{new Date().getFullYear()+year}</option>})}
                                            </Form.Control>
                                            </Form.Group>

                                            <Form.Group as={Col} controlId="formGridYear">
                                            <Form.Label><br/></Form.Label>
                                            <Form.Control as="select" defaultValue="January">
                                            {getMonthNames().map((name, i) => {return <option>{name}</option>})}
                                            </Form.Control>
                                            </Form.Group>

                                        </Form.Group>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridMonth">
                                    <Form.Label>CVC/CW</Form.Label>
                                    <Form.Control type="number" name="cvc" defaultValue={getUser().phoneNumber} onChange={handleChange} isInvalid={touched.cvc && errors.cvc} />
                                    <Form.Control.Feedback type="invalid">{errors.cvc}</Form.Control.Feedback>
                                    </Form.Group>

                                </Form.Row>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>



            <div className="profileCard">
                <div className="title"><p>OPTIONAL</p></div>
                <div className="optionalInfo">
                    <Formik
                        validationSchema={schema}
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                    >
                        {({ handleSubmit, handleChange, touched, errors }) => (
                            <Form noValidate className="formBasic" onSubmit={handleSubmit}>

                                <div>
                                    <p>Address</p>
                                </div>

                                <Form.Group controlId="formBasicStreet">
                                    <Form.Label>Street</Form.Label>
                                    <Form.Control type="text" name="street" defaultValue={getUser().street} onChange={handleChange} isInvalid={touched.street && errors.street} />
                                    <Form.Control.Feedback type="invalid">{errors.street}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridName">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control type="city" name="nameOnCard" defaultValue={getUser().city} onChange={handleChange} isInvalid={touched.city && errors.city} />
                                    <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridCardNumber">
                                    <Form.Label>ZipCode</Form.Label>
                                    <Form.Control type="text" name="zipcode" defaultValue={getUser().zipcode} onChange={handleChange} isInvalid={touched.zipcode && errors.zipcode} />
                                    <Form.Control.Feedback type="invalid">{errors.zipcode}</Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Group controlId="formBasicStreet">
                                    <Form.Label>State</Form.Label>
                                    <Form.Control type="text" name="state" defaultValue={getUser().state} onChange={handleChange} isInvalid={touched.state && errors.state} />
                                    <Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="formBasicStreet">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control type="country" name="state" defaultValue={getUser().country} onChange={handleChange} isInvalid={touched.country && errors.country} />
                                    <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
                                </Form.Group>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        
            <div><button onClick={handleSaveInfo}>SAVE INFO <i className="bi bi-chevron-right"></i></button></div>
        </div>
    )
}

export default UserProfile;
