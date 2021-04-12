import React, { useState, useEffect } from 'react'
import {withRouter} from 'react-router';
import { Button, DropdownButton, Dropdown, ToggleButtonGroup, ToggleButton, Spinner } from 'react-bootstrap'
import { handleAlerts } from 'utils/handlers'

import Menu from 'common/Menu'
import Alert from 'common/Alert'
import CategoryList from 'common/CategoryList'
import ItemCard from 'common/ItemCard'
import PriceFilter from 'common/PriceFilter'
import Filters from 'common/Filters'

import productsApi from "api/products"

function ShopPage(props) {

    // Alert
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [variant, setVariant] = useState("");
    const [products, setProducts] = useState([]);

    const [listStyle, setListStyle] = useState("grid");
    const [loading, setLoading] = useState(false);
    const [loadingPrice, setLoadingPrice] = useState(false);

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

    let initialMaxLoad = false;
    let initialMinLoad = false;
    
    useEffect(() => {
        
        let supercategoryId = "";
        let supercategoryName = "";
        let subcat = [];
        let subcatNames = [];
        let minPrice = 0;
        let maxPrice = 2147483640;
        let sort = {title: "Default sorting", value: "default"};
        let search = "";
        let pageNo = 0;
        let listStyle = "grid";

        if (props.location.state) {

            if (props.location.state.minPrice && props.location.state.minPrice != 0) {
                initialMinLoad = true;
                minPrice = props.location.state.minPrice;
                setActiveMinPrice(minPrice);
            }
            if (props.location.state.maxPrice && props.location.state.maxPrice != 2147483640) {
                initialMaxLoad = true;
                maxPrice = props.location.state.maxPrice;
                setActiveMaxPrice(maxPrice);

            }
            if (props.location.state.search && props.location.state.search != "") {
                search = props.location.state.search;
                setSearch(search);
            }
            if (props.location.state.supercategory && props.location.state.supercategory != "") {
                supercategoryId = props.location.state.supercategory;
                supercategoryName = props.location.state.supercategoryName;
                setSupercategoryId(supercategoryId);
                setSupercategoryName(supercategoryName);
            }
            if (props.location.state.subcat && props.location.state.subcat != []) {
                subcat = props.location.state.subcat;
                subcatNames = props.location.state.subcatNames;
                setSubcategories(subcat);
                setSubcategoriesNames(subcatNames);
            }
            if (props.location.state.sort && props.location.state.sort.title != "Default sorting") {
                sort = props.location.state.sort;
                setSorting(sort);
            }
            if (props.location.state.list && props.location.state.list != "grid") {
                listStyle = props.location.state.list;
                setListStyle(listStyle);
            }
        }

        fetchPriceFilterInfo(supercategoryId, supercategoryName, minPrice, maxPrice, sort, search, pageNo, subcat, subcatNames);
        fetchCategoriesFilterInfo(minPrice, maxPrice, search);
    }, []);

    const updateState = (cat, catName, minPrice, maxPrice, sort, search, subcat, subcatNames, listStyle) => {
        props.history.replace(props.location.pathname, { supercategory: cat, supercategoryName: catName, minPrice: minPrice, maxPrice: maxPrice, sort: sort, 
            search: search, subcat: subcat, subcatNames: subcatNames, list: listStyle });
    }

    const fetchProducts = (cat, catName, minPrice, maxPrice, sort, search, pageNo, subcat, subcatNames) => {
        setLoading(true);

        updateState(cat, catName, minPrice, maxPrice, sort, search, subcat, subcatNames, listStyle);

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

    const fetchPriceFilterInfo = (cat, catName, minPrice, maxPrice, sort, search, pageNo, subcat, subcatNames) => {
        
        fetchProducts(cat, catName, minPrice, maxPrice, sort, search, pageNo, subcat, subcatNames);

        setLoadingPrice(true);

        let params = new URLSearchParams();
        params.append("cat", cat);
        params.append("search", search);
        for (let i = 0; i<subcat.length; i++) {
            params.append("subcat", subcat[i]);
        }

        productsApi.getPriceFilterInfo((message, variant, data) => {
            if (data == null) data = {minPrice: 0, maxPrice: 0, avgPrice: 0, histogram: []};
            handleAlerts(setShow, setMessage, setVariant, setPriceInfo, message, variant, data);
            setLoadingPrice(false);
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
        fetchPriceFilterInfo(supercategoryId, supercategoryName, activeMinPrice, activeMaxPrice, sorting, search, 0, currSubcategories, currSubcategoriesNames);
    }

    const supercategoryChange = choice => {
        let id = supercategoryId == choice.id ? "" : choice.id;
        let name = supercategoryName == choice.name ? "" : choice.name;
        setSupercategoryId(id);
        setSubcategories([]);
        setActivePageNo(0);
        setSupercategoryName(name);
        setSubcategoriesNames([]);
        fetchPriceFilterInfo(id, name, activeMinPrice, activeMaxPrice, sorting, search, 0, [], []);
    }

    const exploreMore = () => {
        let pageNo = activePageNo + 1;
        setActivePageNo(pageNo);
        fetchProducts(supercategoryId, supercategoryName, activeMinPrice, activeMaxPrice, sorting, search, pageNo, subcategories, subcategoriesNames);
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
        fetchProducts(supercategoryId, supercategoryName, activeMinPrice, activeMaxPrice, {title: title, value: value}, search, activePageNo, subcategories, subcategoriesNames);
    }

    const priceFilterChange = price => {
        if (activeMinPrice == price.minPrice && activeMaxPrice == price.maxPrice) return;
        setActiveMinPrice(price.minPrice);
        setActiveMaxPrice(price.maxPrice);
        setActivePageNo(0);
        fetchProducts(supercategoryId, supercategoryName, price.minPrice, price.maxPrice, sorting, search, 0, subcategories, subcategoriesNames);
        fetchCategoriesFilterInfo(price.minPrice, price.maxPrice, search);
    }

    const setPriceInfo = info => {
        if (!initialMinLoad && (activeMinPrice == minPrice || activeMinPrice < info.minPrice)) setActiveMinPrice(info.minPrice);
        if (!initialMaxLoad && (activeMaxPrice == maxPrice || activeMaxPrice > info.maxPrice)) setActiveMaxPrice(info.maxPrice);

        setPrices(info.histogram);
        setMinPrice(info.minPrice);
        setMaxPrice(info.maxPrice);
        setAvgPrice(info.avgPrice);

        if (initialMaxLoad || initialMinLoad) {
            initialMinLoad = false;
            initialMaxLoad = false;
        }
    }

    const handleStyleChange = e => {
        updateState(supercategoryId, supercategoryName, activeMinPrice, activeMaxPrice, sorting, search, subcategories, subcategoriesNames, e);
        setListStyle(e);
    }

    const handleSearchChange = search => {
        setSearch(search);
        setActivePageNo(0);
        fetchPriceFilterInfo(supercategoryId, supercategoryName, activeMinPrice, activeMaxPrice, sorting, search, 0, subcategories, subcategoriesNames);
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
        fetchPriceFilterInfo(supercategoryId, supercategoryName, activeMinPrice, activeMaxPrice, sorting, search, 0, currSubcategories, currSubcategoriesNames);
    }

    const resetSearch = () => {
        handleSearchChange("");
        const newMenuKey = menuKey * 89;
        setMenuKey(newMenuKey);
    }

    return (
        <div>
            <Menu handleSearchChange={handleSearchChange} initial={search} key={menuKey}/>
            <Alert message={message} showAlert={show} variant={variant} onShowChange={setShow} />
            <Filters minPrice={minPrice} maxPrice={maxPrice} activeMinPrice={activeMinPrice} activeMaxPrice={activeMaxPrice} supercategory={supercategoryName} subcategories={subcategoriesNames} search={search}
            resetMinPrice={resetMinPrice} resetMaxPrice={resetMaxPrice} resetSupercategory={resetSupercategory} resetSubcategory={resetSubcategory} resetSearch={resetSearch}/>
            <div className="shopPageContainer">
                <div className="filters">
                    <CategoryList subcategoryChange={subcategoryChange} supercategoryChange={supercategoryChange} categories={categories} key={listKey} initial={supercategoryId}/>
                    <PriceFilter prices={prices} minPrice={minPrice} maxPrice={maxPrice} avgPrice={avgPrice} activeMin={activeMinPrice} activeMax={activeMaxPrice} priceFilterChange={priceFilterChange} loading={loadingPrice}/>
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
                        <ToggleButtonGroup type="radio" name="options" value={listStyle} onChange={handleStyleChange}>
                            <ToggleButton value="grid"><i className="fa fa-th" aria-hidden="true"></i> Grid </ToggleButton>
                            <ToggleButton value="list"><i className="fa fa-th-list" aria-hidden="true"></i> List</ToggleButton>
                        </ToggleButtonGroup>
                        </div>
                    </div>
                    {listStyle == "grid" ?
                        <div className="productsGrid">
                        {products.map((product, index) => {
                        product.url = "/shop/single-product/" + product.id;
                        return (
                            <div className="shopPageProduct">
                                <ItemCard product={product} />
                            </div>
                        )})}
                        </div>
                    :
                        <div className="productsList">
                        {products.map((product, index) => {
                        product.url = "/shop/single-product/" + product.id;
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
