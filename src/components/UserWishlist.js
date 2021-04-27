import React from 'react'
import BidTable from 'common/BidTable'

function UserWishlist(props) {

    return (
        <div className="userWishlistContainer">
            <BidTable tab={props.tab} setShow={props.setShow} setMessage={props.setMessage} setVariant={props.setVariant} getToken={props.getToken} setToken={props.setToken} setLoading={props.setLoading}></BidTable>
        </div>
    )
}

export default UserWishlist;
