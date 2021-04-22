import React from 'react'
import { withRouter } from 'react-router-dom'
import Breadcrumb from 'common/Breadcrumbs'
import Menu from 'common/Menu'

function TearmsAndConditions(props) {

    const handleSearchChange = search => {
        props.history.push({
            pathname: '/shop',
            state: { search: search }
        });
    }

    return (
        <div>
            <Menu handleSearchChange={handleSearchChange}/>
            <Breadcrumb />
            <div className="staticContainer">
                <div className="staticColumn staticTitle">
                    Introduction
                </div>
                <div className="staticColumn">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis consequat pretium turpis, in eleifend mi laoreet sed. Donec ipsum mauris, venenatis sit amet porttitor id, laoreet eu magna. In convallis diam volutpat libero tincidunt semper. Ut aliquet erat rutrum, venenatis lacus ut, ornare lectus. Quisque congue ex sit amet diam malesuada, eget laoreet quam molestie. In id elementum turpis. Curabitur quis tincidunt mauris.
                </div>
                <div className="staticColumn staticSubtitle">
                    Some title here
                </div>
                <div className="staticColumn">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis consequat pretium turpis, in eleifend mi laoreet sed. Donec ipsum mauris, venenatis sit amet porttitor id, laoreet eu magna. In convallis diam volutpat libero tincidunt semper. Ut aliquet erat rutrum, venenatis lacus ut, ornare lectus. Quisque congue ex sit amet diam malesuada, eget laoreet quam molestie. In id elementum turpis. Curabitur quis tincidunt mauris.
                </div>
                <div className="staticColumn staticSubtitle">
                    Some title here
                </div>
                <div className="staticColumn">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis consequat pretium turpis, in eleifend mi laoreet sed. Donec ipsum mauris, venenatis sit amet porttitor id, laoreet eu magna. In convallis diam volutpat libero tincidunt semper. Ut aliquet erat rutrum, venenatis lacus ut, ornare lectus. Quisque congue ex sit amet diam malesuada, eget laoreet quam molestie. In id elementum turpis. Curabitur quis tincidunt mauris.
                </div>
            </div>
        </div>
    )
}

export default withRouter(TearmsAndConditions);
