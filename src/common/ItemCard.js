import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

function ItemCard(props) {
    return (
        <div className="itemCard">
            <Link to={props.product.url}>
                <div className="itemImage">
                    <img src={props.product.image}/>
                </div>
                <div className="itemInfo">
                <div className="itemName">
                    {props.product.name}
                </div>
                <div className="itemDetails">
                    {props.product.details}
                </div>
                <div className="itemPrice">
                    Start from ${props.product.startingPrice}
                </div>
                <div className="itemButtons">
                    <Button variant="primary" type="submit">
                        Bid <i className="fa fa-gavel" aria-hidden="true"></i>
                    </Button>
                </div>
                </div>
            </Link>
        </div>
    )
}

export default ItemCard;
