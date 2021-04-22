import React from 'react'

function Stepper(props) {

    return (
        <div className="stepperContainer">
            <div className="stepper activeStepper"/>
            <div className={props.step > 1 ? "line activeLine" : "line"}/>
            <div className={props.step > 1 ? "stepper activeStepper" : "stepper"}/>
            <div className={props.step > 2 ? "line activeLine" : "line"}/>
            <div className={props.step > 2 ? "stepper activeStepper" : "stepper"}/>
        </div>
    )
}

export default Stepper;
