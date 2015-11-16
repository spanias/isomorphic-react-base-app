/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {Button, Input, Row, Col, Alert, Panel} from 'react-bootstrap';
import {Image, Label} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';

import PasswordInput from "./FieldInputs/PasswordInput";

import NewPasswordInput from './FieldInputs/NewPasswordInput';
import TimedAlertBox from '../../timedAlertBox/timedAlertBox';

import AuthenticationTextInputStore from '../stores/authenticationTextInputStore';

import MessagingActions from '../actions/messagingActions';
import MessagingStore from '../stores/messagingStore';

var debug = require('debug')('AuthenticationUserSecurityView');

var currentPasswordFieldName = "AuthenticationCurrentPasswordField";
var newPasswordFieldName = "AuthenticationNewPasswordField";
var confirmPasswordFieldName = "AuthenticationConfirmPasswordField";

var userSecurityViewMessageName = "UserSecurityViewMessage";

class AuthenticationUserSecurityView extends React.Component {

    constructor(props, context) {
        super(props,context);
        this._changePassword = this._changePassword.bind(this);
    }

    _changePassword() {
        if(this.props.TextInputStore[currentPasswordFieldName] && this.props.TextInputStore[currentPasswordFieldName].isValid &&
            this.props.TextInputStore[newPasswordFieldName] && this.props.TextInputStore[newPasswordFieldName].isValid &&
            this.props.TextInputStore[confirmPasswordFieldName] && this.props.TextInputStore[confirmPasswordFieldName].isValid
            )
        {
            context.executeAction(
                MessagingActions.updateMessage,
                {
                    messageName: userSecurityViewMessageName,
                    values: {
                        message: "Changing password...",
                        appearFor: 20,
                        messageStyle: "info"
                    }
                }
            );
            context.executeAction(
                AuthenticationActions.changePassword,
                {
                    jwt: this.props.jwt,
                    user: this.props.user,
                    password: this.props.TextInputStore[currentPasswordFieldName].fieldValue,
                    newPassword: this.props.TextInputStore[newPasswordFieldName].fieldValue
                }
            );
        }
        else{
            context.executeAction(
                MessagingActions.updateMessage,
                {
                    messageName: userSecurityViewMessageName,
                    values: {
                        message: "Cannot validate form. Please re-check details.",
                        appearFor: 5,
                        messageStyle: "danger"
                    }
                }
            );
        }
    }

    render() {

        debug("Rendering");
        var changePasswordButton = <Button disabled>Change Password</Button>;
        if (this.props.TextInputStore[currentPasswordFieldName] && this.props.TextInputStore[currentPasswordFieldName].isValid &&
            this.props.TextInputStore[newPasswordFieldName] && this.props.TextInputStore[newPasswordFieldName].isValid &&
            this.props.TextInputStore[confirmPasswordFieldName] && this.props.TextInputStore[confirmPasswordFieldName].isValid) {
            changePasswordButton = <Button onClick={this._changePassword}>Change Password</Button>;
        }

        var errorLabel = '';
        if (this.props.MessagingStore[userSecurityViewMessageName] && this.props.MessagingStore[userSecurityViewMessageName].message) {
            errorLabel = <TimedAlertBox style={this.props.MessagingStore[userSecurityViewMessageName] ? this.props.MessagingStore[userSecurityViewMessageName].messageStyle : "info"}
                                        message={this.props.MessagingStore[userSecurityViewMessageName] ? this.props.MessagingStore[userSecurityViewMessageName].message : null }
                                        appearsUntil={this.props.MessagingStore[userSecurityViewMessageName] ? this.props.MessagingStore[userSecurityViewMessageName].messageValidUntil : null } />;
        }

        return (
            <div>
                <div className="authentication-userSecurityView-group">
                    <Panel header="Security" bsStyle="primary">
                        <Row>
                            <Col xs={12}>

                                <PasswordInput
                                    fieldName={currentPasswordFieldName}
                                    initialValue=""
                                    placeholder="Current password"
                                    label="Current password"
                                    validateOnChange = {true} />
                            </Col>
                        </Row>
                        <NewPasswordInput
                            newPasswordFieldName = {newPasswordFieldName}
                            confirmPasswordFieldName = {confirmPasswordFieldName}
                            />

                        {errorLabel}
                        {changePasswordButton}
                    </Panel>
                </div>
            </div>
        );
    }
}
AuthenticationUserSecurityView = connectToStores(AuthenticationUserSecurityView,
    [AuthenticationTextInputStore, MessagingStore],
    function (context, props) {
        return {
            TextInputStore: context.getStore(AuthenticationTextInputStore).getState(),
            MessagingStore: context.getStore(MessagingStore).getState()
        };
    });

AuthenticationUserSecurityView.propTypes = {
    jwt: React.PropTypes.string.isRequired,
    user:React.PropTypes.string.isRequired
};

export default AuthenticationUserSecurityView;
