/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {ButtonToolbar, Button, Input, Row, Col, Alert, Panel} from 'react-bootstrap';
import {Image, Label} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';
var debug = require('debug')('AuthenticationUserSecurityView');
class AuthenticationUserSecurityView extends React.Component {

    constructor(props, context) {
        super(props,context);

        this.state = {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        };

        this._refreshStateWithProps = this._refreshStateWithProps.bind(this);
        this._validateCurrentPassword = this._validateCurrentPassword.bind(this);
        this._validateNewPasswords = this._validateNewPasswords.bind(this);
        this._handleCurrentPasswordInput = this._handleCurrentPasswordInput.bind(this);
        this._handleNewPasswordInput = this._handleNewPasswordInput.bind(this);
        this._handleConfirmPasswordInput = this._handleConfirmPasswordInput.bind(this);
        this._changePassword = this._changePassword.bind(this);
    }
    componentDidMount() {
        if (this.props != null) {
            debug("didMount ->", this.props);
            this._refreshStateWithProps(this.props);
        }
    }
    componentWillReceiveProps(nextProps) {
        debug("willReceiveProps ->", nextProps);
        this._refreshStateWithProps(nextProps);
    }

    _refreshStateWithProps(nextProps) {
        if (typeof nextProps !== "undefined" && nextProps.loggedIn) {
            this.setState({
                visible: true
            });
        }
        else {
            this.setState({
                visible: false
            });
        }
    }

    _validateCurrentPassword() {
        // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        //var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if  (this.state.currentPassword != "")
        {
            return 'success';
        }
        else {
            return 'error';
        }
    }

    _validateNewPasswords() {
        // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        //var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if  (this.state.newPassword == this.state.confirmPassword && this.state.newPassword != '')
        {
            return 'success';
        }
        else {
            return 'error';
        }
    }
    _changePassword() {
        if(this._validateCurrentPassword() == 'success' && this._validateNewPasswords() == 'success')
        {
            context.executeAction(AuthenticationActions, ["ChangePassword", {
                jwt: this.props.jwt,
                username: this.props.user,
                password: this.state.currentPassword,
                newPassword: this.state.newPassword
            }]);
        }
    }
    _handleCurrentPasswordInput() {
        this.setState({
            currentPassword: this.refs.currentPassword.getValue()
        });
    }
    _handleNewPasswordInput() {
        this.setState({
            newPassword: this.refs.newPassword.getValue()
        });
    }
    _handleConfirmPasswordInput() {
        this.setState({
            confirmPassword: this.refs.confirmPassword.getValue()
        });
    }
    render() {

        debug("Rendering");
        var changePasswordButton = <Button disabled>Change Password</Button>;
        if(this._validateCurrentPassword() == 'success' && this._validateNewPasswords() == 'success')
        {
            changePasswordButton = <Button onClick={this._changePassword}>Change Password</Button>;
        }

        var errorLabel =  '';
        if (this.props.changePasswordErrorMessage != null && this.props.changePasswordFailed)
        {
            errorLabel =  <Alert bsStyle="danger">{this.props.changePasswordErrorMessage}</Alert>;
        }
        else if (this.props.changePasswordErrorMessage != null && !this.props.changePasswordFailed)
        {
            errorLabel =  <Alert bsStyle="success">{this.props.changePasswordErrorMessage}</Alert>;
        }
        var userSecurityView =
            <div className="authentication-userSecurityView-group">
            </div>;

        if (this.props.loggedIn){
            userSecurityView =
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
                                    value={this.state.currentPassword} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Input
                                    type="password"
                                    placeholder="New Password"
                                    label="New password"
                                    ref="newPassword"
                                    bsStyle={this._validateNewPasswords()}
                                    onChange={this._handleNewPasswordInput}
                                    value={this.state.newPassword} />
                            </Col>
                            <Col xs={6}>
                                <Input
                                    type="password"
                                    placeholder="Confirm password"
                                    label="Confirm password"
                                    bsStyle={this._validateNewPasswords()}
                                    onChange={this._handleConfirmPasswordInput}
                                    ref="confirmPassword"
                                    value={this.state.confirmPassword} />
                            </Col>
                        </Row>
                        {errorLabel}
                        {changePasswordButton}
                    </Panel>
                </div>
        }
        return (
            <div>
                {userSecurityView}
            </div>
        );
    }
}

AuthenticationUserSecurityView.propTypes = {
};

export default AuthenticationUserSecurityView;
