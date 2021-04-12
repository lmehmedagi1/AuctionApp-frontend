import React, { useState, useEffect } from 'react'
import { Form, Col, Row, Button } from 'react-bootstrap'
import { Formik } from "formik"
import * as yup from 'yup'
import auth, { getUser } from '../api/auth'

import { handleAlerts } from '../utils/handlers'
import { getMonthNames, getDaysInAMonth, getMonthName, getMonthFromName } from '../utils/converters'
import { imagePlaceholder, getCountries, getStatesInCountry, getCitiesInStates, getFirstState, getFirstCity } from '../utils/constants'

import Mastercard from '../assets/images/mastercard.jpg'
import Maestro from '../assets/images/maestro.jpg'
import AmericanExpress from '../assets/images/americanexpress.png'
import Visa from '../assets/images/visa.jpg'

const schema = yup.object().shape({
    email: yup.string().email("*Email must be valid").required("*Email is required"),
    firstName: yup.string().required("*First name is required")
        .matches(/^[^\p{P}\p{S}\s\d]*$/u,  "*First name can't contain special characters, numbers or whitespaces"),
    lastName: yup.string().required("*Last name is required")
        .matches(/^[^\p{P}\p{S}\s\d]*$/u,  "*Last name can't contain special characters, numbers or and whitespaces"),
    phoneNumber: yup.string().required("*Phone number is required")
        .test("digits-only", "*Phone number can only contain digits", value => /^\d*$/.test(value))
        .max(16, "*Phone number can't be longer than 16 characters"),
    cvc: yup.string().matches(/^([0-9][0-9][0-9])$/,  "*CVC must be three digits long"),
    zipcode: yup.string().matches(/^[A-Z0-9]{1,10}[- ]{0,1}[A-Z0-9]{1,10}$/,  "*Zipcode can only contain digits, characters, a dash or a space")
        .max(10, "*Zipcode can't be longer than 10 characters")
}); 

