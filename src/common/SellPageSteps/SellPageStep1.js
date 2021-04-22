import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Button, Col } from 'react-bootstrap'
import { Formik } from "formik"
import * as yup from 'yup'

import FileUpload from 'common/ImageUpload'

function SellPageStep1(props) {

    const [categories, setCategories] = useState([]);
    const [chosenCategory, setChosenCategory] = useState(-1);
    const [chosenSubcategory, setChosenSubcategory] = useState(-1);

    const [profileImages, setProfileImages] = useState([]);
    const [imagesError, setImagesError] = useState("");
    const [initialImages, setinitialImages] = useState({});

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {

        if (name == "") setName(props.product.name);
        if (description == "") setDescription(props.product.description);

        let categoriesList = [];
        let data = props.categories;
        for (let i = 0; i<data.length; i++) {
            if (!data[i].superCategory) {
                let subcategories = data.filter(item => item.superCategory === data[i].id);
                categoriesList.push({id: data[i].id, name: data[i].name, subcategories: subcategories});
            }
        }
        setCategories(categoriesList);

        if (categoriesList.length > 0) {
            const i = categoriesList.map(function(e) { return e.id; }).indexOf(props.product.category);
            if (i == -1) return;

            const cat = categoriesList[i];
            const j = cat.subcategories.map(function(e) { return e.id; }).indexOf(props.product.subcategory);
            setChosenCategory(i);
            setChosenSubcategory(j);
        }

        if (props.product.images && props.product.images.length > 0) {
            let initImages = {};
            let images = props.product.images;
            for (let image in images) {
                initImages[images[image].name] = images[image];
            }
            setinitialImages(initImages);
            setProfileImages(images);
        }

    }, [props.categories]);

    const schema = yup.object().shape({
        name: yup.string().required("*Name is required").max(60, "*Name can't be longer than 60 characters")
            .matches(/^[a-zA-Z+#\-.0-9']+([ ][a-zA-Z+#\-.0-9']+){0,4}$/u,  "*Name can't be more than five words or end with a whitespace"),
        description: yup.string().required("*Description is required").max(700, "*Description can't be longer than 700 characters")
            .matches(/^[a-zA-Z+#\-.0-9']+([ ][a-zA-Z+#\-.0-9']+){0,99}$/u,  "*Description can't be more than 100 words or end with a whitespace"),
        category: yup.number().min(0, "*Category is required"),
        subcategory: yup.number().min(0, "*Subcategory is required"),
    });
    
    const initialValues = {
        name: name,
        description: description,
        category: chosenCategory,
        subcategory: chosenSubcategory
    }

    const handleSubmit = item => {

        if (profileImages.length < 3) {
            setImagesError("*You need to upload at least 3 images");
            return;
        }

        if (chosenSubcategory == -1 || chosenCategory == -1) return;

        let product = props.product;
        
        product.name = item.name;
        product.description = item.description;
        product.category = categories[chosenCategory].id;
        product.subcategory = categories[chosenCategory].subcategories[chosenSubcategory].id;
        product.images = profileImages;

        props.handleSubmit(product);
    }

    const categoryChange = (event, handleChange, setFieldValue) => {
        event.preventDefault();
        setChosenSubcategory(-1);
        setChosenCategory(event.target.value);
        setFieldValue('subcategory', -1)
        handleChange(event);
    }

    const subcategoryChange = (event, handleChange) => {
        event.preventDefault();
        setChosenSubcategory(event.target.value)
        handleChange(event);
    }

    const updateUploadedFiles = (files) => {
        setProfileImages(files);
        setImagesError("");
    }

    const nameChange = (event, handleChange, setFieldValue) => {
        event.preventDefault();
        setName(event.target.value);
        handleChange(event);
    }

    const descriptionChange = (event, handleChange, setFieldValue) => {
        event.preventDefault();
        setDescription(event.target.value);
        handleChange(event);
    }

    return (
        <div className="stepFormContainer">
            <div className="formTitle"><p>ADD ITEM</p></div>
            <Formik
                validationSchema={schema}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({
                    handleSubmit,
                    handleChange,
                    setFieldValue,
                    touched,
                    errors,
                }) => (
                    <Form noValidate className="formBasic" onSubmit={handleSubmit}>

                        <Form.Group controlId="formBasicName">
                            <Form.Label>What do you sell?</Form.Label>
                            <Form.Control type="text" name="name" value={name} onChange={ event => nameChange(event, handleChange, setFieldValue) } isInvalid={touched.name && errors.name} />
                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                            <div className="formControlDescription">2-5 words (60 characters)</div>
                        </Form.Group>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formCategory">
                            <Form.Control as="select" name="category" value={chosenCategory} onChange={ event => categoryChange(event, handleChange, setFieldValue) } isInvalid={touched.category && errors.category}>
                            <option value={-1}>Select Category</option>
                            {categories.map((cat, i) => {return <option value={i}>{cat.name}</option>})}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formSubcategory">
                            <Form.Control as="select" name="subcategory" value={chosenSubcategory} onChange={ event => subcategoryChange(event, handleChange) } isInvalid={errors.subcategory}>
                            <option value={-1}>Select Subcategory</option>
                            {categories.length>chosenCategory && chosenCategory != -1 ? categories[chosenCategory].subcategories.map((subcat, i) => {return <option value={i}>{subcat.name}</option>}) : null}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">{errors.subcategory}</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>

                        <Form.Group controlId="formBasicDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={4} style={{height: "100%"}} name="description" value={description} onChange={ event => descriptionChange(event, handleChange, setFieldValue) } isInvalid={touched.description && errors.description} />
                            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                            <div className="formControlDescription">100 words (700 characters)</div>
                        </Form.Group>

                        <Form.Group controlId="formBasicImages">
                            <FileUpload
                            accept=".jpg,.png,.jpeg"
                            label=""
                            multiple
                            updateFilesCb={updateUploadedFiles}
                            errorMessage={imagesError}
                            files={initialImages}
                            />
                        </Form.Group>

                        <Form.Group>
                            <div className="buttons">
                                <div></div>
                                <div className="nextButton"><Button variant="primary" type="submit">NEXT <i className="bi bi-chevron-right"></i></Button></div>
                            </div>
                        </Form.Group>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default withRouter(SellPageStep1);
