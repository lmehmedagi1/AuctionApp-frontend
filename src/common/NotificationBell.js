import React, { useEffect, useState } from 'react'
import { NavDropdown, Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { notificationSoundUrl } from 'utils/constants'
import notificationsApi from 'api/notifications'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { hostUrl } from 'utils/url'
import auth, { getUser } from 'api/auth'

import { timestampToDateTime } from 'utils/converters'

function NotificationBell(props) {

    const [notifications, setNotifications] = useState([]);
    const [notificationsCount, setNotificationsCount] = useState(0);

    const [show, setShow] = useState(false);

    const notificationSound = new Audio(notificationSoundUrl);

    useEffect(() => {
        const socket = new SockJS(hostUrl + '/ws');
        const stompClient = Stomp.over(socket);
        stompClient.debug = null;

        stompClient.connect({}, () => {
            if (stompClient.connected)
                stompClient.subscribe('/topic/' + getUser().id, (notif) => {
                    receiveNotification(JSON.parse(notif.body))
                });
        });

        if (notifications.length == 0) fetchNotifications();
    }, []);

    useEffect(() => {
        if (notificationsCount == 0)
            document.title = "Auction App";
        else
            document.title = "(" + notificationsCount + ") Auction App";
    }, [notificationsCount]);

    const receiveNotification = (notification) => {
        let oldNotifications = notifications;
        oldNotifications.unshift(notification);
        setNotifications(oldNotifications);
        setNotificationsCount(c => c + 1);
        notificationSound.play();
    }

    const fetchNotifications = () => {
        notificationsApi.getUserNotifications((message, variant, data) => {
            if (data == null) data = [];
            setNotifications(data);
            setNotificationsCount(data.filter(x => x.read == false).length);
        }, props.getToken(), props.setToken);
    }

    const markNotification = (notification, cb) => {
        notificationsApi.markNotificationAsReadOrUnread((message, variant, data) => {if (cb != null) cb();}, {notificationId: notification.id}, props.getToken(), props.setToken);
        let oldNotification = notification;
        if (oldNotification.read) setNotificationsCount(c => c + 1);
        else setNotificationsCount(c => c - 1);
        oldNotification.read = !notification.read;
        let oldNotifications = notifications.filter(x => {if (notification.id == x.id) return oldNotification; else return x; });
        setNotifications(oldNotifications);
    }

    const markAllAsRead = () => {
        notificationsApi.markAllAsRead((message, variant, data) => {}, {}, props.getToken(), props.setToken);
        let oldNotifications = notifications.filter(x => {if (x.read == false) {
            let newNotification = x;
            newNotification.read = true;
            return newNotification;
        } return x; });
        setNotifications(oldNotifications);
        setNotificationsCount(0);
    }

    const getBellIcon = () => {
        return <div className="bellIcon">
            <div><i className="fa fa-bell" aria-hidden="true"/></div>
            <div className="count">{notificationsCount > 9 ? "9+" : notificationsCount}</div>
        </div>
    }

    const notificationSelected = (notification) => {
        markNotification(notification, () => {
            if (props.updateProduct == null)
                props.history.push({
                    pathname: '/single-product/' + notification.productId
                });
            else props.updateProduct();
        });
    }

    return (
        <div className="notificationBellContainer">
            <NavDropdown title={getBellIcon()} id="nav-dropdown" show={show}
                onMouseEnter={() => {setShow(true);}} 
                onMouseLeave={() => {setShow(false);}}
                onClick={() => {setShow(true);}} 
                >
                    {notifications.length == 0 ? "No notifications yet." :
                    notifications.map((notification, index) => (
                        <NavDropdown.Item eventKey={index}  onClick={() => notificationSelected(notification)}>
                            <div className={notification.read ? "notification" : "notification unread"}>
                                <div className="content">
                                <h2>{notification.content}</h2>
                                <h3>{timestampToDateTime(notification.time)}</h3>
                                </div>
                                <div>
                                <OverlayTrigger
                                placement="bottom"
                                overlay={
                                    <Tooltip id="button-tooltip-2">Mark as {notification.read ? "un" : ""}read</Tooltip>
                                }
                                >
                                    <button><i onClick={(event) => { event.stopPropagation(); markNotification(notification, null);}} className={notification.read ? "fa fa-envelope" : "fa fa-envelope-open"} aria-hidden="true"/></button>
                                </OverlayTrigger>
                                </div>
                            </div>
                        </NavDropdown.Item>
                    ))}
                    {notificationsCount > 0 ? <button className="markAllButton" onClick={markAllAsRead}> Mark all as read </button> : null}
            </NavDropdown>
        </div>
    )
}

export default NotificationBell;
