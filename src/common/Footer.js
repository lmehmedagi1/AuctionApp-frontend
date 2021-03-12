import React from 'react'
import { Link } from 'react-router-dom';
import { aboutUrl, termsAndConditionsUrl, privacyPolicyUrl } from '../utils/url'

function Footer() {
    return (
        <div className="footerContainer">
            <div className="footerColumn">
                <div>
                    AUCTION
                </div>
                <div>
                    <Link className="footerLink" to={aboutUrl}>
                        About Us
                    </Link>
                </div>
                <div>
                    <Link className="footerLink" to={termsAndConditionsUrl}>
                        Terms and Conditions
                    </Link>
                </div>
                <div>
                    <Link className="footerLink" to={privacyPolicyUrl}>
                        Privacy Policy
                    </Link>
                </div>
            </div>
            <div className="footerColumn">
                <div>
                    GET IN TOUCH
                </div>
                <div>
                    Call Us at +123 797-567-2535
                </div>
                <div>
                    support@auction.com
                </div>
                <div>
                    <a className="fa fa-facebook" rel="noopener noreferrer" target="_blank" href="https://www.facebook.com/AtlantBH"></a>
                    <a className="fa fa-instagram" rel="noopener noreferrer" target="_blank" href="https://www.instagram.com/atlantbh"></a>
                    <a className="fa fa-twitter" rel="noopener noreferrer" target="_blank" href="https://twitter.com/atlantbh"></a>
                    <a className="fa fa-google-plus" rel="noopener noreferrer" target="_blank" href="mailto:auctionapp.atlantbh@gmail.com"></a>
                </div>
            </div>
        </div>
    )
}

export default Footer;
