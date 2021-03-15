import React from 'react'
import axios from 'axios'
import { hostUrl } from '../utils/url'

class Categories extends React.Component {

    constructor() {
        super();
    }

    getMainCategories = cb => {
        axios
            .get(hostUrl + "/supercategories")
            .then((response) => {
                let categories = response.data
                for (let i = 0; i<categories.length; i++) {
                    categories[i].url = "/shop/" + categories[i].id;
                }
                cb(null, null, categories);
            }).catch(error => {
                if (error.response == null)
                    cb("Please check your internet connection!", "warning", null);
                else
                    cb(error.response.data.message, "warning", null);
            });
    }

    getAllCategories = cb => {
        axios
            .get(hostUrl + "/categories")
            .then((response) => {
                cb(null, null, response.data);
            }).catch(error => {
                if (error.response == null)
                    cb("Please check your internet connection!", "warning", null);
                else
                    cb(error.response.data.message, "warning", null);
            });

    }
}

export default new Categories();
