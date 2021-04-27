import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Tab, Nav, Row, Spinner } from 'react-bootstrap'

import Breadcrumb from 'common/Breadcrumbs'
import Menu from 'common/Menu'
import Alert from 'common/Alert'

import UserProfile from 'components/UserProfile'
import UserBids from 'components/UserBids'
import UserSeller from 'components/UserSeller'
import UserSettings from 'components/UserSettings'
import UserWishlist from 'components/UserWishlist'

import { sellPageUrl } from 'utils/url'
import { getUser } from 'api/auth'

function UserProfilePage(props) {

    const [activeTab, setActiveTab] = useState("profile");
    const [breadcrumbsKey, setBreadcrumbsKey] = useState(7);
    const [tabStateKey, setTabStateKey] = useState(7);

    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [variant, setVariant] = useState("");
    const [loading, setLoading] = useState(true);
    
    const [sellerType, setSellerType] = useState("active");

    useEffect(() => {

        if (getUser() == null) {
            props.history.push({
                pathname: '/login'
            });
            return;
        }

        if (props.location.state) {
            if (props.location.state.activeKey) setActiveTab(props.location.state.activeKey);
            if (props.location.state.sellerType) setSellerType(props.location.state.sellerType);
        }
        updateState(window.location.pathname.split('/').pop());
    }, []);

    const updateState = (active) => {
        if (activeTab == active) return;
        props.history.replace('/my-account/' + active, { activeKey: active, sellerType: sellerType });
        const newKey = breadcrumbsKey * 89;
        setActiveTab(active);
        setBreadcrumbsKey(newKey);
    }

    const handleSearchChange = search => {
        props.history.push({
            pathname: '/shop',
            state: { search: search }
        });
    }

    const handleBecomeSellerButtonClick = () => {
        props.history.push({
            pathname: sellPageUrl
        });
    }

    const handleSellerTabChange = tab => {
        setSellerType(tab);
        props.history.replace('/my-account/' + activeTab, { activeKey: activeTab, sellerType: tab });
        const newKey = tabStateKey * 89;
        setTabStateKey(newKey);
    }

    return (
        <div className={loading ? "blockedWait" : ""}>
        <div className={loading ? "blocked" : ""}>
            <Menu handleSearchChange={handleSearchChange} handleTabChange={updateState}/>
            <Breadcrumb key={breadcrumbsKey} update={updateState}/>
            <Alert message={message} showAlert={show} variant={variant} onShowChange={setShow} />
            <div className="userProfilePageContainer">
            <Tab.Container id="left-tabs-example" defaultActiveKey={activeTab} onSelect={updateState}>
            <Row>
                <Nav variant="tabs">
                    <Nav.Item>
                    <Nav.Link eventKey="profile"  active={activeTab == "profile"}><i className="fa fa-user" aria-hidden="true"/> Profile</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="seller"   active={activeTab == "seller"}><i className="fa fa-list" aria-hidden="true"/> Seller</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="bids"     active={activeTab == "bids"}><i className="fa fa-gavel" aria-hidden="true"/> Bids</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="wishlist" active={activeTab == "wishlist"}><i className="fa fa-gift" aria-hidden="true"/> Wishlist</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="settings" active={activeTab == "settings"}><i className="fa fa-cog" aria-hidden="true"/> Settings</Nav.Link>
                    </Nav.Item>
                    {loading ? <Spinner className="spinner" animation="border" role="status"/> : null}
                </Nav>
            </Row>
            <Row>
                <Tab.Content>
                    <Tab.Pane eventKey="profile"  active={activeTab == "profile"}>
                    <UserProfile setShow={setShow} setMessage={setMessage} setVariant={setVariant} getToken={props.getToken} setToken={props.setToken} setLoading={setLoading}/> 
                    </Tab.Pane>
                    <Tab.Pane eventKey="seller"   active={activeTab == "seller"}>
                    <UserSeller handleSellerTabChange={handleSellerTabChange} sellerType={sellerType} setShow={setShow} setMessage={setMessage} setVariant={setVariant} getToken={props.getToken} setToken={props.setToken} setLoading={setLoading} handleBecomeSellerButtonClick={handleBecomeSellerButtonClick}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="bids"     active={activeTab == "bids"}>
                    <UserBids setShow={setShow} setMessage={setMessage} setVariant={setVariant} getToken={props.getToken} setToken={props.setToken} setLoading={setLoading}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="wishlist" active={activeTab == "wishlist"}>
                    <UserWishlist tab={activeTab} setShow={setShow} setMessage={setMessage} setVariant={setVariant} getToken={props.getToken} setToken={props.setToken} setLoading={setLoading} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="settings" active={activeTab == "settings"}>
                    <UserSettings setShow={setShow} setMessage={setMessage} setVariant={setVariant} getToken={props.getToken} setToken={props.setToken}/>
                    </Tab.Pane>
                </Tab.Content>
            </Row>
            </Tab.Container>
            </div>
        </div>
        </div>
    )
}

export default withRouter(UserProfilePage);
