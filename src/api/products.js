import React from 'react'
import axios from 'axios'
import { hostUrl } from '../utils/url'

class Products extends React.Component {

    constructor() {
        super();
    }

    getProducts = (cb, url) => {
        axios
            .get(url)
            .then((response) => {
                let products = response.data;
                let filteredProducts = [];
                for (let i = 0; i<products.length; i++) {
                    let image = "https://www.firstfishonline.com/wp-content/uploads/2017/07/default-placeholder-700x700.png";
                    if (products[i].images.length > 0) image = products[i].images[0].url;
                    filteredProducts.push({name: products[i].name, details: products[i].details, image});
                }
                cb(null, null, filteredProducts);
            }).catch(error => {
                if (error.response == null)
                    cb("Please check your internet connection!", "warning", null);
                else
                    cb(error.response.data.message, "warning", null);
            });
    }

    getNewArrivals = (cb) => {
        this.getProducts(cb, hostUrl + "/products/new-arrivals");
    }

    getLastChance = (cb) => {
        this.getProducts(cb, hostUrl + "/products/last-chance");
    }
}

export default new Products();
