import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import * as yup from 'yup'
import { handleAlerts } from '../utils/handlers'

import Breadcrumb from '../common/Breadcrumbs'
import Menu from '../common/Menu'
import Alert from '../common/Alert'
import CategoryList from '../common/CategoryList'
import ItemCard from '../common/ItemCard'

import productsApi from "../api/products"

function ShopPage(props) {

    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [variant, setVariant] = useState("");
    const [products, setProducts] = useState([]);

    const [activeUrl, setActiveUrl] = useState("/category/products");
    const [activeId, setActiveId] = useState("");
    const [activePageNo, setActivePageNo] = useState(0);
    const [activeHasNext, setActiveHasNext] = useState(false);

    const sendRequest = (url, id, pageNo) => {
        setActiveUrl(url);
        setActivePageNo(pageNo);
        setActiveId(id);
        productsApi.getProductsByCategory((message, variant, data) => {
            if (data == null) data = {products: [], hasNext: false};
            if (data.products == null) data.products = [];
            setActiveHasNext(data.hasNext);
            if (pageNo > 0) handleAlerts(setShow, setMessage, setVariant, setProducts, message, variant, [...products, ...data.products]);
            else handleAlerts(setShow, setMessage, setVariant, setProducts, message, variant, data.products);
        }, id, url, pageNo);
    }

    const subcategoryChange = id => {
        sendRequest("/category/products", id, 0);
    }

    const supercategoryChange = id => {
        sendRequest("/supercategory/products", id, 0);
    }

    const exploreMore = () => {
        sendRequest(activeUrl, activeId, activePageNo+1);
    }

    return (
        <div>
            <Menu />
            <Breadcrumb />
            <Alert message={message} showAlert={show} variant={variant} onShowChange={setShow} />
            <div className="shopPageContainer">
                <div className="filters">
                     <CategoryList subcategoryChange={subcategoryChange} supercategoryChange={supercategoryChange}/>
                </div>
                <div className="products">
                    <div className="productsList">
                    {products.map((product, index) => (
                        <div className="shopPageProduct">
                            <ItemCard product={product} />
                        </div>
                    ))}
                    </div>
                    {activeHasNext ? 
                    <div className="exploreMore">
                    <Button variant="primary" type="submit" onClick={() => exploreMore()}>EXPLORE MORE</Button>
                    </div>
                    : null}
                </div>
            </div>
        </div>
    )
}

export default ShopPage;
