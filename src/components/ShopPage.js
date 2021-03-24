import React, { useState, useEffect } from 'react'
import {withRouter} from 'react-router';
import { Button, DropdownButton, Dropdown, ToggleButtonGroup, ToggleButton, Spinner } from 'react-bootstrap'
import { handleAlerts } from '../utils/handlers'

import Menu from '../common/Menu'
import Alert from '../common/Alert'
import CategoryList from '../common/CategoryList'
import ItemCard from '../common/ItemCard'
import PriceFilter from '../common/PriceFilter'
import Filters from '../common/Filters'

import productsApi from "../api/products"

function ShopPage(props) {

    // Alert
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [variant, setVariant] = useState("");
    const [products, setProducts] = useState([]);

    const [listStyle, setListStyle] = useState("grid");
    const [loading, setLoading] = useState(false);

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
    const [menuKey, setMenuKey] = useState(7);

    // Filet tags 
    const [supercategoryName, setSupercategoryName] = useState("");
    const [subcategoriesNames, setSubcategoriesNames] = useState([]);
    
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
        setLoading(true);
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
            setLoading(false);
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
            if (data == null) data = [];
            handleAlerts(setShow, setMessage, setVariant, setCategories, message, variant, data);
        }, params);
    }

    const subcategoryChange = choice => {
        let currSubcategories = subcategories;
        let currSubcategoriesNames = subcategoriesNames;
        if (currSubcategories.includes(choice.id)) {
            currSubcategories = currSubcategories.filter(e => e !== choice.id);
            currSubcategoriesNames = currSubcategoriesNames.filter(e => e !== choice.name);
        }
        else {
            currSubcategories.push(choice.id);
            currSubcategoriesNames.push(choice.name);
        }
        setSubcategories(currSubcategories);
        setActivePageNo(0);
        setSubcategoriesNames(currSubcategoriesNames);
        fetchPriceFilterInfo(supercategoryId, activeMinPrice, activeMaxPrice, sorting, search, 0, currSubcategories);
    }

    const supercategoryChange = choice => {
        let id = supercategoryId == choice.id ? "" : choice.id;
        let name = supercategoryName == choice.name ? "" : choice.name;
        setSupercategoryId(id);
        setSubcategories([]);
        setActivePageNo(0);
        setSupercategoryName(name);
        setSubcategoriesNames([]);
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
        if (activeMinPrice == 0 || activeMinPrice < info.minPrice) setActiveMinPrice(info.minPrice);
        if (activeMaxPrice == 2147483640 || activeMaxPrice > info.maxPrice) setActiveMaxPrice(info.maxPrice);

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

    // Closable filter tags
    const resetMinPrice = () => {
        priceFilterChange({minPrice: minPrice, maxPrice: activeMaxPrice});
    }

    const resetMaxPrice = () => {
        priceFilterChange({minPrice: activeMinPrice, maxPrice: maxPrice});
    }

    const resetSupercategory = () => {
        supercategoryChange({id: "", name: ""});
        const newListKey = listKey * 89;
        setListKey(newListKey);
    }

    const resetSubcategory = (index) => {
        let currSubcategories = subcategories.filter((_, i) => i !== index);
        let currSubcategoriesNames = subcategoriesNames.filter((_, i) => i !== index);
        setSubcategories(currSubcategories);
        setActivePageNo(0);
        setSubcategoriesNames(currSubcategoriesNames);
        fetchPriceFilterInfo(supercategoryId, activeMinPrice, activeMaxPrice, sorting, search, 0, currSubcategories);
    }

    const resetSearch = () => {
        handleSearchChange("");
        const newMenuKey = menuKey * 89;
        setMenuKey(newMenuKey);
    }

    return (
        <div>
            <Menu handleSearchChange={handleSearchChange} initial={search} key={menuKey}/>
            {/* <Breadcrumb key={breadcrumbsKey}/> */}
            <Alert message={message} showAlert={show} variant={variant} onShowChange={setShow} />
            <Filters minPrice={minPrice} maxPrice={maxPrice} activeMinPrice={activeMinPrice} activeMaxPrice={activeMaxPrice} supercategory={supercategoryName} subcategories={subcategoriesNames} search={search}
            resetMinPrice={resetMinPrice} resetMaxPrice={resetMaxPrice} resetSupercategory={resetSupercategory} resetSubcategory={resetSubcategory} resetSearch={resetSearch}/>
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
                        {loading ? <Spinner className="spinner" animation="border" role="status"/> : null}
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
