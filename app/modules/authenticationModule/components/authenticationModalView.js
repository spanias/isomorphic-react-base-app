/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
//import {connectToStores} from 'fluxible-addons-react';
import {Modal, Button, Input, Alert, ModalTrigger} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';
//import AuthenticationMainStore from '../stores/authenticationMainStore';
import AuthenticationUserView from './authenticationUserView';
import AuthenticationLoginView from './authenticationLoginView';

var debug = require('debug')('AuthenticationModalView');

class AuthenticationModalView extends React.Component {

    constructor(props, context) {
        super();
        this.state = {
            show: props.show,
            message: "",
            messageClass: "info"
        };

        this._refreshStateWithProps = this._refreshStateWithProps.bind(this);
        this._login = this._login.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        debug("Receiving new props ->", nextProps);
        this._refreshStateWithProps(nextProps);
    }

    _refreshStateWithProps(nextProps) {
        if (nextProps.loggedIn) {
            this.setState({
                message : "",
                messageClass : "info"
            });
        }
        else {
            if (nextProps.attempts > 0 && nextProps.errorMessage == null ) {
                this.setState({
                    message:"Username and password combination invalid!",
                    messageClass : "danger"
                });

            }
            if (nextProps.errorMessage != null) {
                this.setState({
                    message:nextProps.errorMessage,
                    messageClass : "danger"
                });
            }
        }
    }

    _login(event) {

        if (event) {
            event.preventDefault();
        }
        if (!this.props.loggedIn) {
            debug(this.refs.loginView);
            this.setState({
                message: "Attempting login with Username " + this.refs.loginView.getUsernameValue(),
                messageClass: "info"
            });

            if (this.refs.loginView.getUsernameValue() != "" && this.refs.loginView.getPasswordValue() != "") {
                //Authentication Service called here.
                context.executeAction(AuthenticationActions, ["Login", {
                    username: this.refs.loginView.getUsernameValue(),
                    password: this.refs.loginView.getPasswordValue(),
                    rememberMe: this.refs.rememberMeInput.getChecked()
                }]);
            }
            else {
                this.setState({
                    message: "Username or password cannot be empty!",
                    messageClass: "danger"
                });
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
        if (this.state.message !== "")
        {
            alert= <Alert bsSize="medium" bsStyle={this.state.messageClass}>{this.state.message}</Alert>
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
/*
AuthenticationModalView = connectToStores(AuthenticationModalView, [AuthenticationMainStore], function (context, props) {
    return context.getStore(AuthenticationMainStore).getState()
});*/

export default AuthenticationModalView;
