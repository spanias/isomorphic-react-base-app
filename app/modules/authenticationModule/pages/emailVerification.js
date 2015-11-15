/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {ButtonToolbar, Modal, Button, Input, Row, Col, Alert, ModalTrigger} from 'react-bootstrap';

import AuthenticationActions  from '../actions/authenticationActions';
import AuthenticationMainStore from '../stores/authenticationMainStore';
import LoginForm from '../components/LoginForm';
import TimedAlertBox from '../../timedAlertBox/timedAlertBox';

import AuthenticationTextInputStore from '../stores/authenticationTextInputStore';

var debug = require('debug')('EmailVerificationPage');

var usernameFieldName = "AuthenticationEmailPageUsernameField";
var passwordFieldName = "AuthenticationEmailPagePasswordField";

class EmailVerificationPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            tokenToSubmit: "",
            tokenSubmitted: false
        };
        this._login=this._login.bind(this);
        this._submitToken = this._submitToken.bind(this);
    }
    componentDidMount(){
        if (this.props.params.token){
            this.setState({tokenToSubmit: this.props.params.token});
        }
    }
    _submitToken()
    {
        if (this.props.AuthenticationMainStore.loggedIn && this.state.tokenToSubmit) {
            context.executeAction(
                AuthenticationActions.updateVerifyEmailMessage,
                {
                    message: "Verifying email " + this.props.email + "...",
                    appearFor: 10,
                    style: "info"
                }
            );
            context.executeAction(
                AuthenticationActions.verifyEmail,
                {
                    jwt: this.props.AuthenticationMainStore.jwt,
                    token: this.state.tokenToSubmit
                }
            );

            this.setState({tokenSubmitted: true});
        }
    }

    _login(event) {
        debug("Logging in: ", this.props.TextInputStore[usernameFieldName].fieldValue,this.props.TextInputStore[passwordFieldName].fieldValue )
        if (!this.props.AuthenticationMainStore.loggedIn) {
            context.executeAction(
                AuthenticationActions.login, {
                    username: this.props.TextInputStore[usernameFieldName].fieldValue,
                    password: this.props.TextInputStore[passwordFieldName].fieldValue,
                    rememberMe: false
                }
            );
        }
        else {
            context.executeAction(AuthenticationActions.logout, {});
        }
    }
    _handleTokenInputChange(){
        this.setState({tokenToSubmit: this.refs.tokenInput.getValue()});
    }
    render(){
        var loginForm = '';
        var loginAlert ='';
        var loginButton = '';
        var tokenForm = '';
        var verificationAlert = '';


        if (this.props.AuthenticationMainStore.loginMessage) {
            loginAlert = <TimedAlertBox style={this.props.AuthenticationMainStore.loginMessageStyle}
                                        message={this.props.AuthenticationMainStore.loginMessage}
                                        appearsUntil={this.props.AuthenticationMainStore.loginMessageValidUntil}/>;
        }
        if (this.props.AuthenticationMainStore.verifyEmailMessage) {
            verificationAlert =  <TimedAlertBox style={this.props.AuthenticationMainStore.verifyEmailMessageStyle}
                                                message={this.props.AuthenticationMainStore.verifyEmailMessage}
                                                appearsUntil={this.props.AuthenticationMainStore.verifyEmailMessageValidUntil}/>;
        }
        //if there is no user logged in show the input form and change the main page buttons
        if (!this.props.AuthenticationMainStore.loggedIn){
            loginButton = <Button onClick={this._login} bsStyle="primary">Sign In</Button>;
            loginForm =
                <div>
                    <h2>
                        You need to log in before we can verify your email address.
                    </h2>
                    <LoginForm usernameFieldName={usernameFieldName} passwordFieldName={passwordFieldName} onSubmit={this._login} />
                </div>;
        }
        else {
            tokenForm=
                <div>
                    <Input type='text' ref="tokenInput" value={this.state.tokenToSubmit} onChange={this._handleTokenInputChange}/>
                    {verificationAlert}
                    <Button onClick={this._submitToken} bsStyle='primary' disabled>Verify</Button>
                </div>;
            if(!this.state.tokenSubmitted && this.state.tokenToSubmit != ""){
                tokenForm=
                    <div>
                        <Input type='text' ref="tokenInput" value={this.state.tokenToSubmit} onChange={this._handleTokenInputChange}/>
                        {verificationAlert}
                        <Button onClick={this._submitToken} bsStyle='primary'>Verify</Button>
                    </div>;
            }
        }

        return (
        <div className="container">
            <h1> Email Verification Page! </h1>
            {loginForm}
            {loginAlert}
            {loginButton}
            {tokenForm}
        </div>
        );
    }
}
EmailVerificationPage.propTypes = {

};

EmailVerificationPage = connectToStores(EmailVerificationPage, [AuthenticationMainStore, AuthenticationTextInputStore], function (context, props) {
    return {
        TextInputStore: context.getStore(AuthenticationTextInputStore).getState(),
        AuthenticationMainStore: context.getStore(AuthenticationMainStore).getState()
        };
});
export default EmailVerificationPage;