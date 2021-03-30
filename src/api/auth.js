import React from 'react'
import axios from 'axios'
import { hostUrl } from '../utils/url'

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

function clearCookie(name, domain, path){
    var domain = domain || document.domain;
    var path = path || "/";
    document.cookie = name + "=; expires=" + +new Date + "; domain=" + domain + "; path=" + path;
};

//clearCookie("refreshToken", ".reddit.com", "/")  

class Auth extends React.Component {

    constructor() {
        super();
    }

    extractUser = data => {
        let user = {
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            birthDate: data.birthDate,
            phoneNumber: data.phoneNumber,
            roles: []
        }
        for (let i = 0; i < data.roles.length; i++) {
            let role = data.roles[i];
            user.roles.push(role.name);
        }
        return user;
    }

    authenticate = (url, parameters, cb) => {
        axios
            .post(url, parameters, {
                headers: {"Access-Control-Allow-Origin": "*", 'Access-Control-Allow-Credentials':true, 'Content-Type': 'application/json'}})
            .then((response) => {
                if (response.data.length === 0) {
                    cb("Something went wrong!", "warning");
                    return;
                }
                let user = this.extractUser(response.data.user);
                setUserSession(user);
                cb(null, null, response.data.jwt);})
            .catch(error => {
                if (error.response == null)
                    cb("Please check your internet connection!", "warning", null);
                else
                    cb(error.response.data.message, "warning", null);
            });
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
        removeUserSession();
        cb();
    }

    register(cb, values) {
        let url = hostUrl + '/register';
        let parameters = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password
        };
        this.authenticate(url, parameters, cb);
    }
}

export default new Auth();
