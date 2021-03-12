import React from 'react'
import { Link } from 'react-router-dom'
import { loginUrl, registerUrl } from '../utils/url'

function Header() {
    return (
        <div className="headerContainer">
            <div id="headerColumnLeft">
                <div>
                    <a className="fa fa-facebook" rel="noopener noreferrer" target="_blank" href="https://www.facebook.com/AtlantBH"></a>
                    <a className="fa fa-instagram" rel="noopener noreferrer" target="_blank" href="https://www.instagram.com/atlantbh"></a>
                    <a className="fa fa-twitter" rel="noopener noreferrer" target="_blank" href="https://twitter.com/atlantbh"></a>
                    <a className="fa fa-google-plus" rel="noopener noreferrer" target="_blank" href="mailto:auctionapp.atlantbh@gmail.com"></a>
                </div>
            </div>
            <div id="headerColumnRight">
                <div>
                <Link className="headerLink" to={loginUrl}>
                    Login
                </Link>
                <span> or </span>
                <Link className="headerLink" to={registerUrl}>
                    Create an Account
                </Link>
                </div>
            </div>
        </div>
    )
}

export default Header;
