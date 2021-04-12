import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { Formik } from "formik"
import * as yup from 'yup'
import auth from "api/auth"
import { handleAlerts } from 'utils/handlers'

import Breadcrumb from 'common/Breadcrumbs'
import Menu from 'common/Menu'
import Alert from 'common/Alert'

const schema = yup.object().shape({
    email: yup.string().email("*Email must be valid").required("*Email is required"),
    password: yup.string().required("*Password is required")
});

const initialValues = {
    email: "",
    password: ""
}

function Login(props) {

    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [variant, setVariant] = useState("");

    const handleSubmit = user => {
        auth.login((message, variant, token) => {
            handleAlerts(setShow, setMessage, setVariant, props.setToken, message, variant, token);
            if (token != null)
                props.history.push({
                    pathname: '/'
                });
        }, user);
    }

    const handleSearchChange = search => {
        props.history.push({
            pathname: '/shop',
            state: { search: search }
        });
    }

    return (
        <div>
            <Menu handleSearchChange={handleSearchChange}/>
            <Breadcrumb />
            <Alert message={message} showAlert={show} variant={variant} onShowChange={setShow} />
            <div className="formContainer">
                <div>
                    <div className="formTitle">
                        LOGIN
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
                                <Form.Group controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" label="Remember me" />
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary" type="submit">
                                        LOGIN
                                    </Button>
                                </Form.Group>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Login);
