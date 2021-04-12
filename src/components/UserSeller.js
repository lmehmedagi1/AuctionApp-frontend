import React, { useState, useEffect } from 'react'
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap'

import BidTable from 'common/BidTable'
import authApi from 'api/auth'
import { handleAlerts } from 'utils/handlers'

import ShoppingBag from 'assets/images/shoppingBag.jpg'

function UserSeller(props) {

    const [startedSelling, setStartedSelling] = useState(true);

    useEffect(() => {
        authApi.checkIfUserIsSeller((message, variant, data) => {
            handleAlerts(props.setShow, props.setMessage, props.setVariant, setStartedSelling, message, variant, data);
        }, props.getToken(), props.setToken);
    }, []);

    return (
        <div className="userSellerContainer">
            {!startedSelling ? 
            <div className="startSellingCard">
                <div className="title"><p>SELL</p></div>
                <div className="body">
                    <div><img src={ShoppingBag} alt="Shopping bag icon" /></div>
                    <p>You do not have any scheduled items for sale.</p>
                    <button>START SELLING <i className="bi bi-chevron-right"></i></button>    
                </div>
            </div>
            :
            <div>
            <div className="sellerTabHeader">
                <div className="toggleStyle">
                <ToggleButtonGroup type="radio" name="options" value={props.sellerType} onChange={props.handleSellerTabChange}>
                    <ToggleButton value="active">Active</ToggleButton>
                    <ToggleButton value="sold">Sold</ToggleButton>
                </ToggleButtonGroup>
                </div>
                <div className="addItemButton">
                <button><i className="fa fa-plus" aria-hidden="true"></i> ADD ITEM</button>
                </div>
            </div>
            <BidTable tab={props.sellerType} setShow={props.setShow} setMessage={props.setMessage} setVariant={props.setVariant} getToken={props.getToken} setToken={props.setToken} setLoading={props.setLoading}></BidTable>
            </div>
            }
        </div>
    )
}

export default UserSeller;
