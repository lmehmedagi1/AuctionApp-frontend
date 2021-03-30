import React from 'react'
import { Table } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'

import { timestampToDate } from '../utils/converters'

function BidderTable(props) {

    const columns = [
        {
            dataField: 'user.firstName',
            text: 'Bidder',
            formatter: (value, row) => {
                return <div><img src="https://www.firstfishonline.com/wp-content/uploads/2017/07/default-placeholder-700x700.png"/> {  row.user.firstName + " " + row.user.lastName}</div>
            }
        }, {
            dataField: 'time',
            text: 'Date',
            formatter: (value, row) => {
                return timestampToDate(row.time)
            }
        }, {
            dataField: 'price',
            text: 'Bid',
            formatter: (value, row) => {
                if (row.price == props.highestBid) return <div style={{ color: 'green' }}>$ {row.price}</div> 
                return <div>$ {row.price}</div>
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
        <div className="itemCard">
            {props.bids && props.bids.length ? 
            <BootstrapTable keyField='id' data={ props.bids } columns={ columns } pagination={ paginationFactory(options) } />
            :
            <Table>
            <thead>
                <tr><th>Bidder</th><th>Date</th><th>Bid</th></tr>
            </thead>
            <tbody>
                <tr><td>No bidders yet</td></tr>
            </tbody>
            </Table>
            }
        </div>
    )
}

export default BidderTable;
