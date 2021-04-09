import React from 'react'
import { hostUrl } from '../utils/url'
import Requests from './requests'

class Categories extends React.Component {

    constructor() {
        super();
    }

    getMainCategories = cb => {
        Requests.sendGetRequest(cb, hostUrl + "/supercategories", {}, (response) => { cb(null, null, response.data); }, null);
    }
}

export default new Categories();
