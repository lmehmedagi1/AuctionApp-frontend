import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import productsApi from 'api/products'
import { getUser } from 'api/auth'
import { handleAlerts } from 'utils/handlers'

import Breadcrumb from 'common/Breadcrumbs'
import Menu from 'common/Menu'
import Alert from 'common/Alert'

import SellPageStep1 from 'common/SellPageSteps/SellPageStep1'
import SellPageStep2 from 'common/SellPageSteps/SellPageStep2'
import SellPageStep3 from 'common/SellPageSteps/SellPageStep3'
import Stepper from 'common/SellPageSteps/Stepper'
import ScrollButton from 'utils/ScrollButton'

function SellPage(props) {

    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [variant, setVariant] = useState("");

    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState({});

    const [step, setStep] = useState(1);

    const [resolvedImages, setResolvedImages] = useState([]);

    let resolvedNewImages = [];

    useEffect(() => {

        if (getUser() == null) {
            props.history.push({
                pathname: '/login'
            });
        }

        // Step 1
        product.name = "";
        product.description = "";
        product.category = "";
        product.subcategory = "";
        product.images = [];

        // Step 2
        let tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate()+ 1);

        product.price = 0;
        product.startDate = new Date().toISOString().substr(0,10);
        product.endDate = tomorrowDate.toISOString().substr(0,10);
        
        // Step 3
        product.address = getUser().address;
        product.country = getUser().country;
        product.state = getUser().state;
        product.city = getUser().city;
        product.zipcode = getUser().zipcode;
        product.phoneNumber = getUser().phoneNumber;
        product.shippingCost = false;

        productsApi.getCategoriesFilterInfo((message, variant, data) => {
            if (data == null) data = [];
            handleAlerts(setShow, setMessage, setVariant, setCategories, message, variant, data);
        }, {});

    }, []);

    const handleSearchChange = search => {
        props.history.push({
            pathname: '/shop',
            state: { search: search }
        });
    }

    const getBase64 = (file) => {
        return new Promise(resolve => {
            let baseURL = "";
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                baseURL = reader.result;
                let newImage = {url: baseURL.substring(13 + file.type.length), type: file.type};
                let newImages = resolvedImages;
                newImages.push(newImage);
                resolvedNewImages.push(newImage);
                setResolvedImages(newImages)
                resolve(resolvedNewImages);
            };
        });
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const handleSubmit = (item) => {
        setProduct(item);
        if (step < 3) setStep(s => s + 1);
        else {

            // Don't allow submit when page refreshes
            if (item.name == "" || item.description == "" || item.category == "" || item.subcategory == "" || item.images == null || item.images.length == 0) {
                handleAlerts(setShow, setMessage, setVariant, null, "Some data might have been lost, check previous steps", "warning", null);
                ScrollButton.scrollToTop();
                return;
            }

            let values = Promise.all(item.images.map(image => {
                return getBase64(image)
            }))
            .then(pushResults => {

                if (pushResults.length == item.images.length) {
                    const newParams = {
                        name: item.name,
                        details: item.description,
                        startingPrice: item.price,
                        startDate: item.startDate + 'T00:00:00.000',
                        endDate: item.endDate + 'T00:00:00.000',
                        subcategory: item.subcategory,
                        images: pushResults[item.images.length-1]
                    }

                    ScrollButton.scrollToTop();

                    productsApi.addNewProduct((message, variant, data) => {
                        if (data == null) data = [];
                        handleAlerts(setShow, setMessage, setVariant, setCategories, message, variant, data);
                    }, newParams, props.getToken(), props.setToken);
                }
            });
        }
    }

    const handleBackButton = (item) => {
        setProduct(item);
        setStep(s => s - 1);
    }

    const updateState = (active) => {
        props.history.push('/my-account/' + active, { activeKey: active });
    }

    const SellPageSteps = [
        <SellPageStep1 setShow={setShow} setMessage={setMessage} setVariant={setVariant} handleSubmit={handleSubmit} product={product} categories={categories} />,
        <SellPageStep2 setShow={setShow} setMessage={setMessage} setVariant={setVariant} handleSubmit={handleSubmit} product={product} handleBackButton={handleBackButton}/>,
        <SellPageStep3 setShow={setShow} setMessage={setMessage} setVariant={setVariant} handleSubmit={handleSubmit} product={product} handleBackButton={handleBackButton}/>
    ]

    return (
        <div>
            <Menu handleSearchChange={handleSearchChange}/>
            <Breadcrumb update={updateState}/>
            <Alert message={message} showAlert={show} variant={variant} onShowChange={setShow} />
            <div className="sellPageContainer">
                <Stepper step={step}/>
                {SellPageSteps[step-1]}
            </div>
        </div>
    )
}

export default withRouter(SellPage);
