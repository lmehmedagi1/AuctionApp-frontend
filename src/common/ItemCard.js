import React from 'react'
import { Link } from 'react-router-dom'

function ItemCard(props) {
    return (
        <div className="itemCard">
            <Link to={props.product.url}>
                <div className="itemImage">
                    <img src={props.product.image}/>
                </div>
                <div className="itemName">
                    {props.product.name}
                </div>
                <div className="itemPrice">
                    Start from ${props.product.startingPrice}
                </div>
            </Link>
        </div>
    )
}

export default ItemCard;
