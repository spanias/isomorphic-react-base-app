/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {ButtonToolbar, Button, Input, Row, Col, Alert, Panel} from 'react-bootstrap';
import {Image, Label} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';
import FirstNameInput from "./FieldInputs/FirstNameInput";
import LastNameInput from "./FieldInputs/LastNameInput";
import EmailInput from "./FieldInputs/EmailInput";
import TimedAlertBox from '../../timedAlertBox/timedAlertBox';

import AuthenticationTextInputStore from '../stores/authenticationTextInputStore';

var emailFieldName =  "AuthenticationEmailInput";
var debug = require('debug')('AuthenticationUserDetailsView');
//todo: Higher Order Components
class AuthenticationUserDetailsView extends React.Component {

    constructor(props, context) {
        super(props,context);
        this.state = {
            firstName: "",
            lastName: ""
        };

        this._refreshStateWithProps = this._refreshStateWithProps.bind(this);
        this._handleFirstNameInput = this._handleFirstNameInput.bind(this);
        this._handleLastNameInput = this._handleLastNameInput.bind(this);
        this._updateUserDetails =this._updateUserDetails.bind(this);
        this._requestValidationEmail = this._requestValidationEmail.bind(this);
        this._hasChanges = this._hasChanges.bind(this);
    }
    componentDidMount() {
        if (this.props != null) {
            debug("didMount ->", this.props);
            this._refreshStateWithProps(this.props);
        }
    }
    componentWillReceiveProps(nextProps) {
        debug("willReceiveProps ->", nextProps);
        this._refreshStateWithProps(nextProps);
    }

    _refreshStateWithProps(nextProps) {
        if (typeof nextProps !== "undefined") {
            this.setState({
                firstName: nextProps.firstName,
                lastName: nextProps.lastName
            });
        }
    }

    _requestValidationEmail() {
        debug("Calling request verification email!");


        context.executeAction(
            AuthenticationActions.requestVerificationEmail,
            {jwt: this.props.jwt}
        );
    }

    _hasChanges()
    {
        return (this.props.TextInputStore[emailFieldName].fieldValue != this.props.email ||
            this.state.firstName != this.props.firstName ||
            this.state.lastName != this.props.lastName );
    }

    _updateUserDetails() {
        if(this._hasChanges())
        {
            var myUser = {};
            myUser.username = this.props.user;
            if (this.refs.AuthenticationFirstNameInput.hasChanges())
            {
                myUser.firstName = this.refs.AuthenticationFirstNameInput.getValue();
            }
            if (this.refs.AuthenticationLastNameInput.hasChanges())
            {
                myUser.lastName = this.refs.AuthenticationLastNameInput.getValue();
            }
            if (this.props.TextInputStore[emailFieldName] && this.props.TextInputStore[emailFieldName].hasChanges && this.props.TextInputStore[emailFieldName].isValid)
            {
                myUser.email = this.props.TextInputStore[emailFieldName].fieldValue;
            }
            context.executeAction(
                AuthenticationActions.updateUserDetailsMessage,
                {
                    message: "Updating user details.",
                    appearFor: 10,
                    style: "info"
                }
            );


            context.executeAction(
                AuthenticationActions.changeUserDetails,
                {
                    jwt: this.props.jwt,
                    myUser: myUser
                }
            );
        }
    }

    _handleFirstNameInput() {
        this.setState({
            firstName: this.refs.AuthenticationFirstNameInput.getValue()
        });
    }

    _handleLastNameInput() {
        this.setState({
            lastName: this.refs.AuthenticationLastNameInput.getValue()
        });
    }

    render() {
        debug("Rendering");
        debug ("HasChanges: " + this._hasChanges() + " emailValid: " + this.props.TextInputStore[emailFieldName].isValid)
        var saveButton = <Button disabled>Save changes</Button>;
        if (this._hasChanges() && this.props.TextInputStore[emailFieldName].isValid) {
            saveButton = <Button onClick={this._updateUserDetails}>Save changes</Button>;
        }

        var errorAlert = '';
        if (this.props.changeUserDetailsMessage) {
            errorAlert = <TimedAlertBox style={this.props.changeUserDetailsMessageStyle}
                                        message={this.props.changeUserDetailsMessage}
                                        appearsUntil={this.props.changeUserDetailsMessageValidUntil}/>;
        }
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
                                ref="AuthenticationFirstNameInput"
                                firstName={this.props.firstName}
                                onChange={this._handleFirstNameInput}
                                />
                        </Col>
                        <Col xs={6}>
                            <LastNameInput
                                ref="AuthenticationLastNameInput"
                                lastName={this.props.lastName}
                                onChange={this._handleLastNameInput}/>
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
    [AuthenticationTextInputStore],
    function (context, props) {
        return {
            TextInputStore: context.getStore(AuthenticationTextInputStore).getState()
        };
    });


AuthenticationUserDetailsView.propTypes = {
    jwt: React.PropTypes.string.isRequired,
    user:React.PropTypes.string.isRequired,
    imageURL: React.PropTypes.string,
    firstName: React.PropTypes.string.isRequired,
    lastName: React.PropTypes.string.isRequired,
    email: React.PropTypes.string.isRequired,
    verified: React.PropTypes.bool.isRequired,

    changeUserDetailsMessageStyle: React.PropTypes.string,
    changeUserDetailsMessage: React.PropTypes.string,
    changeUserDetailsMessageValidUntil: React.PropTypes.object
};

export default AuthenticationUserDetailsView;
