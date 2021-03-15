import React from 'react'
import { Link } from 'react-router-dom'
import { urlToName } from '../utils/converters'

class Breadcrumb extends React.Component {

    constructor() {
        super();
        this.state = { breadcrumbs: [], title: "" };
    }

    componentDidMount() {
        let url = window.location.pathname;
        let breadcrumbs = [];
        let name = urlToName(url);
        
        if (url.includes("shop")) {
            let pages = url.substr(1).split("/");
            let currUrl = "";
            
            for (let i = 0; i < pages.length && i < 2; i++) {
                name = urlToName('/' + pages[i]);
                currUrl = currUrl + "/" + pages[i];
                breadcrumbs.push({ name: name, url: currUrl });
            }
            
        }
        else if (url.includes("about") || url.includes("privacy") || url.includes("terms")) {
            breadcrumbs.push({ name: "SHOP", url: "/shop" });
            name = urlToName(url);
            breadcrumbs.push({ name: name, url: url });
        }

        this.setState({ breadcrumbs: breadcrumbs, title: name });

    }

    render() {
        return (
            <div className="breadcrumbContainer">
                <div id="breadcrumbTitle">
                    {this.state.title}
                </div>
                <div id="breadcrumbs">
                    {this.state.breadcrumbs.map((breadcrumb, index) => (
                        <div className="breadcrumbColumn">
                            <Link className="breadcrumbLink" to={breadcrumb.url}>
                                {breadcrumb.name}
                            </Link>
                            <span> / </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Breadcrumb;
