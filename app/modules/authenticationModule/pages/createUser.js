/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import { Panel, Button, Input, Row, Col} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';

import AuthenticationMainStore from '../stores/authenticationMainStore';
import AuthenticationTextInputStore from '../../stateless-input/stores/textInputStore';

import FirstNameInput from "../../stateless-input/components/FirstNameInput";
import UsernameInput from "../../stateless-input/components/UsernameInput";
import LastNameInput from "../../stateless-input/components/LastNameInput";
import EmailInput from "../../stateless-input/components/EmailInput";
import NewPasswordInput from '../../stateless-input/components/NewPasswordInput';

var debug = require('debug')('CreateUserPage');

var usernameFieldName = "AuthenticationCreateUsernameField";
var emailFieldName = "AuthenticationCreateEmailField";
var newPasswordFieldName = "AuthenticationCreateNewPasswordField";
var confirmPasswordFieldName = "AuthenticationCreateConfirmPasswordField";
var firstNameFieldName = "AuthenticationCreateFirstNameField";
var lastNameFieldName = "AuthenticationCreateLastNameField";

class CreateUserPage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        var createUserForm = '';
        if (!this.props.AuthenticationMainStore.loggedIn)
        {
            createUserForm=  <div className="authentication-createUser-group">
                <Panel header="New User Information" bsStyle="primary">
                    <Row>
                        <Col xs={6}>
                            <UsernameInput
                                fieldName={usernameFieldName}
                                username={this.props.AuthenticationMainStore.username}
                                validateLazyOnChange={true}
                                />
                        </Col>
                        <Col xs={6}>
                            <EmailInput
                                fieldName={emailFieldName}
                                addonAfter=""
                                initialValue={this.props.AuthenticationMainStore.email}
                                validateOnChange={true}
                                />
                        </Col>
                    </Row>

                    <NewPasswordInput
                        newPasswordFieldName = {newPasswordFieldName}
                        confirmPasswordFieldName = {confirmPasswordFieldName}
                        />

                    <Row>
                        <Col xs={6}>
                            <FirstNameInput
                                fieldName={firstNameFieldName}
                                initialValue={this.props.AuthenticationMainStore.firstName}
                                validateOnChange = {true}
                                />
                        </Col>
                        <Col xs={6}>
                            <LastNameInput
                                fieldName={lastNameFieldName}
                                initialValue={this.props.AuthenticationMainStore.lastName}
                                validateOnChange = {true}
                                />
                        </Col>
                    </Row>
                </Panel>
            </div>;
        }

        return (
            <div className="container">
                {createUserForm}
            </div>
        );
    }
}

CreateUserPage.propTypes = {

};

CreateUserPage = connectToStores(CreateUserPage, [AuthenticationMainStore, AuthenticationTextInputStore], function (context, props) {
    return {
        TextInputStore: context.getStore(AuthenticationTextInputStore).getState(),
        AuthenticationMainStore: context.getStore(AuthenticationMainStore).getState()
    };
});
export default CreateUserPage;