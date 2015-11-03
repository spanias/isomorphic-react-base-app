/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {ButtonToolbar, Button, Input, Row, Col, Alert, Panel} from 'react-bootstrap';
import {Image, Label} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';
import AuthenticationFirstNameInput from "./authenticationFirstNameInput";
import AuthenticationLastNameInput from "./authenticationLastNameInput";
import AuthenticationEmailInput from "./authenticationEmailInput";
import TimedAlertBox from '../../timedAlertBox/timedAlertBox';

var debug = require('debug')('AuthenticationUserDetailsView');
//todo: Higher Order Components
class AuthenticationUserDetailsView extends React.Component {

    constructor(props, context) {
        super(props,context);
        this.state = {
            user: "",
            imageURL: "",
            firstName: "",
            lastName: "",
            email: "",
            emailValid: false,
            verified: false
        };

        this._refreshStateWithProps = this._refreshStateWithProps.bind(this);
        this._handleFirstNameInput = this._handleFirstNameInput.bind(this);
        this._handleLastNameInput = this._handleLastNameInput.bind(this);
        this._handleEmailChange = this._handleEmailChange.bind(this);
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
        if (typeof nextProps !== "undefined" && nextProps.loggedIn) {
            this.setState({
                user: nextProps.user,
                imageURL: nextProps.imageURL,
                firstName: nextProps.firstName,
                lastName: nextProps.lastName,
                email: nextProps.email,
                emailValid: this.refs.AuthenticationEmailInput.isValid(),
                verified: nextProps.verified
            });
        }
        else {
            this.setState({
                user: "",
                imageURL:"",
                firstName: "",
                lastName: "",
                email:"",
                emailValid: false,
                verified: false
            });
        }
    }

    _requestValidationEmail(){
        debug("Calling request verification email!");
        context.executeAction(AuthenticationActions, ["UpdateUserDetailsMessage", {style: "info", message: "Verification email requested.", appearFor: 10}]);
        context.executeAction(AuthenticationActions, ["RequestVerificationEmail", {jwt: this.props.jwt}]);
    }

    _hasChanges()
    {
        return (this.state.email != this.props.email ||
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
            if (this.refs.AuthenticationEmailInput.hasChanges() && this.refs.AuthenticationEmailInput.isValid())
            {
                myUser.email = this.refs.AuthenticationEmailInput.getValue();
            }
            context.executeAction(AuthenticationActions,["UpdateUserDetailsMessage", {style: "info", message: "Updating user details.", appearFor: 10}]);
            context.executeAction(AuthenticationActions, ["ChangeUserDetails", {jwt: this.props.jwt, myUser: myUser}]);
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

    _handleEmailChange() {
        this.setState({
            email: this.refs.AuthenticationEmailInput.getValue(),
            emailValid: this.refs.AuthenticationEmailInput.isValid()
        });
    }

    render() {
        debug("Rendering");
        var userDetailsView = "";
        var saveButton = <Button disabled>Save changes</Button>;
        if (this._hasChanges() && this.state.emailValid){
            saveButton = <Button onClick={this._updateUserDetails}>Save changes</Button>;
        }

        var errorAlert =  '';
        if (this.props.changeUserDetailsMessage)
        {
            errorAlert =  <TimedAlertBox style={this.props.changeUserDetailsMessageStyle} message={this.props.changeUserDetailsMessage} appearsUntil={this.props.changeUserDetailsMessageValidUntil}/>;
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

        if (this.props.loggedIn){
            userDetailsView =
                <div className="authentication-userView-group">
                    <Panel header="User Information" bsStyle="primary">
                        <Row>
                            <Col xs={6}>
                                <img src={this.state.imageURL} style={avatarStyle} className="authenticationUserView-avatar"/>
                            </Col>
                            <Col xs={6}>
                                <div style={usernameDIV}>
                                    <span style={usernameLabelSpan}>Username:</span>
                                    <span style={usernameSpan}>{this.state.user}</span>
                                </div>
                            </Col>
                        </Row>
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
                        <Row>
                            <Col xs={12}>
                                <AuthenticationEmailInput
                                    ref="AuthenticationEmailInput"
                                    email={this.props.email}
                                    verified={this.props.verified}
                                    requestValidationEmail={this._requestValidationEmail}
                                    onChange={this._handleEmailChange}
                                    />
                            </Col>
                        </Row>
                        {errorAlert}
                        {saveButton}
                    </Panel>
                </div>;
        }



        return (
            <div>
                {userDetailsView}
            </div>
        );
    }
}

AuthenticationUserDetailsView.propTypes = {
};

export default AuthenticationUserDetailsView;
