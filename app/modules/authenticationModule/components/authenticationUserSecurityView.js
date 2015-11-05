/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {ButtonToolbar, Button, Input, Row, Col, Alert, Panel} from 'react-bootstrap';
import {Image, Label} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';
import AuthenticationNewPasswordInput from './authenticationNewPasswordInput';
import TimedAlertBox from '../../timedAlertBox/timedAlertBox';

var debug = require('debug')('AuthenticationUserSecurityView');
class AuthenticationUserSecurityView extends React.Component {

    constructor(props, context) {
        super(props,context);

        this.state = {
            currentPassword: "",
            newPassword: "",
            newPasswordInputValid: false,
            confirmPassword: ""
        };

        this._validateCurrentPassword = this._validateCurrentPassword.bind(this);
        this._handleCurrentPasswordInput = this._handleCurrentPasswordInput.bind(this);
        this._handleNewPasswordInput = this._handleNewPasswordInput.bind(this);
        this._handleConfirmPasswordInput = this._handleConfirmPasswordInput.bind(this);
        this._changePassword = this._changePassword.bind(this);
    }

    _validateCurrentPassword() {
        if  (this.state.currentPassword != "")
        {
            return 'success';
        }
        else {
            return 'error';
        }
    }

    _changePassword() {
        if(this._validateCurrentPassword() == 'success' && this.state.newPasswordInputValid)
        {
            context.executeAction(
                AuthenticationActions.updateSecurityMessage,
                {
                    message: "Changing password...",
                    appearFor: 10,
                    style: "info"
                }
            );

            context.executeAction(
                AuthenticationActions.changePassword,
                {
                    jwt: this.props.jwt,
                    user: this.props.user,
                    currentPassword: this.state.currentPassword,
                    newPassword: this.state.newPassword
                }
            );
        }
        else{
            context.executeAction(
                AuthenticationActions.updateSecurityMessage,
                {
                    message: "Cannot validate form. Please re-check details.",
                    appearFor: 10,
                    style: "danger"
                }
            );
        }
    }
    _handleCurrentPasswordInput() {
        this.setState({
            currentPassword: this.refs.currentPassword.getValue()

        });
    }
    _handleNewPasswordInput() {
        this.setState({
            newPassword: this.refs.newPasswordInput.getNewPasswordValue(),
            newPasswordInputValid: this.refs.newPasswordInput.isValid()
        });
    }
    _handleConfirmPasswordInput() {
        this.setState({
            confirmPassword: this.refs.newPasswordInput.getConfirmPasswordValue(),
            newPasswordInputValid: this.refs.newPasswordInput.isValid()
        });
    }
    render() {

        debug("Rendering");
        var changePasswordButton = <Button disabled>Change Password</Button>;
        if (this._validateCurrentPassword() == 'success' && this.state.newPasswordInputValid) {
            changePasswordButton = <Button onClick={this._changePassword}>Change Password</Button>;
        }

        var errorLabel = '';
        if (this.props.changePasswordMessage) {
            errorLabel =
                <TimedAlertBox style={this.props.changePasswordMessageStyle} message={this.props.changePasswordMessage}
                               appearsUntil={this.props.changePasswordMessageValidUntil}/>;
        }

        return (
            <div>
                <div className="authentication-userSecurityView-group">
                    <Panel header="Security" bsStyle="primary">
                        <Row>
                            <Col xs={12}>
                                <Input
                                    type="password"
                                    placeholder="Current password"
                                    label="Current password"
                                    ref="currentPassword"
                                    bsStyle={this._validateCurrentPassword()}
                                    onChange={this._handleCurrentPasswordInput}
                                    value={this.state.currentPassword}/>
                            </Col>
                        </Row>
                        <AuthenticationNewPasswordInput ref='newPasswordInput'
                            onNewPasswordChange = {this._handleNewPasswordInput}
                            onConfirmPasswordChange = {this._handleConfirmPasswordInput}
                            />

                        {errorLabel}
                        {changePasswordButton}
                    </Panel>
                </div>
            </div>
        );
    }
}

AuthenticationUserSecurityView.propTypes = {
    jwt: React.PropTypes.string.isRequired,
    user:React.PropTypes.string.isRequired,

    changePasswordMessageStyle: React.PropTypes.string,
    changePasswordMessage: React.PropTypes.string,
    changePasswordMessageValidUntil: React.PropTypes.object
};

export default AuthenticationUserSecurityView;
