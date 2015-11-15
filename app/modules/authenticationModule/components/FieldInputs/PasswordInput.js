/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {Button, Input} from 'react-bootstrap';
import {Label} from 'react-bootstrap';

import TextInput from './TextInput';
import TextInputActions  from '../../actions/textInputActions';
import AuthenticationTextInputStore from '../../stores/authenticationTextInputStore';

var debug = require('debug')('AuthenticationPasswordInput');

class AuthenticationPasswordInput extends React.Component {

    constructor(props, context) {
        super(props, context);
    }
    render() {
        debug("Rendering");

        var label = "Password";
        if (this.props.label!= undefined){
            label = this.props.label;
        }
        var placeholder = "";
        if (this.props.placeholder!= undefined){
            placeholder = this.props.placeholder;
        }

        var addonAfter = '';
        if (this.props.addonAfter!= undefined){
            addonAfter = this.props.addonAfter;
        }

        var validationFunction = TextInputActions.validatePassword;
        if (this.props.validationFunction) {
            validationFunction = this.props.validationFunction;
        }

        var fieldResetOnUnmount = true;
        if (this.props.fieldResetOnUnmount != undefined){
            fieldResetOnUnmount = this.props.fieldResetOnUnmount;
        }
        var passwordInput =
            <TextInput
                {...this.props}
                fieldType="passwordInput"
                fieldAfter={addonAfter}
                fieldResetOnUnmount= {fieldResetOnUnmount}
                placeholder = {placeholder}
                label = {label}
                validationFunction = {validationFunction}
                />;
        return (
            <div>
                {passwordInput}
            </div>
        );
    }
}
AuthenticationPasswordInput = connectToStores(AuthenticationPasswordInput,
    [AuthenticationTextInputStore],
    function (context, props) {
        return {
            TextInputStore: context.getStore(AuthenticationTextInputStore).getState(),
        };
    });
AuthenticationPasswordInput.propTypes = {
    fieldName: React.PropTypes.string.isRequired,
    fieldResetOnUnmount: React.PropTypes.bool,
    initialValue: React.PropTypes.string,
    validateOnChange: React.PropTypes.bool,
    validateOnBlur: React.PropTypes.bool
};

export default AuthenticationPasswordInput;