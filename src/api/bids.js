import React from 'react'
import axios from 'axios'
import { hostUrl } from '../utils/url'
import { removeUserSession } from './auth'

class Bids extends React.Component {

    constructor() {
        super();
    }

    sendPostRequest = (cb, url, params, headers, successCb, failureCb) => {
        axios
            .post(url, params, headers)
            .then((response) => { successCb(response); })
            .catch(error => { 
                if (error.response == null)
                    cb("Please check your internet connection!", "warning", null);
                else
                    failureCb(error.response.data.message);
            });
    }

    sendBidRequest = (cb, token, params) => {

        let headers = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }

        this.sendPostRequest(cb, hostUrl + "/bids/add", params, headers, 
            (response) => { cb(response.data, "success", null); }, 
            (message) => { cb(message, "warning", null); }
        );
    }

    refreshToken = (cb, token, setToken, params) => {

        let headers = {
            withCredentials: true,
            headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
        }

        this.sendPostRequest(cb, hostUrl + "/refresh-token", {}, headers, 
            (response) => { 
                token = response.data;
                setToken(token);
                this.sendBidRequest(cb, token, params); }, 
            (message) => {
                removeUserSession();
                cb("Your session has expired, log in again!", "warning", null);
                return;}
        );

        return token;
    }

    bid = (cb, params, token, setToken) => {

        if (token == null || token == "") 
            this.refreshToken(cb, token, setToken, params);
        else 
            this.sendBidRequest(cb, token, params);
    }
}

export default new Bids();
