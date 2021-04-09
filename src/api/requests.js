import React from 'react'
import axios from 'axios'

class Requests extends React.Component {

    constructor() {
        super();
    }

    getCookieHeader = () => {
        return {
            withCredentials: true,
            headers: {"Access-Control-Allow-Origin": "*", 'Access-Control-Allow-Credentials': true, 'Content-Type': 'application/json'}
        }
    }

    getAuthorizationHeader = (token) => {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    }

    sendPostRequest(cb, url, params, headers, successCb, failureCb) {
        axios
            .post(url, params, headers)
            .then((response) => { successCb(response); })
            .catch(error => { 
                if (error.response == null)
                    cb("Please check your internet connection!", "warning", null);
                else if (failureCb != null)
                    failureCb(error.response.data.message);
                else 
                    cb(error.response.data.message, "warning", null);
            });
    }

    sendGetRequest(cb, url, params, successCb, failureCb) {
        axios
            .get(url, params)
            .then((response) => { successCb(response); })
            .catch(error => { 
                if (error.response == null)
                    cb("Please check your internet connection!", "warning", null);
                else if (failureCb != null)
                    failureCb(error.response.data.message);
                else 
                    cb(error.response.data.message, "warning", null);
            });
    }

    sendPutRequest(cb, url, params, headers, successCb, failureCb) {
        axios
            .put(url, params, headers)
            .then((response) => { successCb(response); })
            .catch(error => { 
                if (error.response == null)
                    cb("Please check your internet connection!", "warning", null);
                else if (failureCb != null)
                    failureCb(error.response.data.message);
                else 
                    cb(error.response.data.message, "warning", null);
            });
    }
}

export default new Requests();
