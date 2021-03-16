import React from 'react'
import axios from 'axios'
import { hostUrl } from '../utils/url'
import { nameToUrl } from '../utils/converters'

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
    
    getFilteredProducts = (cb, url) => {
        axios
            .get(url)
            .then((response) => {
                let products = response.data;
                let filteredProducts = [];
                for (let i = 0; i<products.length; i++) {
                    let image = "https://www.firstfishonline.com/wp-content/uploads/2017/07/default-placeholder-700x700.png";
                    if (products[i].images.length > 0) image = products[i].images[0].url;
                    let url = "/shop/" + nameToUrl(products[i].category.superCategory.name) + "/" + nameToUrl(products[i].category.name) + "/" + products[i].id;
                    filteredProducts.push({name: products[i].name, details: products[i].details, image: image, startingPrice: products[i].startingPrice, url: url});
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
        this.getFilteredProducts(cb, hostUrl + "/products/new-arrivals");
    }

    getLastChance = (cb) => {
        this.getFilteredProducts(cb, hostUrl + "/products/last-chance");
    }

    getProductById = (cb, id) => {
        this.sendRequest(cb, hostUrl + "/products/" + id);
    }
}

export default new Products();
