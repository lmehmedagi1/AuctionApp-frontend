import React, { useState, useEffect } from 'react'
import { homeUrls, shopUrls, accountUrls, homeUrl } from '../utils/url'
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap'
import { LinkContainer } from "react-router-bootstrap"
import Logo from '../assets/images/gavel-icon.ico'

function Menu(props) {

    const [initialSearch, setInitialSearch] = useState("");

    const handleSearch = event => {
        event.preventDefault();
        const formData = new FormData(event.target),
        formDataObj = Object.fromEntries(formData.entries());
        if (props.handleSearchChange) props.handleSearchChange(formDataObj.search);
    }

    useEffect(() => {
        if (props.initial) setInitialSearch(props.initial);
    }, [props]);

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
                    <FormControl type="text" name="search" placeholder="Try enter: Shoes" defaultValue={initialSearch} className="mr-sm-2" />
                    <i className="fa fa-search" aria-hidden="true"></i>
                </Form>
                <Nav className="mr-auto" defaultActiveKey="/my-account">
                    <LinkContainer to={homeUrl} exact>
                        <Nav.Link active={homeUrls.some(v => v == window.location.pathname)}>HOME</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/shop">
                        <Nav.Link active={shopUrls.some(v => v == window.location.pathname)}>SHOP</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/my-account">
                        <Nav.Link active={accountUrls.some(v => v == window.location.pathname)}>MY ACCOUNT</Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar>
        </div>
    )
}

export default Menu;
