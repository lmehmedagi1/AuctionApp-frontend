import React, { useState, useEffect } from 'react'
import {withRouter} from 'react-router';
import { Button, DropdownButton, Dropdown, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import { handleAlerts } from '../utils/handlers'

import Menu from '../common/Menu'
import Alert from '../common/Alert'
import CategoryList from '../common/CategoryList'
import ItemCard from '../common/ItemCard'
import PriceFilter from '../common/PriceFilter'

import productsApi from "../api/products"

function ShopPage(props) {

    // Alert
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [variant, setVariant] = useState("");
    const [products, setProducts] = useState([]);

    const [listStyle, setListStyle] = useState("grid");

    // Filters
    const [sorting, setSorting] = useState({title: "Default sorting", value: "default"});
    const [search, setSearch] = useState("");
    const [supercategoryId, setSupercategoryId] = useState("");
    const [subcategories, setSubcategories] = useState([]);
    const [activeMinPrice, setActiveMinPrice] = useState(0);
    const [activeMaxPrice, setActiveMaxPrice] = useState(2147483640);

    const [activePageNo, setActivePageNo] = useState(0);
    const [activeHasNext, setActiveHasNext] = useState(false);

    // Price filter info
    const [prices, setPrices] = useState([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(2147483640);
    const [avgPrice, setAvgPrice] = useState(0);

    // Categories filter info
    const [categories, setCategories] = useState([]);

    // List filter info
    const [listKey, setListKey] = useState(7);
    const [priceKey, setPriceKey] = useState(7);
    
    useEffect(() => {
        let search = "";
        if (props.location.state && props.location.state.search) {
            search = props.location.state.search
            setSearch(props.location.state.search);
        }
        fetchPriceFilterInfo(supercategoryId, activeMinPrice, activeMaxPrice, sorting, search, activePageNo, subcategories);
        fetchCategoriesFilterInfo(activeMinPrice, activeMaxPrice, search);
    }, []);

    const fetchProducts = (cat, minPrice, maxPrice, sort, search, pageNo, subcat) => {
        let params = new URLSearchParams();
        params.append("cat", cat);
        params.append("minPrice", minPrice);
        params.append("maxPrice", maxPrice);
        params.append("sort", sort.value);
        params.append("search", search);
        params.append("pageNo", pageNo);
        for (let i = 0; i<subcat.length; i++) {
            params.append("subcat", subcat[i]);
        }

        productsApi.getProductsByFilters((message, variant, data) => {
            if (data == null) data = {products: [], hasNext: false};
            if (data.products == null) data.products = [];
            setActiveHasNext(data.hasNext);
            if (pageNo > 0) handleAlerts(setShow, setMessage, setVariant, setProducts, message, variant, [...products, ...data.products]);
            else handleAlerts(setShow, setMessage, setVariant, setProducts, message, variant, data.products);
        }, params);
    }

    const fetchPriceFilterInfo = (cat, minPrice, maxPrice, sort, search, pageNo, subcat) => {
        
        fetchProducts(cat, minPrice, maxPrice, sort, search, pageNo, subcat);

        let params = new URLSearchParams();
        params.append("cat", cat);
        params.append("search", search);
        for (let i = 0; i<subcat.length; i++) {
            params.append("subcat", subcat[i]);
        }

        productsApi.getPriceFilterInfo((message, variant, data) => {
            if (data == null) data = {minPrice: 0, maxPrice: 0, avgPrice: 0, histogram: []};
            handleAlerts(setShow, setMessage, setVariant, setPriceInfo, message, variant, data);
        }, params);
    }

    const fetchCategoriesFilterInfo = (minPrice, maxPrice, search) => {
        let params = {
            minPrice: minPrice,
            maxPrice: maxPrice,
            search: search
        }

        productsApi.getCategoriesFilterInfo((message, variant, data) => {
            if (data == null) data = {minPrice: 0, maxPrice: 0, avgPrice: 0, histogram: []};
            handleAlerts(setShow, setMessage, setVariant, setCategories, message, variant, data);
        }, params);
    }

    const subcategoryChange = choice => {
        let currSubcategories = subcategories;
        if (currSubcategories.includes(choice.id)) currSubcategories = currSubcategories.filter(e => e !== choice.id);
        else currSubcategories.push(choice.id);
        setSubcategories(currSubcategories);
        setActivePageNo(0);
        fetchPriceFilterInfo(supercategoryId, activeMinPrice, activeMaxPrice, sorting, search, 0, currSubcategories);
    }

    const supercategoryChange = choice => {
        let id = supercategoryId == choice.id ? "" : choice.id;
        setSupercategoryId(id);
        setSubcategories([]);
        setActivePageNo(0);
        fetchPriceFilterInfo(id, activeMinPrice, activeMaxPrice, sorting, search, 0, []);
    }

    const exploreMore = () => {
        let pageNo = activePageNo + 1;
        setActivePageNo(pageNo);
        fetchProducts(supercategoryId, activeMinPrice, activeMaxPrice, sorting, search, pageNo, subcategories);
    }

    const handleSortingSelect = e => {
        let title = e;
        let value = "default";

        switch (title) {
            case "New to old":
                value = "newToOld";
                break;
            case "Time left":
                value = "timeLeft";
                break;
            case "Price: Low to High":
                value = "lowToHigh";
                break;
            case "Price: High to Low":
                value = "highToLow";
                break;
            default:
                break;
        }

        setSorting({title: title, value: value});
        fetchProducts(supercategoryId, activeMinPrice, activeMaxPrice, {title: title, value: value}, search, activePageNo, subcategories);
    }

    const priceFilterChange = price => {
        if (activeMinPrice == price.minPrice && activeMaxPrice == price.maxPrice) return;
        setActiveMinPrice(price.minPrice);
        setActiveMaxPrice(price.maxPrice);
        setActivePageNo(0);
        fetchProducts(supercategoryId, price.minPrice, price.maxPrice, sorting, search, 0, subcategories);
        fetchCategoriesFilterInfo(price.minPrice, price.maxPrice, search);
    }

    const setPriceInfo = info => {
        setPrices(info.histogram);
        setMinPrice(info.minPrice);
        setMaxPrice(info.maxPrice);
        setAvgPrice(info.avgPrice);
    }

    const handleStyleChange = e => {
        setListStyle(e);
    }

    const handleSearchChange = search => {
        setSearch(search);
        setActivePageNo(0);
        fetchPriceFilterInfo(supercategoryId, activeMinPrice, activeMaxPrice, sorting, search, 0, subcategories);
        fetchCategoriesFilterInfo(activeMinPrice, activeMaxPrice, search);
    }

    return (
        <div>
            <Menu handleSearchChange={handleSearchChange} initial={search}/>
            {/* <Breadcrumb key={breadcrumbsKey}/> */}
            <Alert message={message} showAlert={show} variant={variant} onShowChange={setShow} />
            <div className="shopPageContainer">
                <div className="filters">
                    <CategoryList subcategoryChange={subcategoryChange} supercategoryChange={supercategoryChange} categories={categories} key={listKey}/>
                    <PriceFilter prices={prices} minPrice={minPrice} maxPrice={maxPrice} avgPrice={avgPrice} activeMin={activeMinPrice} activeMax={activeMaxPrice} priceFilterChange={priceFilterChange} />
                </div>
                <div className="products">
                    <div className="productsHeader">
                        <div className="sorting">
                        <DropdownButton id="dropdown-basic-button" title={sorting.title} onSelect={handleSortingSelect}>
                            <Dropdown.Item eventKey="Default sorting">Default sorting</Dropdown.Item>
                            <Dropdown.Item eventKey="New to old">New to old</Dropdown.Item>
                            <Dropdown.Item eventKey="Time left">Time left</Dropdown.Item>
                            <Dropdown.Item eventKey="Price: Low to High">Price: Low to High</Dropdown.Item>
                            <Dropdown.Item eventKey="Price: High to Low">Price: High to Low</Dropdown.Item>
                        </DropdownButton>
                        </div>
                        <div className="toggleStyle">
                        <ToggleButtonGroup type="radio" name="options" defaultValue={listStyle} onChange={handleStyleChange}>
                            <ToggleButton value="grid"><i class="fa fa-th" aria-hidden="true"></i> Grid </ToggleButton>
                            <ToggleButton value="list"><i class="fa fa-th-list" aria-hidden="true"></i> List</ToggleButton>
                        </ToggleButtonGroup>
                        </div>
                    </div>
                    {listStyle == "grid" ?
                        <div className="productsGrid">
                        {products.map((product, index) => {
                        product.url = window.location.pathname + "/single-product/" + product.id;
                        return (
                            <div className="shopPageProduct">
                                <ItemCard product={product} />
                            </div>
                        )})}
                        </div>
                    :
                        <div className="productsList">
                        {products.map((product, index) => {
                        product.url = window.location.pathname + "/single-product/" + product.id;
                        return (
                            <div className="shopPageProduct">
                                <ItemCard product={product} />
                            </div>
                        )})}
                        </div>
                    }
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
