import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { Range } from 'rc-slider';

function PriceFilter(props) {

    const [maxValue, setMaxValue] = useState(0);
    
    const [filterMin, setFilterMin] = useState(0);
    const [filterMax, setFilterMax] = useState(0);

    useEffect(() => {
        if (!props.prices) return;
        setMaxValue(Math.max(...props.prices));

        if (props.activeMin < props.minPrice) setFilterMin(props.minPrice);
        else if (props.activeMin > props.maxPrice) setFilterMin(props.maxPrice);
        else setFilterMin(props.activeMin);

        if (props.activeMax > props.maxPrice) setFilterMax(props.maxPrice);
        else if (props.activeMax < props.minPrice) setFilterMax(props.minPrice);
        else setFilterMax(props.activeMax);

    }, [props]);

    const priceRangeChange = price => {
        setFilterMin(price[0]);
        setFilterMax(price[1]);
    }

    const afterPriceRangeChange = price => {
        props.priceFilterChange({ minPrice: price[0], maxPrice: price[1] });
    }

    const showRangeText = () => {
        let text = "$";
        if (filterMin < props.minPrice) text += props.minPrice;
        else if (filterMin > props.maxPrice) text += props.maxPrice;
        else text += filterMin;

        text += " - $";

        if (filterMax > props.maxPrice) text += props.maxPrice;
        else if (filterMax < props.minPrice) text += props.minPrice;
        else if (filterMax == 2147483640) text += "0";
        else text += filterMax;

        return text;
    }

    return (
        <div className="priceFilterContainer">
            <div className="priceTitle">
                FILTER BY PRICE {props.loading ? <Spinner className="spinner" animation="border" role="status" size="sm"/> : null}
            </div>
            <div className="histogram">
            <div className="histogramContainer">
                {props.prices.map((size, i) => (
                    <div
                        key={i}
                        className="histogramBar"
                        style={{ width: 'calc(100% / 24)', height: size === 0 ? 0 : 'calc(70px / ' + (maxValue / size) + ')' }}
                    />
                ))}
            </div>
            <Range
                className="priceRange"
                min={props.minPrice}
                max={props.maxPrice == 2147483640 ? 0 : props.maxPrice}
                allowCross={false}
                value={[filterMin, filterMax]}
                onChange={priceRangeChange}
                onAfterChange={afterPriceRangeChange}
            />
            </div>
            <div className="priceInfo">
                {showRangeText()}
            </div>
            <div className="priceInfo">
                The average price is ${props.avgPrice}.
            </div>
        </div>
    )
}

export default PriceFilter;
