/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {ButtonToolbar, Button, Input, Row, Col, Alert, Panel} from 'react-bootstrap';
import {Image, Label} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';

import {TimedAlertBox, MessagingActions} from '../../stateless-react-notifications/index';
import {FirstNameInput,LastNameInput,EmailInput,TextInputStore} from '../../stateless-react-input/index';

var emailFieldName =  "AuthenticationEmailInput";
var firstNameFieldName =  "AuthenticationFirstNameInput";
var lastNameFieldName =  "AuthenticationLastNameInput";

var userDetailsViewMessageName = "UserDetailsViewMessage";

var debug = require('debug')('AuthenticationUserDetailsView');

class AuthenticationUserDetailsView extends React.Component {

    constructor(props, context) {
        super(props,context);

        this._updateUserDetails =this._updateUserDetails.bind(this);
        this._requestValidationEmail = this._requestValidationEmail.bind(this);
        this._hasChanges = this._hasChanges.bind(this);
    }

    _requestValidationEmail() {
        debug("Calling request verification email!");
        context.executeAction(
            AuthenticationActions.requestVerificationEmail,
            {
                jwt: this.props.jwt,
                messagingName: userDetailsViewMessageName
            }
        );
    }

    _hasChanges()
    {
        return ((this.props.TextInputStore[emailFieldName] && this.props.TextInputStore[emailFieldName].hasChanges) ||
        (this.props.TextInputStore[firstNameFieldName] && this.props.TextInputStore[firstNameFieldName].hasChanges) ||
        (this.props.TextInputStore[lastNameFieldName] && this.props.TextInputStore[lastNameFieldName].hasChanges) );
    }

    _updateUserDetails() {
        if(this._hasChanges())
        {
            var myUser = {};
            myUser.username = this.props.user;
            if (this.props.TextInputStore[firstNameFieldName] && this.props.TextInputStore[firstNameFieldName].hasChanges && this.props.TextInputStore[firstNameFieldName].isValid)
            {
                myUser.firstName = this.props.TextInputStore[firstNameFieldName].fieldValue;
            }
            if (this.props.TextInputStore[lastNameFieldName] &&  this.props.TextInputStore[lastNameFieldName].hasChanges && this.props.TextInputStore[lastNameFieldName].isValid)
            {
                myUser.lastName = this.props.TextInputStore[lastNameFieldName].fieldValue;
            }
            if (this.props.TextInputStore[emailFieldName] && this.props.TextInputStore[emailFieldName].hasChanges && this.props.TextInputStore[emailFieldName].isValid)
            {
                myUser.email = this.props.TextInputStore[emailFieldName].fieldValue;
            }

            context.executeAction(
                MessagingActions.updateMessage,
                {
                    messageName: userDetailsViewMessageName,
                    values: {
                        message: "Updating user details.",
                        appearFor: 20,
                        messageStyle: "info"
                    }
                }
            );

            context.executeAction(
                AuthenticationActions.changeUserDetails,
                {
                    jwt: this.props.jwt,
                    myUser: myUser,
                    messagingName: userDetailsViewMessageName
                }
            );
        }
        else {
            context.executeAction(
                MessagingActions.updateMessage,
                {
                    messageName: userDetailsViewMessageName,
                    values: {
                        message: "No changes to perform.",
                        appearFor: 5,
                        messageStyle: "warning"
                    }
                }
            );
        }
    }

    render() {
        debug("Rendering");
        //debug ("HasChanges: " + this._hasChanges() + " emailValid: " + this.props.TextInputStore[emailFieldName].isValid)
        var saveButton = <Button disabled>Save changes</Button>;
        if (this._hasChanges() &&
            this.props.TextInputStore[emailFieldName] &&
            this.props.TextInputStore[emailFieldName].isValid &&
            this.props.TextInputStore[firstNameFieldName] &&
            this.props.TextInputStore[firstNameFieldName].isValid &&
            this.props.TextInputStore[lastNameFieldName] &&
            this.props.TextInputStore[lastNameFieldName].isValid) {
            saveButton = <Button onClick={this._updateUserDetails}>Save changes</Button>;
        }

        var errorAlert = <TimedAlertBox messagingName={userDetailsViewMessageName} />;
        var avatarStyle = {
            "borderRadius": '50px',
            "width": '125px',
            "height": '140px',
            "paddingBottom": "20px",
            "marginLeft": "40px",
            "marginTop": "10px"
        };

        var usernameDIV = {
            "paddingBottom": "20px",
            "marginTop": "40px"
        };
        var usernameLabelSpan = {
            "fontSize": "24px",
            "fontWeight": "bold"
        };
        var usernameSpan = {
            "fontSize": "24px",
            "paddingLeft": "5px"
        };

        return (
            <div className="authentication-userView-group">
                <Panel header="User Information" bsStyle="primary">
                    <Row>
                        <Col xs={6}>
                            <img src={this.props.imageURL} style={avatarStyle}
                                 className="authenticationUserView-avatar"/>
                        </Col>
                        <Col xs={6}>
                            <div style={usernameDIV}>
                                <span style={usernameLabelSpan}>Username:</span>
                                <span style={usernameSpan}>{this.props.user}</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            <FirstNameInput
                                fieldName={firstNameFieldName}
                                initialValue={this.props.firstName}
                                validateOnChange = {true}
                                />
                        </Col>
                        <Col xs={6}>
                            <LastNameInput
                                fieldName={lastNameFieldName}
                                initialValue={this.props.lastName}
                                validateOnChange = {true}
                                />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <EmailInput
                                fieldName={emailFieldName}
                                initialValue={this.props.email}
                                verified={this.props.verified}
                                requestValidationEmail={this._requestValidationEmail}
                                validateOnChange = {true}
                                />
                        </Col>
                    </Row>
                    {errorAlert}
                    {saveButton}
                </Panel>
            </div>
        );
    }
}

AuthenticationUserDetailsView = connectToStores(AuthenticationUserDetailsView,
    [TextInputStore],
    function (context, props) {
        return {
            TextInputStore: context.getStore(TextInputStore).getState()
        };
    });

AuthenticationUserDetailsView.propTypes = {
    jwt: React.PropTypes.string.isRequired,
    user:React.PropTypes.string.isRequired,
    imageURL: React.PropTypes.string,
    firstName: React.PropTypes.string.isRequired,
    lastName: React.PropTypes.string.isRequired,
    email: React.PropTypes.string.isRequired,
    verified: React.PropTypes.bool.isRequired
};

export default AuthenticationUserDetailsView;
