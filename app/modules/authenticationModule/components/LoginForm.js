/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {Input, Row, Col, Alert} from 'react-bootstrap';

import UsernameInput from "./FieldInputs/UsernameInput";
import PasswordInput from "./FieldInputs/PasswordInput";

import MessagingActions from '../../timedAlertBox/actions/messagingActions';
import MessagingStore from '../../timedAlertBox/stores/messagingStore';

var debug = require('debug')('AuthenticationLoginView');

class AuthenticationLoginView extends React.Component {
    constructor(props, context) {
        super();
        this._handleKeyPress = this._handleKeyPress.bind(this);
    }

    _handleKeyPress(event) {
        var charCode = event.which || event.charCode || event.keyCode || 0;
        if (charCode === 13) {
            if (this.props.onSubmit) {
                this.props.onSubmit();
            }
        }
    }
    render() {
        var usernameText = "";
        if (this.props.usernameText) {
            usernameText = this.props.usernameText;
        }
        var passwordText = "";
        if (this.props.passwordText) {
            passwordText = this.props.passwordText;
        }
        var form =
                <Row>
                    <Col xs={6}>
                        <UsernameInput
                            fieldName={this.props.usernameFieldName}
                            initialValue={usernameText}
                            validateOnChange = {true}
                            onKeyPress={this._handleKeyPress}
                        />
                    </Col>
                    <Col xs={6}>
                        <PasswordInput
                            fieldName={this.props.passwordFieldName}
                            initialValue={passwordText}
                            validateOnChange = {true}
                            onKeyPress={this._handleKeyPress}
                        />
                    </Col>
                </Row>;
        return (<div>{form}</div>);
    }
}

AuthenticationLoginView.propTypes = {
    usernameFieldName: React.PropTypes.string.isRequired,
    usernameText: React.PropTypes.string,
    passwordFieldName: React.PropTypes.string.isRequired,
    passwordText: React.PropTypes.string,
    onSubmit: React.PropTypes.func
};

export default AuthenticationLoginView;