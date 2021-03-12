import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { loginUrl } from '../utils/url'
import { handleAlerts } from '../utils/handlers'
import { Formik } from "formik"
import * as yup from 'yup'
import auth from "../api/auth"

import Breadcrumb from '../common/Breadcrumbs'
import Menu from '../common/Menu'
import Alert from '../common/Alert'

const schema = yup.object().shape({
    firstName: yup.string().required("*First name is required"),
    lastName: yup.string().required("*Last name is required"),
    email: yup.string().email("*Email must be valid").required("*Email is required"),
    password: yup.string().required("*Password is required")
});

const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: ""
}

function Register(props) {

    const [show, setShow] = useState(false);
    const [message, setMessage]=useState("");
    const [variant, setVariant]=useState("");

    const handleSubmit = user => {
        auth.register((message, variant, token) => {
            handleAlerts(setShow, setMessage, setVariant, props.setToken, message, variant, token);
        }, user);
    }

    return (
        <div>
            <Menu />
            <Breadcrumb />
            <Alert message={message} showAlert={show} variant={variant} onShowChange={setShow} />
            <div className="formContainer">
                <div>
                    <div className="formTitle">
                        REGISTER
                    </div>
                    <Formik
                        validationSchema={schema}
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            touched,
                            errors,
                        }) => (
                            <Form noValidate className="formBasic" onSubmit={handleSubmit}>
                                <Form.Group controlId="formBasicFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control type="text" name="firstName" onChange={handleChange} isInvalid={touched.firstName && errors.firstName} />
                                    <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="formBasicLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type="text" name="lastName" onChange={handleChange} isInvalid={touched.lastName && errors.lastName} />
                                    <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Enter Email</Form.Label>
                                    <Form.Control type="email" name="email" onChange={handleChange} isInvalid={touched.email && errors.email} />
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" name="password" onChange={handleChange} isInvalid={touched.password && errors.password} />
                                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Button id="registerButton" variant="primary" type="submit">
                                        REGISTER
                                    </Button>
                                </Form.Group>
                                <Form.Group>
                                    <p>Already have an account? <span> </span>
                                        <Link className="formLink" to={loginUrl}>
                                            Login
                                        </Link>
                                    </p>
                                </Form.Group>

                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default Register;
