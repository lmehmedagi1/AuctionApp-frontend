import React from 'react'
import { hostUrl } from 'utils/url'
import Requests from 'api/requests'
import auth from 'api/auth'

class Ratings extends React.Component {

    constructor() {
        super();
    }

    sendGetUserSellerRatingRequest = (cb, token, params) => {
        let parameters = {
            params: params, 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        Requests.sendGetRequest(cb, hostUrl + "/rating", parameters, (response) => { cb(null, null, response.data); }, null);
    }
    
    sendLeaveSellerRatingRequest = (cb, token, params) => {
        Requests.sendPutRequest(cb, hostUrl + "/rating", params, Requests.getAuthorizationHeader(token), 
            (response) => { cb(response.data, "success", null); }, null
        );
    }

    getSellerRatings = (cb, params) => {
        let parameters = {
            params: params
        };
        Requests.sendGetRequest(cb, hostUrl + "/ratings", parameters, (response) => { cb(null, null, response.data); }, null);
    }

    getUserSellerRatings = (cb, params, token, setToken) => {
        auth.forwardRequest(cb, params, token, setToken, this.sendGetUserSellerRatingRequest);
    }

    leaveSellerRating = (cb, params, token, setToken) => {
        auth.forwardRequest(cb, params, token, setToken, this.sendLeaveSellerRatingRequest);
    }
}

export default new Ratings();
