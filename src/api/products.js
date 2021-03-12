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
                cb(null, null, response.data);
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
