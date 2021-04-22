import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { Formik } from "formik"
import * as yup from 'yup'
import auth, { getUser } from "api/auth"
import { handleAlerts } from 'utils/handlers'
import ScrollButton from 'utils/ScrollButton'

import Menu from 'common/Menu'
import Alert from 'common/Alert'

function equalTo(ref, msg) {
	return this.test({
		name: 'equalTo',
		exclusive: false,
    message: msg || '${path} must be the same as ${reference}',
		params: {
			reference: ref.path
		},
		test: function(value) {
      return value === this.resolve(ref) 
		}
	})
};

yup.addMethod(yup.string, 'equalTo', equalTo);

const schemaEmail = yup.object().shape({
    email: yup.string().email("*Email must be valid").required("*Email is required")
});

const schemaPassword = yup.object().shape({
    password: yup.string().required("*Password is required").matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@\[\]^_`{|}~])(?=\S+$).{8,}$/, "*Password must be at least 8 characters long. There must be at least one digit, one lowercase and one uppercase letter, one special character and no whitespaces!"),
    confirmPassword: yup.string().equalTo(yup.ref('password'))
});

function PasswordReset(props) {

    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [variant, setVariant] = useState("");

    const [token, setToken] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (getUser() != null) {
            props.history.push({
                pathname: '/'
            });
            return;
        }

        var queryDict = {}
        window.location.search.substr(1).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]})
        if (queryDict["token"]) 
            setToken(queryDict["token"]);

    }, []);

    const handleSubmitEmail = user => {
        setLoading(true);
        auth.sendResetPasswordEmail((message, variant, token) => {
            setLoading(false);
            ScrollButton.scrollToTop();
            handleAlerts(setShow, setMessage, setVariant, null, message, variant, null);
        }, user);
    }

    const handleSubmitPassword = user => {
        setLoading(true);
        user.token = token;
        auth.resetPassword((message, variant, token) => {
            setLoading(false);
            ScrollButton.scrollToTop();
            if (token != null)
                props.history.push({
                    pathname: '/'
                });
            handleAlerts(setShow, setMessage, setVariant, props.setToken, message, variant, token);
        }, user);
    }

    const handleSearchChange = search => {
        props.history.push({
            pathname: '/shop',
            state: { search: search }
        });
    }

    return (
        <div className={loading ? "blockedWait" : ""}>
        <div className={loading ? "blocked" : ""}>
            <Menu handleSearchChange={handleSearchChange}/>
            <Alert message={message} showAlert={show} variant={variant} onShowChange={setShow} />
            <div className="formContainer">
                <div>
                    <div className="formTitle">
                        FORGOT PASSWORD
                    </div>
                    {token == "" ?
                    <Formik
                        validationSchema={schemaEmail}
                        initialValues={{ email: "" }}
                        onSubmit={handleSubmitEmail}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            touched,
                            errors,
                        }) => (
                            <Form noValidate className="formBasic" onSubmit={handleSubmit}>
                                <div className="formInfoText"> Please enter your email address. You will receive a link to create a new password via email. </div>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Enter Email</Form.Label>
                                    <Form.Control type="email" name="email" onChange={handleChange} isInvalid={touched.email && errors.email} />
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary" type="submit">
                                        SEND EMAIL
                                    </Button>
                                </Form.Group>
                            </Form>
                        )}
                    </Formik>
                    :
                    <Formik
                        validationSchema={schemaPassword}
                        initialValues={{password: "", confirmPassword: ""}}
                        onSubmit={handleSubmitPassword}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            touched,
                            errors,
                        }) => (
                            <Form noValidate className="formBasic" onSubmit={handleSubmit}>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" name="password" onChange={handleChange} isInvalid={touched.password && errors.password} />
                                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type="password" name="confirmPassword" onChange={handleChange} isInvalid={touched.confirmPassword && errors.confirmPassword} />
                                    <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary" type="submit">
                                        RESET PASSWORD
                                    </Button>
                                </Form.Group>
                            </Form>
                        )}
                    </Formik>
                    }
                </div>
            </div>
        </div>
        </div>
    )
}

export default withRouter(PasswordReset);
