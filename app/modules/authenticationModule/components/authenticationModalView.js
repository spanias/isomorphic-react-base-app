/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
//import {connectToStores} from 'fluxible-addons-react';
import {Modal, Button, Input, Alert, ModalTrigger} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';
import AuthenticationUserView from './authenticationUserView';
import AuthenticationLoginView from './authenticationLoginView';
import TimedAlertBox from '../../timedAlertBox/timedAlertBox';

var debug = require('debug')('AuthenticationModalView');

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
            if (this.refs.loginView.getUsernameValue() != "" && this.refs.loginView.getPasswordValue() != "") {
                //Authentication Service called here.

                context.executeAction(AuthenticationActions, ["UpdateLoginMessage",
                    {style: "info", message: "Attempting login...", appearFor: 10}
                ]);
                context.executeAction(AuthenticationActions, ["Login", {
                    username: this.refs.loginView.getUsernameValue(),
                    password: this.refs.loginView.getPasswordValue(),
                    rememberMe: this.refs.rememberMeInput.getChecked()
                }]);
            }
            else {
                context.executeAction(AuthenticationActions, ["UpdateLoginMessage",
                    {style: "danger", message: "Username and Password cannot be empty!", appearFor: 10}
                ]);
            }
        }
        else
        {
            context.executeAction(AuthenticationActions, ["Logout", null]);
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
        var alert ='';
        var rememberMeCheckbox = '';
        if (this.props.loginMessage)
        {
            alert= <TimedAlertBox style={this.props.loginMessageStyle} message={this.props.loginMessage} appearsUntil={this.props.loginMessageValidUntil}/>;
        }

        //if there is no user logged in show the input form and change the main page buttons
        if (!this.props.loggedIn){
            form = <AuthenticationLoginView ref='loginView' onSubmit={this._login} />;
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
                        <AuthenticationUserView {...this.props}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.hideModal}>Close</Button>
                        <Button onClick={this._login} bsStyle="primary">{actionButtonText}</Button>
                    </Modal.Footer>
                </Modal>
        );
    }
}

AuthenticationModalView.propTypes = {

};

export default AuthenticationModalView;
