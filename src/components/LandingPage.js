import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { ToggleButtonGroup, ToggleButton, ListGroup, Button } from 'react-bootstrap'

import ItemCard from 'common/ItemCard'
import Menu from 'common/Menu'
import Alert from 'common/Alert'

import categoriesApi from "api/categories"
import productsApi from "api/products"
import { userIsLoggedIn } from "api/auth"

import { handleAlerts } from 'utils/handlers'

class LandingPage extends React.Component {

    constructor() {
        super();
        this.state = { categories: [], newArrivals: [], lastChances: [], products: [], title: "", show: false, message: "", variant: "" };
    }

    componentDidMount() {
        categoriesApi.getMainCategories((message, variant, data) => {
            if (data == null) data = [];
            this.handleResponse(this.setCategories, message, variant, data);
            data.push({name: "All categories", url: "/shop/all"});
            this.setCategories(data);
        });

        productsApi.getNewArrivals((message, variant, data) => {
            this.handleResponse(this.setNewArrivals, message, variant, data);
            this.setState({products: this.state.newArrivals});
        });

        productsApi.getLastChance((message, variant, data) => {
            this.handleResponse(this.setLastChances, message, variant, data);
        });
    }

    toggleButtonChange = value => {
        switch (value) {
            case 1:
                this.setState({products: this.state.newArrivals});
                break;
            case 2:
                this.setState({products: this.state.lastChances});
                break;
            default:
                break;
        }
    }

    handleResponse = (setter, message, variant, data) => {
        if (data == null) data = [];
        handleAlerts(this.setShow, this.setMessage, this.setVariant, setter, message, variant, data);
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

    setCategories = categories => {
        this.setState({categories: categories});
    }

    setNewArrivals = newArrivals => {
        this.setState({newArrivals: newArrivals});
    }

    setLastChances = lastChances => {
        this.setState({lastChances: lastChances});
    }

    routeChange = url => {
        this.props.history.push(url);
    }

    handleSearchChange = search => {
        this.props.history.push({
            pathname: '/shop',
            state: { search: search }
        });
    }

    render() {
        return (
            <div>
                <Menu handleSearchChange={this.handleSearchChange} {...this.props}/>
                <Alert message={this.state.message} showAlert={this.state.show} variant={this.state.variant} onShowChange={this.setShow} />
                <div className="landingPageContainer">
                    <div className="landingPageHeader">
                        <div className="landingPageCategoriesList">
                            <p>CATEGORIES</p>
                            <ListGroup>
                                {this.state.categories.map((category, index) => (
                                    <Link to={{state: {supercategory: category.id, supercategoryName: category.name}, pathname: "/shop"}}>
                                        <ListGroup.Item key={index}>{category.name}</ListGroup.Item>
                                    </Link>
                                ))}
                            </ListGroup>
                        </div>
                        <div className="landingPageHeaderProduct">
                            {this.state.products.length > 0 ? 
                            <div className="headerProduct">
                                <div className="headerProductInfo">
                                    <h1>{this.state.products[0].name}</h1>
                                    <h2>Start from - ${this.state.products[0].startingPrice}</h2>
                                    <h3>{this.state.products[0].details}</h3>
                                    <div>
                                    {userIsLoggedIn() ? 
                                    <Button variant="primary" type="submit" onClick={() => this.routeChange(this.state.products[0].url)}>
                                        BID NOW <i className="bi bi-chevron-right"></i>
                                    </Button>
                                    : null}
                                    </div>
                                        
                                </div>
                                <div className="headerProductImage">
                                    <img src={this.state.products[0].image} alt="Header product" /> 
                                </div>
                            </div>
                            : null}
                        </div>
                    </div>
                    <div className="toggleGroup">
                        <ToggleButtonGroup type="radio" name="options" defaultValue={1} onChange={this.toggleButtonChange}>
                            <ToggleButton value={1}>New Arrivals</ToggleButton>
                            <ToggleButton value={2}>Last Chance</ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <div className="landingPageProducts">
                        {this.state.products.map((product, index) => (
                            <div className="landingPageProduct">
                                <ItemCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(LandingPage);
