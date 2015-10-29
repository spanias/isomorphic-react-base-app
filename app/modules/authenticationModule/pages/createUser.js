/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {ButtonToolbar, Modal, Button, Input, Row, Col, Alert, ModalTrigger} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';
import AuthenticationMainStore from '../stores/authenticationMainStore';

var debug = require('debug')('CreateUserPage');

class CreateUserPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            message: "",
            messageClass: "danger",
            tokenSubmitted: false
        };
        this._login=this._login.bind(this);
        this._submitToken = this._submitToken.bind(this);
    }

    _submitToken()
    {
        if (this.props.loggedIn && this.props.params.token) {
            this.setState({tokenSubmitted: true});
            context.executeAction(AuthenticationActions, ["VerifyEmail", {
                jwt: this.props.jwt,
                token: this.props.params.token
            }]);
        }
    }

    _login(event) {

        if (event) {
            event.preventDefault();
        }
        if (!this.props.loggedIn) {
            this.setState({
                message: "Attempting login with Username " + this.refs.loginView.getUsernameValue(),
                messageClass: "info"
            });

            if (this.refs.loginView.getUsernameValue() != "" && this.refs.loginView.getPasswordValue() != "") {
                //Authentication Service called here.
                context.executeAction(AuthenticationActions, ["Login", {
                    username: this.refs.loginView.getUsernameValue(),
                    password: this.refs.loginView.getPasswordValue(),
                    rememberMe: false
                }]);
            }
            else {
                this.setState({
                    message: "Username or password cannot be empty!",
                    messageClass: "danger"
                });
            }
        }
    }

    render(){


        return (
            <div className="container">
                <h1> Create User Page! </h1>

            </div>
        );
    }
}
CreateUserPage.propTypes = {

};

CreateUserPage = connectToStores(CreateUserPage, [AuthenticationMainStore], function (context, props) {
    return context.getStore(AuthenticationMainStore).getState();
});
export default CreateUserPage;