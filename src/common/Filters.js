import React from 'react'
import { Alert } from 'react-bootstrap'

function Filters(props) {

    const resetMinPrice = () => {
        props.resetMinPrice();
    }

    const resetMaxPrice = () => {
        props.resetMaxPrice();
    }

    const resetSupercategory = () => {
        props.resetSupercategory();
    }

    const resetSubcategory = (index) => {
        props.resetSubcategory(index);
    }

    const resetSearch = () => {
        props.resetSearch();
    }

    return (
        <div className="filtersContainer">
            <Alert variant="primary" show={props.activeMinPrice && props.minPrice && props.activeMinPrice != props.minPrice} onClose={() => resetMinPrice()} dismissible>Min price: ${props.activeMinPrice} </Alert>
            <Alert variant="primary" show={props.activeMaxPrice && props.maxPrice && props.activeMaxPrice != props.maxPrice} onClose={() => resetMaxPrice()} dismissible>Max price: ${props.activeMaxPrice} </Alert>
            <Alert variant="primary" show={props.supercategory && props.supercategory != ""} onClose={() => resetSupercategory()} dismissible>Supercategory: {props.supercategory} </Alert>
            {props.subcategories.map((subcategory, idx) => (
            <Alert variant="primary" show={true} onClose={() => resetSubcategory(idx)} dismissible>
                Category: {subcategory}
            </Alert>
            ))}
            <Alert variant="primary" show={props.search && props.search != ""} onClose={() => resetSearch()} dismissible>Search: {props.search} </Alert>
        </div>
    )
}

export default Filters;
