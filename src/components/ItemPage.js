import React from 'react'

import Menu from '../common/Menu'
import Breadcrumb from '../common/Breadcrumbs'
import Alert from '../common/Alert'

import productsApi from "../api/products"

import { handleAlerts } from '../utils/handlers'
import { timeDifference } from '../utils/calc'

class ItemPage extends React.Component {

    constructor() {
        super();

        this.state = { images: [], activeImage: "", show: false, message: "", variant: "", product: {} };
    }

    componentDidMount() {
        productsApi.getProductById((message, variant, data) => {
            handleAlerts(this.setShow, this.setMessage, this.setVariant, this.setProduct, message, variant, data);
        }, window.location.pathname.split('/').pop());
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
        let images = [];
        if (!product.images.length)
            images.push("https://www.firstfishonline.com/wp-content/uploads/2017/07/default-placeholder-700x700.png");
        for (let i = 0; i < product.images.length; i++)
            images.push(product.images[i].url);
        let highestBid = 0;
        for (let i = 0; i < product.bids.length; i++)
            if (product.bids[i].price > highestBid) highestBid = product.bids[i].price;
        
        let timeLeft = timeDifference((new Date(product.endDate)).getTime(), Date.now());
        let newProduct = {
            title: product.name, 
            startingPrice: product.startingPrice, 
            highestBid: highestBid, 
            numberOfBids: product.bids.length,
            timeLeft: timeLeft,
            details: product.details,
            category: product.category
        }
        this.setState({images: images, activeImage: images[0], product: newProduct});
    }

    activeImageChange = index => {
        this.setState({activeImage: this.state.images[index]});
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
                                    <div className="landingPageProduct" onClick={() => this.activeImageChange(index)}>
                                        <img src={image} alt="Image"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="productInfo">
                            <h1>{this.state.product.title}</h1>
                            <h2>Start from - ${this.state.product.startingPrice}</h2>
                            <p>Highest bid: <span>${this.state.product.highestBid}</span></p>
                            <p>No bids: {this.state.product.numberOfBids}</p>
                            <p>Time left: {this.state.product.timeLeft} days</p>
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
