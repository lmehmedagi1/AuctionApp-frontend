import React from 'react'
import { hostUrl } from 'utils/url'
import Requests from 'api/requests'
import auth from 'api/auth'

class Payments extends React.Component {

    constructor() {
        super();
    }

    sendGetReceiptRequest = (cb, token, params) => {
        let parameters = {
            params: params, 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        Requests.sendGetRequest(cb, hostUrl + "/receipt", parameters, (response) => { cb(null, null, response.data); }, null);
    }
    
    sendPayRequest = (cb, token, params) => {
        Requests.sendPostRequest(cb, hostUrl + "/payment", params, Requests.getAuthorizationHeader(token), 
            (response) => { cb(response.data, "success", null); }, null
        );
    }

    payForProduct = (cb, params, token, setToken) => {
        auth.forwardRequest(cb, params, token, setToken, this.sendPayRequest);
    }

    getReceipt = (cb, parameters, token, setToken) => {
        auth.forwardRequest(cb, parameters, token, setToken, this.sendGetReceiptRequest);
    }
}

export default new Payments();
