/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {Modal, Button, Input, Alert} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';
import AuthenticationUserView from './UserView';
import LoginForm from './LoginForm';

import {TimedAlertBox, MessagingActions} from '../../stateless-notifications/index';
import {TextInputStore} from '../../stateless-input/index';

var debug = require('debug')('AuthenticationModalView');
var usernameFieldName = "AuthenticationModalUsernameField";
var passwordFieldName = "AuthenticationModalPasswordField";

var ModalLoginViewMessageName = "ModalLoginViewMessage";

class AuthenticationModalView extends React.Component {

    constructor(props, context) {
        super();
        this.state = {
            show: props.show
        };
        this._login = this._login.bind(this);
    }


    _login(event) {
        if (event) {
            event.preventDefault();
        }
        if (!this.props.loggedIn) {
            context.executeAction(
                AuthenticationActions.login, {
                    username: this.props.TextInputStore[usernameFieldName].fieldValue,
                    password: this.props.TextInputStore[passwordFieldName].fieldValue,
                    rememberMe: this.refs.rememberMeInput.getChecked(),
                    messagingName: ModalLoginViewMessageName
                }
            );
        }
        else
        {
            context.executeAction(AuthenticationActions.logout, {});
        }
    }

    render() {
        //Calculate displays
        var headerText = "";
        var actionButtonText = "";

        if (this.props.loggedIn) {
            headerText = "User Profile";
            actionButtonText = "Sign Out";
        }
        else {
            headerText = "Please sign in...";
            actionButtonText = "Sign In";
        }

        var form = '';
        var alert =<TimedAlertBox messagingName={ModalLoginViewMessageName}/>;
        var rememberMeCheckbox = '';

        if (!this.props.loggedIn){
            form = <LoginForm usernameFieldName={usernameFieldName} passwordFieldName={passwordFieldName} onSubmit={this._login} />;
            rememberMeCheckbox = <Input type="checkbox" label="Remember me" ref="rememberMeInput" />;
        }

        return (
                <Modal
                    {...this.props}
                    show={this.props.show}
                    onHide={this.props.hideModal}
                    dialogClassName="login-modal"
                    >
                    <Modal.Header closeButton modalClassName="login-modal-header">
                        <Modal.Title id="contained-modal-title-lg" modalClassName="login-modal-title">{headerText}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {form}
                        {rememberMeCheckbox}
                        {alert}
                        <AuthenticationUserView
                            loggedIn = {this.props.loggedIn}
                            jwt = {this.props.jwt}
                            user = {this.props.user}
                            imageURL = {this.props.imageURL}
                            firstName = {this.props.firstName}
                            lastName = {this.props.lastName}
                            email = {this.props.email}
                            verified = {this.props.verified}
                            />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.hideModal}>Close</Button>
                        <Button onClick={this._login} bsStyle="primary">{actionButtonText}</Button>
                    </Modal.Footer>
                </Modal>
        );
    }
}
AuthenticationModalView = connectToStores(AuthenticationModalView,
    [TextInputStore],
    function (context, props) {
        return {
            TextInputStore: context.getStore(TextInputStore).getState()
        };
    });
AuthenticationModalView.propTypes = {
    jwt: React.PropTypes.string,
    user:React.PropTypes.string,
    loggedIn: React.PropTypes.bool,
    imageURL: React.PropTypes.string,
    firstName: React.PropTypes.string,
    lastName: React.PropTypes.string,
    email: React.PropTypes.string,
    verified: React.PropTypes.bool,

    hideModal: React.PropTypes.func.isRequired,
    show: React.PropTypes.bool.isRequired
};

export default AuthenticationModalView;
