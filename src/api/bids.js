import React from 'react'
import { hostUrl } from 'utils/url'
import Requests from 'api/requests'
import auth from 'api/auth'

class Bids extends React.Component {

    constructor() {
        super();
    }

    sendBidRequest = (cb, token, params) => {
        Requests.sendPostRequest(cb, hostUrl + "/bids/add", params, Requests.getAuthorizationHeader(token), 
            (response) => { cb(response.data, "success", null); }, null
        );
    }

    sendGetMyBidsRequest = (cb, token, params) => {
        Requests.sendGetRequest(cb, hostUrl + "/bids", Requests.getAuthorizationHeader(token), (response) => { cb(null, null, response.data); }, null);
    }

    sendGetMySoldBidsRequest = (cb, token, params) => {
        Requests.sendGetRequest(cb, hostUrl + "/bids/sold", Requests.getAuthorizationHeader(token), (response) => { cb(null, null, response.data); }, null);
    }

    sendGetMyActiveBidsRequest = (cb, token, params) => {
        Requests.sendGetRequest(cb, hostUrl + "/bids/active", Requests.getAuthorizationHeader(token), (response) => { cb(null, null, response.data); }, null);
    }

    bid = (cb, params, token, setToken) => {
        auth.forwardRequest(cb, params, token, setToken, this.sendBidRequest);
    }

    getMyBids = (cb, token, setToken) => {
        auth.forwardRequest(cb, {}, token, setToken, this.sendGetMyBidsRequest);
    }

    getMySoldBids = (cb, token, setToken) => {
        auth.forwardRequest(cb, {}, token, setToken, this.sendGetMySoldBidsRequest);
    }

    getMyActiveBids = (cb, token, setToken) => {
        auth.forwardRequest(cb, {}, token, setToken, this.sendGetMyActiveBidsRequest);
    }
}

export default new Bids();
