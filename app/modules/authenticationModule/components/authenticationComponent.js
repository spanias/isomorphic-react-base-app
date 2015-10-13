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

class AuthenticationComponent extends React.Component {

    constructor(props, context) {
        super();
        this.state = {
            show: false,
            mainbuttontext: "Login",
            headertext: "Please sign in...",
            actionbuttontext: "Sign In",
            message: "",
            messageclass: "danger"
        };

        this._refreshStateWithProps = this._refreshStateWithProps.bind(this);
        this._showModal = this._showModal.bind(this);
        this._hideModal = this._hideModal.bind(this);
        this._login = this._login.bind(this);
        this._handleKeyPress = this._handleKeyPress.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        console.log("loginElement: Receiving new props ->", nextProps);
        this._refreshStateWithProps(nextProps);
    }


    _refreshStateWithProps(nextProps) {
        if (typeof nextProps !== "undefined" && nextProps.loggedIn) {
            this.setState({

                mainbuttontext: "Logout",
                headertext: "User Profile",
                actionbuttontext: "Sign Out",
                message: "",//"You are already signed in as " + nextProps.user + " who is a user in group: " + nextProps.group,
                messageclass: "info"
            });
        }
        else {
            this.setState({
                mainbuttontext: "Login",
                headertext: "Please sign in...",
                actionbuttontext: "Sign In",
                message: "",
                messageclass: "danger"
            });
            if (typeof nextProps !== "undefined" && nextProps.attempts > 0) {
                this.setState({
                    message: "Username and password combination invalid!"
                });
            }
        }
    }
    _showModal() {
        this._refreshStateWithProps(this.props);
        this.setState({
            show: true
        });
    }

    _hideModal() {
        this.setState({
            show: false,
            message: ""
        });
    }

    _handleKeyPress(event)
    {
        //console.log("Keypress event ->", event);
        var charCode = event.which || event.charCode || event.keyCode || 0;
        //console.log("charCode ->", charCode);
        if (charCode === 13) {
            this._login(event);
        }
    }


    _login(event) {
        event.preventDefault();
        if (!this.props.loggedIn) {

            this.setState({
                message: "Attempting login with Username " + this.refs.userInput.getValue(),
                messageclass: "info"
            });


            if (this.refs.userInput.getValue() !== "" && this.refs.passInput.getValue() !== "") {
                //Authentication Service called here.
                context.executeAction(AuthenticationActions, ["Login", {
                    username: this.refs.userInput.getValue(),
                    password: this.refs.passInput.getValue()
                }]);

            }
            else {
                this.setState({
                    message: "Username or password cannot be empty!",
                    messageclass: "danger"
                });
            }
        }
        else
        {
            context.executeAction(AuthenticationActions, ["Logout", null]);
        }
    }

    render() {
        //Contains the username and password inputs
        var form =
            <div className="login-form-group">
            </div>;

        //Main page buttons which serve as the entrypoint of the modal
        // TODO: have style props which change how main buttons look
        var mainbuttons =
            <div className="login-mainbuttons">
                <Button bsStyle="info" onClick={this._showModal}>
                    User Profile
                </Button>
                <Button bsStyle="primary" onClick={this._login}>
                    {this.state.mainbuttontext}
                </Button>
            </div>;

        //alert which is displayed when password is wrong etc
        //also temporarily used to display user info
        var alert =<div className="login-alert"></div>;

        if (this.state.message !== "")
        {
            alert= <Alert bsSize="medium" bsStyle={this.state.messageclass}>{this.state.message}</Alert>
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
                        </Col>
                    </Row>
                </div>;

            mainbuttons =
                <Button bsStyle="primary" onClick={this._showModal}>
                    {this.state.mainbuttontext}
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
                        <Modal.Title id="contained-modal-title-lg" modalClassName="login-modal-title">{this.state.headertext}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {form}
                        {alert}
                        <AuthenticationUserView />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this._hideModal}>Close</Button>
                        <Button onClick={this._login} bsStyle="primary">{this.state.actionbuttontext}</Button>
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
