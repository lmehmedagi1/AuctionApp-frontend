import React from 'react'
import { Link } from 'react-router-dom'
import { urlToName } from 'utils/converters'

class Breadcrumb extends React.Component {

    constructor() {
        super();
        this.state = { breadcrumbs: [], title: "" };
    }

    componentDidMount() {

        let url = window.location.pathname;
        let breadcrumbs = [];
        let name = urlToName(url);

        let pages = url.substr(1).split("/");
        let currUrl = "";

        if (url.includes("single-product")) {
            
            for (let i = 0; i < pages.length; i++) {
                if (pages[i] == "single-product") break;
                name = urlToName('/' + pages[i]);
                currUrl = currUrl + "/" + pages[i];
                if (currUrl === "/my-account") currUrl = "/my-account/profile"
                breadcrumbs.push({ name: name, url: currUrl });
            }

            if (pages.length == 2) breadcrumbs.push({ name: "HOME", url: "/" });
            name = "SINGLE PRODUCT";
            currUrl = currUrl + "/single-product";
            breadcrumbs.push({ name: name, url: currUrl });
        }
        else if (url.includes("shop")) {
            
            for (let i = 0; i < pages.length; i++) {
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
        else if (url.includes("my-account") && pages.length == 2) {
            breadcrumbs.push({ name: "MY ACCOUNT", url: "/my-account/profile" });
            name = urlToName('/' + pages[1]);
            if (name === "SELLER") name = "BECOME SELLER";
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
                {this.props.update ? 
                <div id="breadcrumbs" className="breadcrumbsUpdate">
                    {this.state.breadcrumbs.map((breadcrumb, index) => (
                        <div className="breadcrumbColumn">
                            <div className="breadcrumbLink" onClick={() => this.props.update("profile")}>
                                {breadcrumb.name}
                                <span> / </span>
                            </div>
                        </div>
                    ))}
                </div>
                :
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
                }
            </div>
        );
    }
}

export default Breadcrumb;
