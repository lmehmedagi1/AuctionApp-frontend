import React from 'react'
import Logo from '../assets/images/gavel-icon.ico'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { homeUrl } from '../utils/url'

function NotFound() {
    return (
        <div>
            <div className="notFoundContainer">
                <Link className="footerLink" to={homeUrl}>
                    <div className="logo">
                        <img src={Logo} alt="Svg Gavel Icon" /> 
                        AUCTION
                    </div>
                </Link>
                <p id="errorCode">
                    404
                </p>
                <div>
                    Ooops! Looks like this page is Not Found!
                </div>
                <div>
                    <Button variant="primary" type="submit" onClick={() => window.location.href=homeUrl}>
                        GO BACK
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NotFound;
