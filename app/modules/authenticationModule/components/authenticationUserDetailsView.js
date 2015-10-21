/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {ButtonToolbar, Button, Input, Row, Col, Alert, Panel} from 'react-bootstrap';
import {Image, Label} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';
var debug = require('debug')('AuthenticationUserDetailsView');

class AuthenticationUserDetailsView extends React.Component {

    constructor(props, context) {
        super(props,context);
        this.state = {
            visible: false,
            user: "",
            imageURL: "",
            firstName: "",
            lastName: "",
            email: "",
            verified: false
        };

        this._refreshStateWithProps = this._refreshStateWithProps.bind(this);

        this._handleEmailInput = this._handleEmailInput.bind(this);
        this._handleFirstNameInput = this._handleFirstNameInput.bind(this);
        this._handleLastNameInput = this._handleLastNameInput.bind(this);
        this._validateEmail = this._validateEmail.bind(this);
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
                visible: true,
                user: nextProps.user,
                imageURL: nextProps.imageURL,
                firstName: nextProps.firstName,
                lastName: nextProps.lastName,
                email: nextProps.email,
                verified: nextProps.verified
            });
        }
        else {
            this.setState({
                visible: false,
                user: "",
                imageURL:"",
                firstName: "",
                lastName: "",
                email:"",
                verified: false
            });
        }
    }

    _validateEmail() {
        // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if  (re.test(this.state.email))
        {
            return 'success';
        }
        else {
            return 'error';
        }
    }
    _hasChanges()
    {
        return (this.state.email != this.props.email ||
            this.state.firstName != this.props.firstName ||
            this.state.lastName != this.props.lastName );

    }
    _handleEmailInput(){
        this.setState({
            email: this.refs.email.getValue()
        });
    }
    _handleFirstNameInput() {
        this.setState({
            firstName: this.refs.firstName.getValue()
        });
    }

    _handleLastNameInput() {
        this.setState({
            lastName: this.refs.lastName.getValue()
        });
    }

    render() {
        debug("Rendering");
        var userDetailsView =
            <div className="authentication-userDetailsView-group">
            </div>;

        var saveButton = <Button disabled>Save changes</Button>;
        if (this._validateEmail() == 'success' && this._hasChanges()){
            saveButton = <Button>Save changes</Button>;
        }
        var verifiedLabel = <span><Label bsSize="xs" bsStyle="danger">Unverified</Label></span>;
        if (this.state.verified)
        {
            verifiedLabel = <span><Label bsSize="xs" bsStyle="success">Verified</Label></span>;
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
                                <Input
                                    type="text"
                                    placeholder="Enter text"
                                    label="First Name"
                                    ref="firstName"
                                    value={this.state.firstName}
                                    defaultValue={this.props.firstName}
                                    onChange={this._handleFirstNameInput}/>
                            </Col>
                            <Col xs={6}>
                                <Input
                                    type="text"
                                    placeholder="Enter text"
                                    label="Last Name"
                                    ref="lastName"
                                    value = {this.state.lastName}
                                    defaultValue={this.props.lastName}
                                    onChange={this._handleLastNameInput}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <Input
                                    type="text"
                                    placeholder="someone@somewhere.com"
                                    label="E-Mail Address"
                                    addonAfter={verifiedLabel}
                                    ref="email"
                                    bsStyle={this._validateEmail()}
                                    value = {this.state.email}
                                    defaultValue={this.props.email}
                                    onChange={this._handleEmailInput}
                                    />
                            </Col>
                        </Row>
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
