/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {ButtonToolbar, Modal, Button, Input, Row, Col, Alert, ModalTrigger} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';
import AuthenticationMainStore from '../stores/authenticationMainStore';
import AuthenticationLoginView from '../components/authenticationLoginView';
var debug = require('debug')('EmailVerificationPage');

class EmailVerificationPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            message: "",
            messageClass: "danger"
        }
        this._login=this._login.bind(this);
    }
    componentDidMount(){
        if (this.props.loggedIn){
            if(props.params.token){
                //verify email

            }
        }
    }
    _verifyEmailWithToken() {

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
        var loginForm = '';
        var alert ='';
        if (this.state.message !== "")
        {
            alert= <Alert bsSize="medium" bsStyle={this.state.messageClass}>{this.state.message}</Alert>
        }

        //if there is no user logged in show the input form and change the main page buttons
        if (!this.props.loggedIn){

            loginForm =
                <div>
                    <h2>
                        You need to log in before we can verify your email address
                    </h2>
                    <AuthenticationLoginView ref='loginView' onSubmit={this._login} />
                </div>;
        }

        return (
        <div className="container">
            <h1> Email Verification Page! </h1>
            {loginForm}
            {alert}
        </div>
        );
    }
}
EmailVerificationPage.propTypes = {
};

EmailVerificationPage = connectToStores(EmailVerificationPage, [AuthenticationMainStore], function (context, props) {
    return context.getStore(AuthenticationMainStore).getState()
});
export default EmailVerificationPage;