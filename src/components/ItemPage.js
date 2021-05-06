import React from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Form, FormControl } from 'react-bootstrap'

import Menu from 'common/Menu'
import Breadcrumb from 'common/Breadcrumbs'
import Alert from 'common/Alert'
import ItemCard from 'common/ItemCard'
import BidderTable from 'common/BidderTable'
import PaymentModal from 'common/PaymentModal'
import ReceiptModal from 'common/ReceiptModal'

import productsApi from 'api/products'
import bidsApi from 'api/bids'
import paymentsApi from 'api/payments'
import wishlistApi from 'api/wishlist'

import { handleAlerts } from 'utils/handlers'
import { timeDifference } from 'utils/calc'
import { imagePlaceholder } from 'utils/constants'
import ScrollButton from 'utils/ScrollButton'

import { userIsLoggedIn, getUser } from 'api/auth'

class ItemPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = { 
            images: [], 
            activeImage: "", 
            show: false, 
            message: "", 
            variant: "",
            product: {}, 
            bidInput: "", 
            recommendedProducts: [], 
            loading: false,
            showPaymentModal: false,
            showReceiptModal: false,
            receipt: {},
            alreadyPaid: false,
            inWishlist: false
        };
    }

    componentDidMount() {
        this.fetchProduct();
    }

    fetchProduct = () => {
        this.setState({loading: true});
        productsApi.getProductById((message, variant, data) => {
            handleAlerts(this.setShow, this.setMessage, this.setVariant, this.setProduct, message, variant, data);
            this.setState({loading: false});
        }, window.location.pathname.split('/').pop());
    }

    fetchReceipt = (productId) => {
        paymentsApi.getReceipt((message, variant, data) => {
            if (message == null) {
                this.setState({receipt: data, alreadyPaid: true});
            }
        }, {productId: productId}, this.props.getToken(), this.props.setToken);
    }

    isInWishlist = (productId) => {
        wishlistApi.isItemInWishlist((message, variant, data) => {
            if (message == null) {
                this.setState({inWishlist: data});
            }
        }, {productId: productId}, this.props.getToken(), this.props.setToken);
    }

    setShow = show => {
        this.setState({show: show});
    }

    setMessage = message => {
        this.setState({message: message});
    }

    setVariant = variant => {
        this.setState({variant: variant});
        if (variant === "success") {
            productsApi.getProductById((message, variant, data) => {
                this.setProduct(data);
            }, window.location.pathname.split('/').pop());
        }
    }

    setRecommendedProducts = data => {
        this.setState({recommendedProducts: data});
    }

    setProduct = product => {

        if (this.state.recommendedProducts.length == 0)
            productsApi.getRecommendedProducts((message, variant, data) => {
                handleAlerts(this.setShow, this.setMessage, this.setVariant, this.setRecommendedProducts, message, variant, data);
            }, {id: product.id});

        this.fetchReceipt(product.id);
        this.isInWishlist(product.id);

        let images = [];
        if (!product.images.length)
            images.push(imagePlaceholder);
        for (let i = 0; i < product.images.length; i++)
            images.push('data:'+product.images[i].type+';base64,'+product.images[i].url);

        let highestBid = 0;
        let highestBidderId = "";
        for (let i = 0; i < product.bids.length; i++) {
            if (product.bids[i].price > highestBid) {
                highestBid = product.bids[i].price;
                highestBidderId = product.bids[i].user.id;
            }
        }

        let timeLeft = timeDifference((new Date(product.endDate)).getTime(), Date.now());
        let startTimeLeft = timeDifference((new Date(product.startDate)).getTime(), Date.now());
        if (timeLeft < 0) timeLeft = 0;

        let newProduct = {
            title: product.name, 
            startingPrice: product.startingPrice, 
            highestBid: highestBid, 
            highestBidderId: highestBidderId,
            numberOfBids: product.bids.length,
            timeLeft: timeLeft,
            startTimeLeft: startTimeLeft,
            details: product.details,
            category: product.category,
            id: product.id,
            sellerId: product.seller.id,
            bids: product.bids
        }
        this.setState({images: images, activeImage: images[0], product: newProduct});
    }

    activeImageChange = index => {
        this.setState({activeImage: this.state.images[index]});
    }

    handleSearchChange = search => {
        this.props.history.push({
            pathname: '/shop',
            state: { search: search }
        });
    }

    handleBidSubmit = event => {
        event.preventDefault();
        const formData = new FormData(event.target),
        formDataObj = Object.fromEntries(formData.entries());
        const bid = formDataObj.bid;

        ScrollButton.scrollToTop();

        if (bid <= this.state.product.highestBid)
            handleAlerts(this.setShow, this.setMessage, this.setVariant, null, "There are bids higher than yours. You could give a second try!", "warning", null);
        else if (bid < this.state.product.startingPrice) 
            handleAlerts(this.setShow, this.setMessage, this.setVariant, null, "Starting price is higher than your bid. You could give a second try!", "warning", null);
        else {
            this.setState({loading: true});
            bidsApi.bid((message, variant, data) => {
                handleAlerts(this.setShow, this.setMessage, this.setVariant, null, message, variant, data);
                this.setState({loading: false});
            }, {price: bid, productId: this.state.product.id}, this.props.getToken(), this.props.setToken);
        }
    }

    placeBidDescription = () => {

        if (this.state.product.timeLeft <= 0) return "Auction has ended";
        else if (this.state.product.startTimeLeft > 0) return "Auction did not start yet";
        else if (!userIsLoggedIn()) return "You have to be logged in to place bid";
        else if (getUser().id == this.state.product.sellerId) return "You cannot bid on your own item";
        else if (getUser().id == this.state.product.highestBidderId) return "Your bid is already the highest bid";
        
        let minimalBid = 0;
        if (this.state.product.highestBid >= this.state.product.startingPrice) minimalBid = this.state.product.highestBid + 1;
        else minimalBid = this.state.product.startingPrice;

        return "Enter $" + minimalBid + " or more";
    }

    userAlreadyPaid = () => {
        return this.state.alreadyPaid;
    }

    handleClosePaymentModal = () => {
        this.setState({showPaymentModal: false});
    }

    handleCloseReceiptModal = () => {
        this.setState({showReceiptModal: false});
    }

    handlePay = (creditCardInfo) => {
        this.handleClosePaymentModal();
        this.fetchReceipt();
        ScrollButton.scrollToTop();
        handleAlerts(this.setShow, this.setMessage, this.setVariant, null, "Payment successful", "success", null);
    }

    toggleWishlist = () => {
        ScrollButton.scrollToTop();
        this.setState({loading: true});
        this.state.inWishlist ? this.removeItemFromWishlist() : this.addItemToWishlist();
    }

    removeItemFromWishlist = () => {
        wishlistApi.removeWishlistItem((message, variant, data) => {
            this.setState({loading: false});
            if (message == "Wishlist item removed") this.setState({inWishlist: false});
            handleAlerts(this.setShow, this.setMessage, this.setVariant, null, message, variant, null);
        }, {productId: this.state.product.id}, this.props.getToken(), this.props.setToken);
    }

    addItemToWishlist = () => {
        wishlistApi.addNewWishlistItem((message, variant, data) => {
            this.setState({loading: false});
            if (message == "New wishlist item added") this.setState({inWishlist: true});
            handleAlerts(this.setShow, this.setMessage, this.setVariant, null, message, variant, null);
        }, {productId: this.state.product.id}, this.props.getToken(), this.props.setToken);
    }

    render() {
        return (
            <div className={this.state.loading ? "blockedWait" : ""}>
            <div className={this.state.loading ? "blocked" : ""}>
                <Menu handleSearchChange={this.handleSearchChange} {...this.props} updateProduct={this.fetchProduct} />
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
                            {userIsLoggedIn() && this.state.product.timeLeft <= 0 && getUser().id == this.state.product.highestBidderId ?
                            <div>
                            <div className="auctionWonDiv"> Congratulations! You have won the Auction </div>
                            {!this.userAlreadyPaid() ?
                            <button className="payButton" onClick={() => this.setState({showPaymentModal: true})}>PAY NOW</button>
                            :
                            <button className="receiptButton" onClick={() => this.setState({showReceiptModal: true})}>RECEIPT</button>
                            }
                            </div>
                            :
                            <div>
                            <Form inline onSubmit={this.handleBidSubmit}>
                                <FormControl type="text" name="bid" className="mr-sm-2" value={this.state.bidInput} onChange={event => this.setState({bidInput: event.target.value.replace(/[^0-9]+/g,'')})} />
                                <Button variant="primary" type="submit" disabled={!userIsLoggedIn() || getUser().id == this.state.product.sellerId || this.state.product.timeLeft <= 0 || this.state.product.startTimeLeft > 0 || getUser().id == this.state.product.highestBidderId}>
                                    PLACE BID <i className="bi bi-chevron-right"></i>
                                </Button>
                            </Form>
                            <h5>{this.placeBidDescription()}</h5>
                            </div>
                            }
                            <p>Highest bid: <span>${this.state.product.highestBid}</span></p>
                            <p>No bids: {this.state.product.numberOfBids}</p>
                            <p>Time left: {this.state.product.timeLeft} days</p>

                            {userIsLoggedIn() && getUser().id != this.state.product.sellerId ?
                            <div className="wishlistWrapper">
                                <button className={this.state.inWishlist ? "wishlistButton activeBtn" : "wishlistButton"} onClick={() => {this.toggleWishlist();}}>Wishlist <i className={this.state.inWishlist ? "fa fa-heart active" : "fa fa-heart"} aria-hidden="true"></i></button>
                            </div>
                            : null}

                            <div className="productDetailsTitle">
                                Details
                            </div>
                            <div className="productDetails">
                                {this.state.product.details}
                            </div>
                        </div>
                    </div>
                    {userIsLoggedIn() && getUser().id == this.state.product.sellerId ? 
                    <div className="bids">
                        <BidderTable bids={this.state.product.bids}  highestBid={this.state.product.highestBid} />
                    </div>
                    :
                    <div className="recommendedProducts">
                        <div className="recommendedProductsTitle">
                        Related products
                        </div>
                        <div className="itemPageProducts">
                        {this.state.recommendedProducts && this.state.recommendedProducts.map((product, index) => (
                            <div className="itemPageProduct" onClick={() => this.fetchProduct()}>
                                <ItemCard product={product}/>
                            </div>
                        ))}
                        </div>
                    </div>
                    }
                </div>
                <PaymentModal showModal={this.state.showPaymentModal} handleClosePaymentModal={this.handleClosePaymentModal} handlePay={this.handlePay} price={this.state.product.highestBid} productId={this.state.product.id} getToken={this.props.getToken} setToken={this.props.setToken}/>
                <ReceiptModal showModal={this.state.showReceiptModal} handleCloseReceiptModal={this.handleCloseReceiptModal} receipt={this.state.receipt}/>
            </div>
            </div>
        );
    }
}

export default withRouter(ItemPage);
