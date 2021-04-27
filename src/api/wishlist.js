import React from 'react'
import { hostUrl } from 'utils/url'
import Requests from 'api/requests'
import auth from 'api/auth'

class Wishlist extends React.Component {

    constructor() {
        super();
    }

    sendGetUserWishlistRequest = (cb, token, params) => {
        Requests.sendGetRequest(cb, hostUrl + "/wishlist", Requests.getAuthorizationHeader(token), (response) => { cb(null, null, response.data); }, null);
    }

    sendIsItemInWishlistGetRequest = (cb, token, params) => {
        let parameters = {
            params: params, 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        Requests.sendGetRequest(cb, hostUrl + "/wishlist/item", parameters, (response) => { cb(null, null, response.data); }, null);
    }
    
    sendAddNewWishlistItemRequest = (cb, token, params) => {
        Requests.sendPostRequest(cb, hostUrl + "/wishlist", params, Requests.getAuthorizationHeader(token), 
            (response) => { cb(response.data, "success", null); }, null
        );
    }

    sendRemoveWishlistItemRequest = (cb, token, params) => {
        let parameters = {
            params: params,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        Requests.sendDeleteRequest(cb, hostUrl + "/wishlist", parameters, (response) => { cb(response.data, "success", null); }, null);
    }

    getUserWishlist = (cb, params, token, setToken) => {
        auth.forwardRequest(cb, params, token, setToken, this.sendGetUserWishlistRequest);
    }

    removeWishlistItem = (cb, params, token, setToken) => {
        auth.forwardRequest(cb, params, token, setToken, this.sendRemoveWishlistItemRequest);
    }

    isItemInWishlist = (cb, params, token, setToken) => {
        auth.forwardRequest(cb, params, token, setToken, this.sendIsItemInWishlistGetRequest);
    }

    addNewWishlistItem = (cb, params, token, setToken) => {
        auth.forwardRequest(cb, params, token, setToken, this.sendAddNewWishlistItemRequest);
    }
}

export default new Wishlist();
