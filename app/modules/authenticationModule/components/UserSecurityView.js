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

var debug = require('debug')('AuthenticationUserSecurityView');

var currentPasswordFieldName = "AuthenticationCurrentPasswordField";
var newPasswordFieldName = "AuthenticationNewPasswordField";
var confirmPasswordFieldName = "AuthenticationConfirmPasswordField";

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
                    password: this.props.TextInputStore[currentPasswordFieldName].fieldValue,
                    newPassword: this.props.TextInputStore[newPasswordFieldName].fieldValue
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

    render() {

        debug("Rendering");
        var changePasswordButton = <Button disabled>Change Password</Button>;
        if (this.props.TextInputStore[currentPasswordFieldName] && this.props.TextInputStore[currentPasswordFieldName].isValid &&
            this.props.TextInputStore[newPasswordFieldName] && this.props.TextInputStore[newPasswordFieldName].isValid &&
            this.props.TextInputStore[confirmPasswordFieldName] && this.props.TextInputStore[confirmPasswordFieldName].isValid) {
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
    [AuthenticationTextInputStore],
    function (context, props) {
        return {
            TextInputStore: context.getStore(AuthenticationTextInputStore).getState()
        };
    });

AuthenticationUserSecurityView.propTypes = {
    jwt: React.PropTypes.string.isRequired,
    user:React.PropTypes.string.isRequired,

    changePasswordMessageStyle: React.PropTypes.string,
    changePasswordMessage: React.PropTypes.string,
    changePasswordMessageValidUntil: React.PropTypes.object
};

export default AuthenticationUserSecurityView;
