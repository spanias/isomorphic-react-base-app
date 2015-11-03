/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import { Panel, Button, Input, Row, Col} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';
import AuthenticationMainStore from '../stores/authenticationMainStore';

import AuthenticationFirstNameInput from "../components/authenticationFirstNameInput";
import AuthenticationUsernameInput from "../components/authenticationUsernameInput";
import AuthenticationLastNameInput from "../components/authenticationLastNameInput";
import AuthenticationEmailInput from "../components/authenticationEmailInput";
import AuthenticationNewPasswordInput from '../components/authenticationNewPasswordInput';

var debug = require('debug')('CreateUserPage');

class CreateUserPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            newPassword: "",
            newPasswordInputValid: false,
            confirmPassword: ""
        };
        this._handleNewPasswordInput = this._handleNewPasswordInput.bind(this);
        this._handleConfirmPasswordInput = this._handleConfirmPasswordInput.bind(this);
    }

    _handleNewPasswordInput() {
        this.setState({
            newPassword: this.refs.newPasswordInput.getNewPasswordValue(),
            newPasswordInputValid: this.refs.newPasswordInput.isValid()
        });
    }
    _handleConfirmPasswordInput() {
        this.setState({
            confirmPassword: this.refs.newPasswordInput.getConfirmPasswordValue(),
            newPasswordInputValid: this.refs.newPasswordInput.isValid()
        });
    }

    render() {
        var createUserForm = '';
        if (!this.props.loggedIn)
        {
            createUserForm=  <div className="authentication-createUser-group">
                <Panel header="User Information" bsStyle="primary">
                    <Row>
                        <Col xs={6}>
                            <AuthenticationUsernameInput
                                ref="AuthenticationUsernameInput"
                                username={this.props.username}
                                onChange={this._handleUsernameInput}
                                />
                        </Col>
                        <Col xs={6}>
                            <AuthenticationEmailInput
                                ref="AuthenticationEmailInput"
                                email={this.props.email}
                                verified={this.props.verified}
                                requestValidationEmail={this._requestValidationEmail}
                                onChange={this._handleEmailChange}
                                />
                        </Col>
                    </Row>

                    <AuthenticationNewPasswordInput ref='newPasswordInput'
                                                    onNewPasswordChange = {this._handleNewPasswordInput}
                                                    onConfirmPasswordChange = {this._handleConfirmPasswordInput}
                        />

                    <Row>
                        <Col xs={6}>
                            <AuthenticationFirstNameInput
                                ref="AuthenticationFirstNameInput"
                                firstName={this.props.firstName}
                                onChange={this._handleFirstNameInput}
                                />
                        </Col>
                        <Col xs={6}>
                            <AuthenticationLastNameInput
                                ref="AuthenticationLastNameInput"
                                lastName={this.props.lastName}
                                onChange={this._handleLastNameInput}/>
                        </Col>
                    </Row>
                </Panel>
            </div>;

        }

        return (
            <div className="container">
                <h1> Create User Page! </h1>
                {createUserForm}
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