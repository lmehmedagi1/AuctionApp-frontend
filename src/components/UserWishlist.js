import React from 'react'
import { Table } from 'react-bootstrap'

function UserWishlist(props) {

    return (
        <div className="userWishlistContainer">
            <Table className="emptyTable">
            <thead>
                <tr><th>Item</th><th>Name</th><th>Time left</th><th>Highest bid</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
                <tr><td>No items yet</td></tr>
            </tbody>
            </Table>
        </div>
    )
}

export default UserWishlist;