function UserProfile(props) {

    const [address, setAddress] = useState({'country': getUser().country, 'state': getUser().state, 'city': getUser().city});
    const [birthDate, setBirthDate] = useState({'day': new Date().getDate(), 'month': new Date().getMonth() + 1, 'year': new Date().getFullYear()});

    useEffect(() => {

        if (getUser() == null) {
            props.history.push({
                pathname: '/login'
            });
        }
        if (getUser().birthDate) 
            setBirthDate({'day': getUser().birthDate.split('-')[2], 'month': getUser().birthDate.split('-')[1], 'year': getUser().birthDate.split('-')[0]});
    }, []);

    const handleSubmit = user => {
        console.log("submit");

        let updatedInfo = {};

        if (birthDate.month < 10) birthDate.month = '0' + birthDate.month;
        if (birthDate.day < 10) birthDate.day = '0' + birthDate.day;

        updatedInfo.firstName = user.firstName ? user.firstName : getUser().firstName;
        updatedInfo.lastName = user.lastName ? user.lastName : getUser().lastName;
        updatedInfo.gender = user.gender ? user.gender : getUser().gender;
        updatedInfo.birthDate = birthDate.year + '-' + birthDate.month + '-' + birthDate.day;
        updatedInfo.phoneNumber = user.phoneNumber ? user.phoneNumber : getUser().phoneNumber;
        updatedInfo.email = user.email ? user.email : getUser().email;

        updatedInfo.nameOnCard = user.nameOnCard ? user.nameOnCard : getUser().nameOnCard;
        updatedInfo.cardNumber = user.cardNumber ? user.cardNumber : getUser().cardNumber;
        updatedInfo.expYear = user.expYear ? user.expYear : getUser().cardExpirationYear;
        updatedInfo.expMonth = user.expMonth ? user.expMonth : getUser().cardExpirationMonth;
        updatedInfo.cvc = user.cvc ? user.cvc : getUser().cvc;
        
        updatedInfo.street = user.street ? user.street : getUser().street;
        updatedInfo.zipcode = user.zipcode ? user.zipcode : getUser().zipcode;
        updatedInfo.city = address.city;
        updatedInfo.state = address.state;
        updatedInfo.country = address.country;

        props.setLoading(true);

        auth.updateUserInfo((message, variant, data) => {
            handleAlerts(props.setShow, props.setMessage, props.setVariant, props.setToken, message, variant, data);
            props.setLoading(false);
        }, props.getToken(), props.setToken, updatedInfo);
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

    const yearChange = (event, handleChange) => {
        event.preventDefault();
        let newYear = event.target.value;
        let newMonth = birthDate.month;
        let newDay = birthDate.day;

        if (newDay > getDaysInAMonth(newYear, newMonth).length) newDay = 1;

        setBirthDate({'day': newDay, 'month': newMonth, 'year': newYear});
        handleChange(event);
    }

    const monthChange = (event, handleChange) => {
        event.preventDefault();
        let newYear = birthDate.year;
        let newMonth = getMonthFromName(event.target.value);
        let newDay = birthDate.day;

        if (newDay > getDaysInAMonth(newYear, newMonth).length) newDay = 1;

        setBirthDate({'day': newDay, 'month': newMonth, 'year': newYear});
        handleChange(event);
    }

    const dayChange = (event, handleChange) => {
        let newYear = birthDate.year;
        let newMonth = birthDate.month;
        let newDay = event.target.value;
        setBirthDate({'day': newDay, 'month': newMonth, 'year': newYear});
        handleChange(event);
    }

    const getInitialValues = () => {
        return {
            firstName: getUser().firstName,
            lastName: getUser().lastName,
            gender: getUser().gender,
            year: getUser().lastName,
            month: getUser().lastName,
            day: getUser().lastName,
            phoneNumber: getUser().phoneNumber ? getUser().phoneNumber : '',
            email: getUser().email,

            nameOnCard: getUser().nameOnCard,
            cardNumber: getUser().cardNumber,
            expYear: getUser().expYear,
            expMonth: getUser().expMonth,
            cvc: getUser().cvc ? getUser().cvc : '',

            street: getUser().street,
            zipcode: getUser().zipcode ? getUser().zipcode : '',
            city: getUser().city,
            state: getUser().state,
            country: getUser().country
        }
    }

    return (
        <div className="userProfileContainer">

            <Formik
                validationSchema={schema}
                initialValues={getInitialValues()}
                onSubmit={handleSubmit}
                enableReinitialize
            >
            {({ handleSubmit, handleChange, touched, errors }) => (
            <Form noValidate className="formBasic" onSubmit={handleSubmit}>

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
                            <Form.Control as="select" name="gender" onChange={handleChange} defaultValue={getUser().gender}>
                            <option>Male</option>
                            <option>Female</option>
                            </Form.Control>
                        </Form.Group>
                        
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formMonth">
                            <Form.Control as="select" name="month" defaultValue={getMonthName(birthDate.month)} onChange={ event => monthChange(event, handleChange) } >
                            {getMonthNames().map((name, i) => {return <option>{name}</option>})}
                            </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formDay">
                            <Form.Control as="select" name="day" defaultValue={parseInt(birthDate.day)} onChange={ event => dayChange(event, handleChange) } >
                            {getDaysInAMonth(birthDate.year, birthDate.month).map((day, i) => {return <option>{day+1}</option>})}
                            </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formYear">
                            <Form.Control as="select" name="year" defaultValue={parseInt(birthDate.year)} onChange={ event => yearChange(event, handleChange) } >
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
                    </div>
                </div>
            </div>



            <div className="profileCard">
                <div className="title"><p>CARD INFORMATION</p></div>
                <div className="cardInfo">

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
                <div className="title"><p>OPTIONAL</p></div>
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
                        <Form.Control as="select" name="city" defaultValue={address.city} onChange={ event => cityChange(event, handleChange) } >
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
                        <Form.Control as="select" name="state" defaultValue={address.state} onChange={ event => stateChange(event, handleChange) } >
                        {getStatesInCountry(address.country).map((name, i) => <option>{name}</option>)}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formBasicCountry">
                        <Form.Label>Country</Form.Label>
                        <Form.Control as="select" name="country" defaultValue={address.country} onChange={ event => countryChange(event, handleChange) } >
                        {getCountries().map((name, i) => <option>{name}</option>)}
                        </Form.Control>
                    </Form.Group>
                        
                </div>
            </div>

            <Form.Group controlId="formBasicButton">
                <Button variant="primary" type="submit">
                SAVE INFO <i className="bi bi-chevron-right"></i>
                </Button>
            </Form.Group>
        
            </Form>
            )}
            </Formik>
        </div>
    )
}

export default UserProfile;
