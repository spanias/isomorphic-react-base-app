/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {Button, Input} from 'react-bootstrap';
import {Label} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';
var debug = require('debug')('AuthenticationEmailInput');

class AuthenticationEmailInput extends React.Component {

    constructor(props, context) {
        super(props,context);
        this.state = {
            email: "",
            verified: false
        };

        this._refreshStateWithProps = this._refreshStateWithProps.bind(this);
        this._handleEmailInput = this._handleEmailInput.bind(this);
        this._validateEmail = this._validateEmail.bind(this);
        this.hasChanges = this.hasChanges.bind(this);
        this.isValid = this.isValid.bind(this);
        this.getValue = this.getValue.bind(this);
    }
    componentDidMount() {
        if (this.props != null) {
            debug("didMount ->", this.props);
            this._refreshStateWithProps(this.props);
        }
    }
    componentWillReceiveProps(nextProps) {
        //debug("willReceiveProps ->", nextProps);
        //this._refreshStateWithProps(nextProps);
    }

    _refreshStateWithProps(nextProps) {
        if (typeof nextProps !== "undefined") {
            this.setState({
                email: nextProps.email,
            });
        }
        else {
            this.setState({
                email:"",
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
    _handleEmailInput(){
        this.setState({email: this.getValue()});
        this.props.onChange();
    }

    hasChanges() {
        return (this.state.email != this.props.email);
    }

    isValid(){
        return (this._validateEmail() == "success");
    }
    getValue(){
        return this.refs.email.getValue();
    }


    render() {
        debug("Rendering");
        var verifiedLabel = <span><Button bsSize="xsmall" bsStyle="danger" onClick={this.props.requestValidationEmail}>Unverified</Button></span>;
        if (this.props.verified) {
            verifiedLabel = <span><Label bsSize="xs" bsStyle="success">Verified</Label></span>;
        }
        var emailInput =
            <Input
                type="text"
                placeholder="someone@somewhere.com"
                label="E-Mail Address"
                addonAfter={verifiedLabel}
                ref="email"
                bsStyle={this._validateEmail()}
                value={this.state.email}
                defaultValue={this.props.email}
                onChange={this._handleEmailInput}
                />;
        return (
            <div>
                {emailInput}
            </div>
        );
    }
}

AuthenticationEmailInput.propTypes = {
};

export default AuthenticationEmailInput;
