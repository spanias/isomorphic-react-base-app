/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {ButtonToolbar, Modal, Button, Input, Row, Col, Alert, ModalTrigger} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';
import AuthenticationStore from '../stores/authenticationStore';
import AuthenticationUserView from './authenticationUserView';

var debug = require('debug')('AuthenticationComponent');

class AuthenticationComponent extends React.Component {

    constructor(props, context) {
        super();
        this.state = {
            show: false,
            message: "",
            messageClass: "info"
        };

        this._refreshStateWithProps = this._refreshStateWithProps.bind(this);
        this._showModal = this._showModal.bind(this);
        this._hideModal = this._hideModal.bind(this);
        this._login = this._login.bind(this);
        this._handleKeyPress = this._handleKeyPress.bind(this);
        this.loginWithToken = this.loginWithToken.bind(this);
    }

    componentDidMount(){
        if (!this.state.loggedIn) {
            this.loginWithToken();
        }
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
    _showModal() {
        this.setState({
            show: true,
            message: "",
            messageClass: "info"
        });
        context.executeAction(AuthenticationActions, ["ResetMessages", {}]);
    }

    _hideModal() {
        this.setState({
            show: false,
            message: "",
            messageClass: "info"
        });
        context.executeAction(AuthenticationActions, ["ResetMessages", {}]);
    }

    _handleKeyPress(event)
    {
        //debug("Keypress event ->", event);
        var charCode = event.which || event.charCode || event.keyCode || 0;
        //debug("charCode ->", charCode);
        if (charCode === 13) {
            this._login(event);
        }
    }


    loginWithToken() {
        if (!this.state.loggedIn) {
            //Authentication Service called here.
            context.executeAction(AuthenticationActions, ["LoginWithToken", {}]);
        }
    }

    _login(event) {
        event.preventDefault();
        if (!this.props.loggedIn) {

            this.setState({
                message: "Attempting login with Username " + this.refs.userInput.getValue(),
                messageClass: "info"
            });

            if (this.refs.userInput.getValue() !== "" && this.refs.passInput.getValue() !== "") {
                //Authentication Service called here.
                context.executeAction(AuthenticationActions, ["Login", {
                    username: this.refs.userInput.getValue(),
                    password: this.refs.passInput.getValue(),
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
        var mainButtonText = "";
        var actionButtonText = "";

        if (this.props.loggedIn) {
            headerText = "User Profile";
            mainButtonText = "Logout";
            actionButtonText = "Sign Out";
        }
        else {
            headerText = "Please sign in...";
            mainButtonText = "Login";
            actionButtonText = "Sign In";
        }

        var form =
            <div className="login-form-group">
            </div>;

        //Main page buttons which serve as the entrypoint of the modal
        // TODO: have style props which change how main buttons look
        var mainbuttons =
            <div className="login-mainButtons">
                <Button bsStyle="info" onClick={this._showModal}>
                    User Profile
                </Button>
                <Button bsStyle="primary" onClick={this._login}>
                    {mainButtonText}
                </Button>
            </div>;

        //alert which is displayed when password is wrong etc
        //also temporarily used to display user info
        var alert =<div className="login-alert"></div>;

        if (this.state.message !== "")
        {
            alert= <Alert bsSize="medium" bsStyle={this.state.messageClass}>{this.state.message}</Alert>
        }

        //if there is no user logged in show the input form and change the main page buttons
        if (!this.props.loggedIn){
            form =
                <div className="login-form-group">
                    <Row>
                        <Col xs={6}>
                            <Input type="text" ref="userInput" placeholder="Username" onKeyPress={this._handleKeyPress}/>
                        </Col>
                        <Col xs={6}>
                            <Input type="password" ref="passInput" placeholder="Password" onKeyPress={this._handleKeyPress}/>
                            <Input type="checkbox" label="Remember me" ref="rememberMeInput" />
                        </Col>
                    </Row>
                </div>;

            mainbuttons =
                <Button bsStyle="primary" onClick={this._showModal}>
                    {mainButtonText}
                </Button>;
        }


        return (
            <div>
                {mainbuttons}
                <Modal
                    {...this.props}
                    show={this.state.show}
                    onHide={this._hideModal}
                    dialogClassName="login-modal"
                    >
                    <Modal.Header closeButton modalClassName="login-modal-header">
                        <Modal.Title id="contained-modal-title-lg" modalClassName="login-modal-title">{headerText}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {form}
                        {alert}
                        <AuthenticationUserView {...this.props}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this._hideModal}>Close</Button>
                        <Button onClick={this._login} bsStyle="primary">{actionButtonText}</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
}

AuthenticationComponent.propTypes = {
};

AuthenticationComponent = connectToStores(AuthenticationComponent, [AuthenticationStore], function (context, props) {
    return context.getStore(AuthenticationStore).getState()
});

export default AuthenticationComponent;
