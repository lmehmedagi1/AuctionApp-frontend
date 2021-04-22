import React from 'react'
import { hostUrl } from 'utils/url'
import Requests from 'api/requests'
import auth from 'api/auth'

class Products extends React.Component {

    sendRequest = (cb, url, parameters) => {
        Requests.sendGetRequest(cb, url, {params: parameters}, (response) => { cb(null, null, response.data); }, null);
    }
    
    getFilteredProducts = (cb, url, parameters) => {
        Requests.sendGetRequest(cb, url, {params: parameters}, 
        (response) => {
            if (response.data == null) {
                cb("Something went wrong!", "warning");
                return;
            }
            let products = response.data;
            if (products.products != null) products = products.products;

            let newProducts = [];
            for (let i = 0; i<products.length; i++) {
                let image = 'data:' + products[i].images[0].type + ';base64,' + products[i].images[0].url;
                let newProduct = {
                    image: image,
                    url: "/single-product/" + products[i].id,
                    name: products[i].name,
                    details: products[i].details,
                    startingPrice: products[i].startingPrice,
                    id: products[i].id
                }
                newProducts.push(newProduct);
            }
            if (response.data.hasNext != null) cb(null, null, {products: newProducts, hasNext: response.data.hasNext, suggested: response.data.suggested});
            else cb(null, null, newProducts);
        }, null);
    }

    getNewArrivals = (cb) => {
        this.getFilteredProducts(cb, hostUrl + "/products/new-arrivals", {});
    }

    getLastChance = (cb) => {
        this.getFilteredProducts(cb, hostUrl + "/products/last-chance", {});
    }

    getProductById = (cb, id) => {
        this.sendRequest(cb, hostUrl + "/products/" + id, {});
    }

    getProductsByCategory = (cb, id, path, pageNo) => {
        this.getFilteredProducts(cb, hostUrl + path, {id: id, pageNo: pageNo}); 
    }

    getProductsByFilters = (cb, params) => {
        this.getFilteredProducts(cb, hostUrl + "/products", params);
    }

    getPriceFilterInfo = (cb, params) => {
        this.sendRequest(cb, hostUrl + "/products/filter/price", params);
    }

    getCategoriesFilterInfo = (cb, params) => {
        this.sendRequest(cb, hostUrl + "/products/filter/category", params);
    }

    getRecommendedProducts = (cb, params) => {
        this.getFilteredProducts(cb, hostUrl + "/products/single-product/recommended", params);
    }

    sendAddNewProductRequest = (cb, token, params) => {
        Requests.sendPostRequest(cb, hostUrl + "/product/add", params, Requests.getAuthorizationHeader(token), 
            (response) => { cb(response.data, "success", null); }, null
        );
    }

    addNewProduct = (cb, params, token, setToken) => {
        auth.forwardRequest(cb, JSON.parse(JSON.stringify(params)), token, setToken, this.sendAddNewProductRequest);
    }
}

export default new Products();
