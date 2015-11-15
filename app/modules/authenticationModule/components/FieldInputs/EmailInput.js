/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {Button, Input} from 'react-bootstrap';
import {Label} from 'react-bootstrap';

import TextInputActions  from '../../actions/textInputActions';

import TextInput from './TextInput';
import AuthenticationTextInputStore from '../../stores/authenticationTextInputStore';

var debug = require('debug')('AuthenticationEmailInput');

class AuthenticationEmailInput extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        debug("Rendering");

        var label = "E-Mail Address";
        if (this.props.label){
            label = this.props.label;
        }
        var placeholder = "someone@somewhere.com";
        if (this.props.placeholder){
            placeholder = this.props.placeholder;
        }

        var verifiedLabel = '';
        verifiedLabel = <span><Button bsSize="xsmall" bsStyle="danger" onClick={this.props.requestValidationEmail}>Unverified</Button></span>;
        if (this.props.verified) {
            verifiedLabel = <span><Label bsSize="xs" bsStyle="success">Verified</Label></span>;
        }

        if (this.props.addonAfter){
            verifiedLabel = this.props.addonAfter;
        }
        var validationFunction = TextInputActions.validateEmail;
        if (this.props.validationFunction) {
            validationFunction = this.props.validationFunction;
        }

        var emailInput =
            <TextInput
                {...this.props}
                fieldType="emailInput"
                fieldAfter={verifiedLabel}
                placeholder = {placeholder}
                label = {label}
                validationFunction = {validationFunction}
                />;
        return (
            <div>
                {emailInput}
            </div>
        );
    }
}
AuthenticationEmailInput = connectToStores(AuthenticationEmailInput,
    [AuthenticationTextInputStore],
    function (context, props) {
        return {
            TextInputStore: context.getStore(AuthenticationTextInputStore).getState(),
        };
    });
AuthenticationEmailInput.propTypes = {
    fieldName: React.PropTypes.string.isRequired,
    initialValue: React.PropTypes.string,
    validateOnChange: React.PropTypes.bool,
    validateOnBlur: React.PropTypes.bool,
    requestValidationEmail: React.PropTypes.func
};

export default AuthenticationEmailInput;
