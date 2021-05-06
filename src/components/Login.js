import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { Formik } from "formik"
import * as yup from 'yup'
import auth, { getUser } from "api/auth"
import { handleAlerts } from 'utils/handlers'
import ScrollButton from 'utils/ScrollButton'

import Breadcrumb from 'common/Breadcrumbs'
import Menu from 'common/Menu'
import Alert from 'common/Alert'

const schema = yup.object().shape({
    email: yup.string().email("*Email must be valid").required("*Email is required"),
    password: yup.string().required("*Password is required").matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@\[\]^_`{|}~])(?=\S+$).{8,}$/, "*Password must be at least 8 characters long. There must be at least one digit, one lowercase and one uppercase letter, one special character and no whitespaces!")
});

const initialValues = {
    email: "",
    password: ""
}

function Login(props) {

    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [variant, setVariant] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (getUser() != null) {
            props.history.push({
                pathname: '/'
            });
        }
    }, []);

    const handleSubmit = user => {
        setLoading(true);
        auth.login((message, variant, token) => {
            handleAlerts(setShow, setMessage, setVariant, props.setToken, message, variant, token);
            setLoading(false);
            ScrollButton.scrollToTop();
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

    const handleForgotPasswordCLick = () => {
        props.history.push({
            pathname: '/reset_password'
        });
    }

    return (
        <div className={loading ? "blockedWait" : ""}>
        <div className={loading ? "blocked" : ""}>
            <Menu handleSearchChange={handleSearchChange} {...props}/>
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
                                <div className="forgotPassword" onClick={handleForgotPasswordCLick}>Forgot Password?</div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
        </div>
    )
}

export default withRouter(Login);
