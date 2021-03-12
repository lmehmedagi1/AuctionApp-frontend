import React from 'react'
import { homeUrls, shopUrls, accountUrls, homeUrl } from '../utils/url'
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap'
import { LinkContainer } from "react-router-bootstrap"
import Logo from '../assets/images/gavel-icon.ico'

const handleSearch = value => {
    console.log(value);
    
}

function Header() {
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
                <Form inline>
                    <FormControl type="text" placeholder="Try enter: Shoes" className="mr-sm-2" onChange={handleSearch} />
                    <i className="fa fa-search" aria-hidden="true"></i>
                </Form>
                <Nav className="mr-auto" defaultActiveKey="/my-account">
                    <LinkContainer to={homeUrl} exact>
                        <Nav.Link active={homeUrls.some(v => v == window.location.pathname)}>HOME</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/about-us">
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

export default Header;
