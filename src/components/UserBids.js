import React from 'react'

import BidTable from 'common/BidTable'

function UserBids(props) {

    return (
        <div className="userBidsContainer">
            <BidTable tab="bids" setShow={props.setShow} setMessage={props.setMessage} setVariant={props.setVariant} getToken={props.getToken} setToken={props.setToken} setLoading={props.setLoading}></BidTable>
        </div>
    )
}

export default UserBids;
