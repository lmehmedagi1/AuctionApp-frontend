import React from 'react'
import { Alert } from 'react-bootstrap'

class AlertWrapper extends React.Component {

    render() {
        return (
            <div className="alertContainer">
                <Alert show={this.props.showAlert} variant={this.props.variant} dismissible onClose={() => { this.props.onShowChange(false); }}>
                    {this.props.message}
                </Alert>
            </div>
        );
    }
}

export default AlertWrapper;
