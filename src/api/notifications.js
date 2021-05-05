import React from 'react'
import { hostUrl } from 'utils/url'
import Requests from 'api/requests'
import auth from 'api/auth'

class Notifications extends React.Component {

    constructor() {
        super();
    }

    sendGetUserNotificationsRequest = (cb, token, params) => {
        Requests.sendGetRequest(cb, hostUrl + "/notifications", Requests.getAuthorizationHeader(token), (response) => { cb(null, null, response.data); }, null);
    }
    
    sendMarkNotificationAsReadRequest = (cb, token, params) => {
        Requests.sendPostRequest(cb, hostUrl + "/notification/mark", params, Requests.getAuthorizationHeader(token), 
            (response) => { cb(response.data, "success", null); }, null
        );
    }

    sendMarkAllAsReadRequest = (cb, token, params) => {
        Requests.sendPostRequest(cb, hostUrl + "/notifications/read", params, Requests.getAuthorizationHeader(token), 
            (response) => { cb(response.data, "success", null); }, null
        );
    }

    getUserNotifications = (cb, token, setToken) => {
        auth.forwardRequest(cb, {}, token, setToken, this.sendGetUserNotificationsRequest);
    }

    markAllAsRead = (cb, token, setToken) => {
        auth.forwardRequest(cb, {}, token, setToken, this.sendMarkAllAsReadRequest);
    }

    markNotificationAsReadOrUnread = (cb, params, token, setToken) => {
        auth.forwardRequest(cb, params, token, setToken, this.sendMarkNotificationAsReadRequest);
    }
}

export default new Notifications();
