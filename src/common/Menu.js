import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { homeUrls, shopUrls, accountUrls, homeUrl } from 'utils/url'
import { Navbar, Nav, Form, FormControl, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from "react-router-bootstrap"
import Logo from 'assets/images/gavel-icon.ico'
import { userIsLoggedIn } from 'api/auth'
import NotificationBell from 'common/NotificationBell'

function Menu(props) {

    const [initialSearch, setInitialSearch] = useState("");
    const [show, setShow] = useState(false);

    const showDropdown = (e)=>{
        setShow(!show);
    }
    const hideDropdown = e => {
        setShow(false);
    }

    const handleSearch = event => {
        event.preventDefault();
        const formData = new FormData(event.target),
        formDataObj = Object.fromEntries(formData.entries());
        if (props.handleSearchChange) props.handleSearchChange(formDataObj.search);
    }

    useEffect(() => {
        if (props.initial) setInitialSearch(props.initial);
    }, [props]);

    const handleMyAccountDropdown = option => {

        if (props.location.state && props.location.state.activeKey) {
            props.handleTabChange(option);
            return;
        }

        props.history.push({
            pathname: '/my-account/' + option,
            state: { activeKey: option }
        });
    }

    const handleDropdownClick = (event) => {
        event.preventDefault();
        if (event.target.className.includes("dropdown-toggle")) {
            props.history.push({
                pathname: '/my-account/profile',
                state: { activeKey: "profile" }
            });
        }
    }

    return (
        <div className="menuContainer">
            <Navbar>
                <LinkContainer to="/">
                    <Navbar.Brand>
                        <div className="logo">
                            <img src={Logo} alt="Svg Gavel Icon" /> 
                            AUCTION
                        </div>
                    </Navbar.Brand>
                </LinkContainer>
                <Form noValidate inline onSubmit={handleSearch}>
                    <FormControl type="text" name="search" placeholder="Try enter: Shoes" defaultValue={props.initial} className="mr-sm-2" />
                    <i className="fa fa-search" aria-hidden="true"></i>
                </Form>
                <Nav className="mr-auto" defaultActiveKey="/my-account">
                    <LinkContainer to={homeUrl} exact>
                        <Nav.Link active={homeUrls.some(v => v == window.location.pathname)}>HOME</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/shop">
                        <Nav.Link active={shopUrls.some(v => v == window.location.pathname) || window.location.pathname.includes("/single-product")}>SHOP</Nav.Link>
                    </LinkContainer>
                    <NavDropdown title="MY ACCOUNT" id="nav-dropdown" active={accountUrls.some(v => v == window.location.pathname)} show={show}
                        onMouseEnter={showDropdown} 
                        onMouseLeave={hideDropdown}
                        onClick={handleDropdownClick}>
                        <NavDropdown.Item eventKey="profile"  onClick={() => handleMyAccountDropdown("profile")}  active={props.location.state && props.location.state.activeKey && props.location.state.activeKey=="profile"}> Profile</NavDropdown.Item>
                        <NavDropdown.Item eventKey="seller"   onClick={() => handleMyAccountDropdown("seller")}   active={props.location.state && props.location.state.activeKey && props.location.state.activeKey=="seller"}>  Become Seller</NavDropdown.Item>
                        <NavDropdown.Item eventKey="bids"     onClick={() => handleMyAccountDropdown("bids")}     active={props.location.state && props.location.state.activeKey && props.location.state.activeKey=="bids"}>    Your Bids</NavDropdown.Item>
                        <NavDropdown.Item eventKey="wishlist" onClick={() => handleMyAccountDropdown("wishlist")} active={props.location.state && props.location.state.activeKey && props.location.state.activeKey=="wishlist"}>Wishlist</NavDropdown.Item>
                        <NavDropdown.Item eventKey="settings" onClick={() => handleMyAccountDropdown("settings")} active={props.location.state && props.location.state.activeKey && props.location.state.activeKey=="settings"}>Settings</NavDropdown.Item>
                    </NavDropdown>
                    {userIsLoggedIn() ? <NotificationBell {...props}/> : null}
                </Nav>
            </Navbar>
        </div>
    )
}

export default withRouter(Menu);
