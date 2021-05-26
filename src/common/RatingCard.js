import React from 'react'
import { ProgressBar } from 'react-bootstrap'
import { imagePlaceholder } from 'utils/constants'
import Ratings from 'react-ratings-declarative'

function RatingCard(props) {

    const getAverage = () => {
        if (props.ratings == null || props.ratings.length == 0) return 0;
        const ratingsSum = props.ratings.reduce((a, b) => a + b, 0);
        return ratingsSum / props.ratings.length
    }

    const getTotal = () => {
        if (props.ratings == null || props.ratings.length == 0) return 0;
        return props.ratings.length;
    }

    const getRatingCount = rating => {
        if (props.ratings == null || props.ratings.length == 0) return [0, 0];
        const freq = props.ratings.filter(i => {
            if (i == rating) return true;
            return false;
        }).length;
        return [freq, freq*100/props.ratings.length];
    }

    return (
        <div className="ratingCardContainer">
            <div className="title">Seller information</div>
            <div className="body">
                <div>
                <img src={props.seller ? 'data:' + props.seller.avatarType + ';base64,' + props.seller.avatar : imagePlaceholder} alt="Avatar"/>
                <p>{props.seller ? props.seller.firstName + ' ' + props.seller.lastName : ''}</p>
                </div>
                <div>
                    <h1>{parseFloat(getAverage()).toFixed(1)}</h1>
                    <div>
                    <Ratings
                        rating={getAverage()}
                        widgetDimensions="30px"
                        changeRating={null}
                        widgetSpacings="2px"
                        widgetRatedColors="#8367D8"
                    >
                        <Ratings.Widget /> 
                        <Ratings.Widget /> 
                        <Ratings.Widget /> 
                        <Ratings.Widget /> 
                        <Ratings.Widget />
                    </Ratings>
                    </div>
                    <h2>{getTotal()} total</h2>
                </div>
                <div className="stats">
                    {[5, 4, 3, 2, 1].map(rating => {
                        const stats = getRatingCount(rating);
                        return <div className="statsBar"><div>{rating}</div> <div><i className="fa fa-star" aria-hidden="true"></i></div> <div><ProgressBar now={stats[1]} label={`${stats[0]}`} /></div> </div>
                    })}
                </div>
            </div>
        </div>
    )
}

export default RatingCard;


