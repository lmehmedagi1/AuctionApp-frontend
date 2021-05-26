import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import Ratings from 'react-ratings-declarative'
import { imagePlaceholder } from 'utils/constants'

function RatingModal(props) {

    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setRating(props.initRating);
    }, [props.initRating]);

    const changeRating = rating => {
        setRating(rating);
    }

    const saveRating = () => {
        props.handleRatingLeft(rating);
    }

    return (
        <div className="ratingModalContainer">
        <Modal
            show={props.showModal}
            onHide={props.handleCloseRatingModal}
            centered={true}
            className="ratingModalContainer"
        >
            <Modal.Body>
            <div className={loading ? "blockedWait" : ""}>
            <div className={loading ? "blocked" : ""}>
                <h1>Add review for {props.seller ? props.seller.firstName + ' ' + props.seller.lastName : ''}</h1>
                <div>
                    <img src={props.seller ? 'data:' + props.seller.avatarType + ';base64,' + props.seller.avatar : imagePlaceholder} alt="Avatar"/>
                </div>

                <h2>Give us a quick review so we know if you like your product</h2>
                <div>
                <Ratings
                    rating={rating}
                    widgetDimensions="50px"
                    widgetSpacings="10px"
                    changeRating={changeRating}
                    widgetRatedColors="#8367D8"
                    widgetHoverColors="#8367D8"
                >
                    <Ratings.Widget />
                    <Ratings.Widget />
                    <Ratings.Widget />
                    <Ratings.Widget />
                    <Ratings.Widget />
                </Ratings>
                </div>

                <button onClick={saveRating}>Save rating</button>
            </div>
            </div>
            </Modal.Body>
        </Modal>
        </div>
    )
}

export default RatingModal;


