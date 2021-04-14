import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Button, Col } from 'react-bootstrap'
import { Formik } from "formik"
import * as yup from 'yup'

function SellPageStep2(props) {

    const [today, setToday] = useState("");
    const [tomorrow, setTomorrow] = useState("");

    const [currStartDate, setCurrStartDate] = useState("");
    const [currEndDate, setCurrEndDate] = useState("");
    const [currPrice, setCurrPrice] = useState(0);

    useEffect(() => {
        let tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate()+ 1);
        setTomorrow(tomorrowDate.toISOString().substr(0,10));
        setToday(new Date().toISOString().substr(0,10));

        setCurrPrice(props.product.price);
        setCurrStartDate(props.product.startDate);
        setCurrEndDate(props.product.endDate);
    }, [props.product]);

    const schema = yup.object().shape({
        price: yup.string().required("*Price is required")
    });
    
    const initialValues = {
        price: 0,
        startDate: today,
        endDate: tomorrow
    }

    const handleSubmit = item => {
        let product = props.product;
        
        product.price = currPrice;
        product.startDate = currStartDate;
        product.endDate = currEndDate;

        props.handleSubmit(product);
    }

    const handleBackButton = item => {
        let product = props.product;
        
        product.price = currPrice;
        product.startDate = currStartDate;
        product.endDate = currEndDate;

        props.handleBackButton(product);
    }

    const startDateChange = (event, handleChange, setFieldValue) => {
        event.preventDefault();
        setCurrStartDate(event.target.value);
        let minEndDate = new Date(event.target.value);
        minEndDate.setDate(minEndDate.getDate() + 1);
        setTomorrow(minEndDate.toISOString().substr(0,10));

        if (new Date(currEndDate) < new Date(minEndDate.toISOString().substr(0,10))) {
            setCurrEndDate(minEndDate.toISOString().substr(0,10));
            setFieldValue('endDate', minEndDate.toISOString().substr(0,10));
        }
        handleChange(event);
    }

    const endDateChange = (event, handleChange) => {
        event.preventDefault();
        setCurrEndDate(event.target.value)
        handleChange(event);
    }

    const priceChange = (event, handleChange) => {
        event.preventDefault();
        setCurrPrice(event.target.value.replace(/[^0-9]+/g,''));
        handleChange(event);
    }

    return (
        <div className="stepFormContainer">
            <div className="formTitle"><p>SET PRICES</p></div>
            <Formik
                validationSchema={schema}
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {({
                    handleSubmit,
                    handleChange,
                    setFieldValue,
                    values,
                    touched,
                    errors,
                }) => (
                    <Form noValidate className="formBasic" onSubmit={handleSubmit}>

                        <Form.Group controlId="formBasicName">
                            <Form.Label>Your Start Price</Form.Label>
                            <Form.Control type="text" name="price" value={currPrice} onChange={ event => priceChange(event, handleChange)} isInvalid={touched.price && errors.price} />
                            <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formStartDate">
                            <Form.Label>Start date</Form.Label>
                            <Form.Control type="date" name="startDate" min={today} value={currStartDate} onChange={ event => startDateChange(event, handleChange, setFieldValue)} ></Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formEndDate">
                            <Form.Label>End date</Form.Label>
                            <Form.Control type="date" name="endDate" min={tomorrow} value={currEndDate} onChange={ event => endDateChange(event, handleChange)}></Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <p>The auction will be automatically closed when the end time comes. The highest bid will win the auction.</p>

                        <Form.Group>
                            <div className="buttons">
                                <div className="backButton"><Button variant="primary" onClick={() => handleBackButton(values)}>BACK <i className="bi bi-chevron-left"></i></Button></div>
                                <div className="nextButton"><Button variant="primary" type="submit">NEXT <i className="bi bi-chevron-right"></i></Button></div>
                            </div>
                        </Form.Group>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default withRouter(SellPageStep2);
