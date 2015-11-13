/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {Input, Row, Col} from 'react-bootstrap';

var debug = require('debug')('AuthenticationNewPasswordInput');
class AuthenticationNewPasswordInput extends React.Component {

    constructor(props, context) {
        super(props,context);

        this.state = {
            newPassword: "",
            confirmPassword: ""
        };

        this._validateNewPasswords = this._validateNewPasswords.bind(this);
        this._handleNewPasswordInput = this._handleNewPasswordInput.bind(this);
        this._handleConfirmPasswordInput = this._handleConfirmPasswordInput.bind(this);
        this.isValid = this.isValid.bind(this);
        this.getNewPasswordValue= this.getNewPasswordValue.bind(this);
        this.getConfirmPasswordValue = this.getConfirmPasswordValue.bind(this);
    }

    _validateNewPasswords() {
        if  (this.state.newPassword == this.state.confirmPassword && this.state.newPassword != '')
        {
            return 'success';
        }
        else {
            return 'error';
        }
    }

    _handleNewPasswordInput() {
        this.setState({
            newPassword: this.refs.newPassword.getValue()
        });
        if (this.props.onNewPasswordChange){
            this.props.onNewPasswordChange();
        }
    }
    _handleConfirmPasswordInput() {
        this.setState({
            confirmPassword: this.refs.confirmPassword.getValue()
        });
        if (this.props.onConfirmPasswordChange){
            this.props.onConfirmPasswordChange();
        }
    }

    isValid(){
        return (this.refs.newPassword.getValue() == this.refs.confirmPassword.getValue() && this.refs.newPassword.getValue() != '')
    }
    getNewPasswordValue(){
        return this.refs.newPassword.getValue();
    }

    getConfirmPasswordValue(){
        return this.refs.confirmPassword.getValue();
    }

    render() {
        debug("Rendering");
        return (
            <Row>
                <Col xs={6}>
                    <Input
                        type="password"
                        placeholder="New Password"
                        label="New password"
                        ref="newPassword"
                        bsStyle={this._validateNewPasswords()}
                        onChange={this._handleNewPasswordInput}
                        />
                </Col>
                <Col xs={6}>
                    <Input
                        type="password"
                        placeholder="Confirm password"
                        label="Confirm password"
                        bsStyle={this._validateNewPasswords()}
                        onChange={this._handleConfirmPasswordInput}
                        ref="confirmPassword"
                        />
                </Col>
            </Row>
        );
    }
}

AuthenticationNewPasswordInput.propTypes = {
    onNewPasswordChange: React.PropTypes.func,
    onConfirmPasswordChange: React.PropTypes.func
};

export default AuthenticationNewPasswordInput;
