import React, { useEffect, useState } from 'react'
import { Range } from 'rc-slider';

function PriceFilter(props) {

    const [maxValue, setMaxValue] = useState(0);
    
    const [filterMin, setFilterMin] = useState(0);
    const [filterMax, setFilterMax] = useState(0);

    useEffect(() => {
        if (!props.prices) return;
        setMaxValue(Math.max(...props.prices));
        setFilterMin(props.activeMin);
        props.activeMax == 2147483640 ? setFilterMax(0) : setFilterMax(props.activeMax);
    }, [props.activeMax])

    const priceRangeChange = price => {
        setFilterMin(price[0]);
        setFilterMax(price[1]);
    }

    const afterPriceRangeChange = price => {
        props.priceFilterChange({ minPrice: price[0], maxPrice: price[1] });
    }

    return (
        <div className="priceFilterContainer">
            <div className="priceTitle">
                FILTER BY PRICE
            </div>
            <div className="price-range-container">
            <div className="histogram-container">
                {props.prices.map((size, i) => (
                    <div
                        key={i}
                        className="histogram-bar"
                        style={{ width: 'calc(100% / 24)', height: size === 0 ? 0 : 'calc(70px / ' + (maxValue / size) + ')' }}
                    />
                ))}
            </div>
            <Range
                className="price-range-slider"
                min={props.minPrice}
                max={props.maxPrice == 2147483640 ? 0 : props.maxPrice}
                allowCross={false}
                value={[filterMin, filterMax]}
                onChange={priceRangeChange}
                onAfterChange={afterPriceRangeChange}
            />
            </div>
            <div className="priceInfo">
                {"$" + (filterMin < props.minPrice ? props.minPrice : filterMin) + " - $" + (filterMax > props.maxPrice ? props.maxPrice : filterMax)}
            </div>
            <div className="priceInfo">
                The average price is ${props.avgPrice}.
            </div>
        </div>
    )
}

export default PriceFilter;
