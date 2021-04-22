import React from 'react'

function DidYouMean(props) {
    return (
        <div className="didYouMeanContainer">
            {props.value == null || props.value == '' ? null :
            <div>
                Did you mean? <span onClick={props.handleDidYouMeanSelect}> {props.value} </span>
            </div>
            }
        </div>
    )
}

export default DidYouMean;
