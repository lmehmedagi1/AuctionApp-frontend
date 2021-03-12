import React from 'react'
import { Link } from 'react-router-dom'

class Breadcrumb extends React.Component {

    constructor() {
        super();
        this.state = { breadcrumbs: [], title: "" };
    }

    getNameFromUrl = url =>  {
        return url.replaceAll("-", " ").toUpperCase().substr(1);
    }

    componentDidMount() {
        let url = window.location.pathname;
        let breadcrumbs = [];
        let title = "";

        if (url.includes("about") || url.includes("privacy") || url.includes("terms")) {
            breadcrumbs.push({ name: "SHOP", url: "/shop" });
            let name = this.getNameFromUrl(url);
            breadcrumbs.push({ name: name, url: url });
            title = name;
        }
        else if (url.includes("shop")) {
            let pages = url.split("/");
            let currUrl = "";
            for (let i = 0; i < pages.length; i++) {
                let name = this.getNameFromUrl('/' + pages[i]);
                currUrl = currUrl + "/" + pages[i];
                breadcrumbs.push({ name: name, url: currUrl });
                title = name;
            }
        }
        else {
            let name = this.getNameFromUrl(url);
            title = name;
        }
        this.setState({ breadcrumbs: breadcrumbs, title: title });

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
