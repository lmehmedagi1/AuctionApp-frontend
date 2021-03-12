import React from 'react'
import { Link } from 'react-router-dom'
import { ToggleButtonGroup, ToggleButton, ListGroup, Button } from 'react-bootstrap'

import Menu from '../common/Menu'
import Breadcrumb from '../common/Breadcrumbs'
import Alert from '../common/Alert'

import productsApi from "../api/products"

import { handleAlerts } from '../utils/handlers'

class ItemPage extends React.Component {

    constructor() {
        super();

        this.state = { images: ["https://i.picsum.photos/id/919/5472/3648.jpg?hmac=FXWoTLe8uCx6rIVzP4Lx4Og7ioZBm6UwypEi0_cDb04", "https://i.picsum.photos/id/951/4472/2803.jpg?hmac=aB6s0hBjWu_NcE75bGn9qnZTRcWSPCdo_qEGo6dzh7k"], activeImage: "https://i.picsum.photos/id/907/6004/3914.jpg?hmac=yHBEBivgu2fOMqkXPaf0DRdT6eW62aTTIw1BWksoeBE", show: false, message: "", variant: "", product: {} };

        // productsApi.getProductByIdAndCategory((message, variant, data) => {
        //     handleAlerts(this.setShow, this.setMessage, this.setVariant, this.setProduct, message, variant, data);
        // }, this.props.match.params.product_id, this.props.match.params.category, this.props.match.params.supercategory);

    }

    componentDidMount() {
        let product = {title: 'Test product', startingPrice: 230, highestBid: 330, numberOfBids: 2, timeLeft: 3, details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."};
        this.setProduct(product);
    }

    setShow = show => {
        this.setState({show: show});
    }

    setMessage = message => {
        this.setState({message: message});
    }

    setVariant = variant => {
        this.setState({variant: variant});
    }

    setProduct = product => {
        this.setState({product: product});
    }

    render() {
        return (
            <div>
                <Menu />
                <Breadcrumb />
                <Alert message={this.state.message} showAlert={this.state.show} variant={this.state.variant} onShowChange={this.setShow} />
                <div className="itemPageContainer">
                    <div className="product">
                        <div className="productImages">
                            <div>
                                <img src={this.state.activeImage} alt="Image"/>
                            </div>
                            <div className="productImagesGrid">
                                {this.state.images.map((image, index) => (
                                    <div className="landingPageProduct">
                                        <img src={image} alt="Image"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="productInfo">
                            <h1>{this.state.product.title}</h1>
                            <h2>Start from - ${this.state.product.startingPrice}</h2>
                            <p>Highest bid: ${this.state.product.highestBid}</p>
                            <p>No bids: ${this.state.product.numberOfBids}</p>
                            <p>Time left: ${this.state.product.timeLeft} days</p>
                            <div className="productDetailsTitle">
                                Details
                            </div>
                            <div className="productDetails">
                                {this.state.product.details}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default ItemPage;
