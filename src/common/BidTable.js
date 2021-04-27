import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'

import { timeDifference } from 'utils/calc'
import { handleAlerts } from 'utils/handlers'

import bidsApi from 'api/bids'
import wishlistApi from 'api/wishlist'

function BidTable(props) {

    const [bids, setBids] = useState([]);

    useEffect(() => {
        props.setLoading(true);
        switch (props.tab) {
            case "bids":
                bidsApi.getMyBids((message, variant, data) => {
                    handleAlerts(props.setShow, props.setMessage, props.setVariant, setBids, message, variant, data);
                    props.setLoading(false);
                }, props.getToken(), props.setToken);
                break;
            case "sold":
                bidsApi.getMySoldBids((message, variant, data) => {
                    handleAlerts(props.setShow, props.setMessage, props.setVariant, setBids, message, variant, data);
                    props.setLoading(false);
                }, props.getToken(), props.setToken);
                break;
            case "active":
                bidsApi.getMyActiveBids((message, variant, data) => {
                    handleAlerts(props.setShow, props.setMessage, props.setVariant, setBids, message, variant, data);
                    props.setLoading(false);
                }, props.getToken(), props.setToken);
                break;
            case "wishlist":
                wishlistApi.getUserWishlist((message, variant, data) => {
                    handleAlerts(props.setShow, props.setMessage, props.setVariant, setBids, message, variant, data);
                    props.setLoading(false);
                }, props.getToken(), props.setToken);
                break;
            default:
                break;
        }
    }, [props.tab]);

    const columns = [
        {
            dataField: 'product.details',
            text: 'Item',
            formatter: (value, row) => {
                return <div><img src={'data:' + row.product.images[0].type + ';base64,' + row.product.images[0].url}/></div>
            }
        }, {
            dataField: 'product.name',
            text: 'Name'
        }, {
            dataField: 'endDate',
            text: 'Time left',
            formatter: (value, row) => {
                let timeLeft = timeDifference((new Date(row.endDate)).getTime(), Date.now());
                if (timeLeft < 0) timeLeft = 0;
                return timeLeft + " days"
            }
        }, {
            dataField: 'price',
            text: 'Your Price',
            formatter: (value, row) => {
                if (row.price == row.productHighestPrice) return <div style={{ color: 'green' }}>$ {row.price}</div> 
                return <div>$ {row.price}</div>
            }
        }, {
            dataField: 'totalBidsNumber',
            text: 'No. Bids'
        }, {
            dataField: 'productHighestPrice',
            text: 'Highest Bid',
            formatter: (value, row) => {
                if (row.price == row.productHighestPrice) return <div style={{ color: 'green' }}>$ {row.productHighestPrice}</div> 
                return <div style={{ color: '#5B9ED6' }}>$ {row.productHighestPrice}</div>
            }
        }, {
            dataField: 'product.startingPrice',
            text: '',
            formatter: (value, row) => {
                return <Link to={'/my-account/single-product/' + row.product.id}><button>VIEW</button></Link>
            }
        }
    ];

    const options = {
        paginationSize: 4,
        pageStartIndex: 0,
        hidePageListOnlyOnePage: true,
        prePageText: 'Back',
        nextPageText: 'Next',
        sizePerPageList: [{
          text: '5', value: 5
        }, {
          text: '10', value: 10
        }]
    };

    return (
        <div>
            {bids.length ? 
            <BootstrapTable keyField='id' data={ bids } columns={ columns } pagination={ paginationFactory(options) } />
            :
            <Table className="emptyTable">
            <thead>
                <tr><th>Item</th><th>Name</th><th>Time left</th><th>Your price</th><th>No. bids</th><th>Highest bid</th><th></th></tr>
            </thead>
            <tbody>
                <tr><td>No bids yet</td></tr>
            </tbody>
            </Table>
            }
        </div>
    )
}

export default BidTable;
