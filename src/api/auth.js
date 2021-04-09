import React from 'react'
import { hostUrl } from '../utils/url'
import Requests from './requests'

// return the user data from the session storage
export const getUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    else return null;
}

// remove the user from the session storage
export const removeUserSession = () => {
    localStorage.removeItem('user');
}

// set the user from the session storage
export const setUserSession = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
}

// check if user is logged in
export const userIsLoggedIn = () => {
    return localStorage.getItem('user') != null;
}

class Auth extends React.Component {

    constructor() {
        super();
    }

    forwardRequest = (cb, params, token, setToken, functionCb) => {
        if (token == null || token == "") 
            this.refreshToken(cb, token, setToken, params, functionCb);
        else 
            functionCb(cb, token, params);
    }

    refreshToken = (cb, token, setToken, params, successCb) => {

        Requests.sendPostRequest(cb, hostUrl + "/refresh-token", {}, Requests.getCookieHeader(), 
            (response) => { 
                token = response.data;
                setToken(token);
                successCb(cb, token, params);
            },  
            (message) => {
                removeUserSession();
                cb("Your session has expired, log in again!", "warning", null);
                return;
            }
        );
    }

    extractUser = data => {
        let user = {
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            birthDate: data.birthDate,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            roles: [],
            street: data.street,
            city: data.city,
            zipcode: data.zipcode,
            state: data.state,
            country: data.country
        }
        for (let i = 0; i < data.roles.length; i++) {
            let role = data.roles[i];
            user.roles.push(role.name);
        }
        return user;
    }

    authenticate = (url, parameters, cb) => {

        Requests.sendPostRequest(cb, url, parameters, Requests.getCookieHeader(), 
            (response) => {
                if (response.data.length === 0) {
                    cb("Something went wrong!", "warning");
                    return;
                }
                let user = this.extractUser(response.data.user);
                setUserSession(user);
                cb(null, null, response.data.jwt);
            }, null);
    }

    login(cb, values) {
        let url = hostUrl + '/login';
        let parameters = {
            email: values.email,
            password: values.password
        };
        this.authenticate(url, parameters, cb);
    }

    logout(cb) {
        Requests.sendPostRequest(cb, hostUrl + '/logout-user', "{}", Requests.getCookieHeader(), 
        (response) => { removeUserSession(); cb(); }, 
        (error) => { removeUserSession(); cb(); });
    }

    register(cb, values) {
        let url = hostUrl + '/register';
        let parameters = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            gender: 'Male',
            password: values.password
        };
        this.authenticate(url, parameters, cb);
    }

    sendGetCheckIfUserIsSeller = (cb, token, params) => {
        Requests.sendGetRequest(cb, hostUrl + "/user/seller", Requests.getAuthorizationHeader(token), (response) => { cb(null, null, response.data); }, null);
    }

    sendPutDeactivateAccount = (cb, token, params) => {
        Requests.sendPutRequest(cb, hostUrl + "/user/deactivate", "{}", Requests.getAuthorizationHeader(token), 
            (response) => { this.logout(() => { window.location.href="/"; cb(response.data, "success", null); })}, null);
    }

    checkIfUserIsSeller = (cb, token, setToken) => {
        this.forwardRequest(cb, {}, token, setToken, this.sendGetCheckIfUserIsSeller);
    }

    deactivateAccount = (cb, token, setToken) => {
        this.forwardRequest(cb, {}, token, setToken, this.sendPutDeactivateAccount);
    }
}

export default new Auth();
