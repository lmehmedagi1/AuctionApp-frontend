import React, { useState, useEffect } from 'react'
import {withRouter} from 'react-router';
import { Button } from 'react-bootstrap'
import { handleAlerts } from '../utils/handlers'
import { nameToUrl } from '../utils/converters'

import Breadcrumb from '../common/Breadcrumbs'
import Menu from '../common/Menu'
import Alert from '../common/Alert'
import CategoryList from '../common/CategoryList'
import ItemCard from '../common/ItemCard'

import productsApi from "../api/products"
import { FileEaselFill } from 'react-bootstrap-icons';

function ShopPage(props) {

    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [variant, setVariant] = useState("");
    const [products, setProducts] = useState([]);

    const [activeUrl, setActiveUrl] = useState("/category/products");
    const [activeId, setActiveId] = useState("");
    const [activePageNo, setActivePageNo] = useState(0);
    const [activeHasNext, setActiveHasNext] = useState(false);

    const [initialSupercategory, setInitialSupercategory] = useState("");
    const [breadcrumbsKey, setBreadcrumbsKey] = useState(7);
    const [listKey, setListKey] = useState(7);
    
    useEffect(() => {
        update(window.location.pathname, false);
    }, []);

    const sendRequest = (url, id, pageNo) => {
        const newKey = breadcrumbsKey * 89;
        setBreadcrumbsKey(newKey);
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

    const subcategoryChange = choice => {
        let supercategoryid = window.history.state.supercategory; 
        let currentPathname = window.location.pathname.substr(1).split('/');
        let url = "https://auction-app-atlantbh-frontend.herokuapp.com/shop/" + currentPathname[1] + "/" + nameToUrl(choice.name);
        window.history.replaceState({ supercategory: supercategoryid, subcategory: choice.id }, "", url);
        sendRequest("/category/products", choice.id, 0);
    }

    const supercategoryChange = choice => {
        window.history.replaceState({ supercategory: choice.id }, "", "https://auction-app-atlantbh-frontend.herokuapp.com/shop/" + nameToUrl(choice.name));
        sendRequest("/supercategory/products", choice.id, 0);
    }

    const exploreMore = () => {
        sendRequest(activeUrl, activeId, activePageNo+1);
    }

    const update = (url, pop) => {
        let categoriesPathname = url.substr(1).split('/');
        if (categoriesPathname.length > 1) {
            if (window.history.state && window.history.state.supercategory) {
                let initial = window.history.state.supercategory;
                let url = categoriesPathname.length == 2 ? "/supercategory/products" : "/category/products";
                let id = categoriesPathname.length == 2 ? window.history.state.supercategory : window.history.state.subcategory;
                sendRequest(url, id, 0);
                setInitialSupercategory(initial);
                return;
            }
            else if (props.location.state && props.location.state.supercategory) {
                let initial = props.location.state.supercategory;
                let url = "/supercategory/products";
                sendRequest(url, initial, 0);
                setInitialSupercategory(initial);
                return;
            }
        }
        
        window.history.replaceState({}, "", "/shop"); 

        setProducts([]);
        setActivePageNo(0);
        setActiveHasNext(false);
        const newKey = breadcrumbsKey * 89;
        setBreadcrumbsKey(newKey);
        setInitialSupercategory("");
        const newListKey = listKey * 89;
        setListKey(newListKey);
    }

    return (
        <div>
            <Menu />
            <Breadcrumb key={breadcrumbsKey} update={update}/>
            <Alert message={message} showAlert={show} variant={variant} onShowChange={setShow} />
            <div className="shopPageContainer">
                <div className="filters">
                     <CategoryList subcategoryChange={subcategoryChange} supercategoryChange={supercategoryChange} initial={initialSupercategory} key={listKey}/>
                </div>
                <div className="products">
                    <div className="productsList">
                    {products.map((product, index) => {
                    product.url = window.location.pathname + "/single-product/" + product.id;
                    product.category = activeId;
                    return (
                        <div className="shopPageProduct">
                            <ItemCard product={product} />
                        </div>
                    )})}
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

export default withRouter(ShopPage);
