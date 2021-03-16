import React from 'react'
import axios from 'axios'
import { hostUrl } from '../utils/url'

class Products extends React.Component {

    constructor() {
        super();
    }

    sendRequest = (cb, url) => {
        axios
            .get(url)
            .then((response) => {
                cb(null, null, response.data);
            }).catch(error => {
                if (error.response == null)
                    cb("Please check your internet connection!", "warning", null);
                else
                    cb(error.response.data.message, "warning", null);
            });
    }
    
    getFilteredProducts = (cb, url, parameters) => {
        axios
            .get(url, {params: parameters})
            .then((response) => {
                let products = response.data;
                if (products.products != null) products = products.products;
                for (let i = 0; i<products.length; i++) {
                    let image = "https://www.firstfishonline.com/wp-content/uploads/2017/07/default-placeholder-700x700.png";
                    if (products[i].images.length > 0) image = products[i].images[0].url;
                    products[i].url = "/single-product/" + products[i].id;
                    products[i].image = image;
                }
                if (response.data.hasNext != null) cb(null, null, {products: products, hasNext: response.data.hasNext});
                else cb(null, null, products);
            }).catch(error => {
                if (error.response == null)
                    cb("Please check your internet connection!", "warning", null);
                else
                    cb(error.response.data.message, "warning", null);
            });
    }

    getNewArrivals = (cb) => {
        this.getFilteredProducts(cb, hostUrl + "/products/new-arrivals", {});
    }

    getLastChance = (cb) => {
        this.getFilteredProducts(cb, hostUrl + "/products/last-chance", {});
    }

    getProductById = (cb, id) => {
        this.sendRequest(cb, hostUrl + "/products/" + id);
    }

    getProductsByCategory = (cb, id, path, pageNo) => {
        this.getFilteredProducts(cb, hostUrl + path, {id: id, pageNo: pageNo}); 
    }
}

export default new Products();
