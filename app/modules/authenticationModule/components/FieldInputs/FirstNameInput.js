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

var debug = require('debug')('AuthenticationFirstNameInput');

class AuthenticationFirstNameInput extends React.Component {

    constructor(props, context) {
        super(props, context);
    }
    render() {
        debug("Rendering");

        var label = "First Name";
        if (this.props.label){
            label = this.props.label;
        }
        var placeholder = "";
        if (this.props.placeholder){
            placeholder = this.props.placeholder;
        }

        var addonAfter = '';
        if (this.props.addonAfter){
            addonAfter = this.props.addonAfter;
        }

        var validationFunction = TextInputActions.validateFirstName;
        if (this.props.validationFunction) {
            validationFunction = this.props.validationFunction;
        }
        var firstNameInput =
            <TextInput
                {...this.props}
                fieldType="firstNameInput"
                fieldAfter={addonAfter}
                placeholder = {placeholder}
                label = {label}
                validationFunction = {validationFunction}
                />;
        return (
            <div>
                {firstNameInput}
            </div>
        );
    }
}
AuthenticationFirstNameInput = connectToStores(AuthenticationFirstNameInput,
    [AuthenticationTextInputStore],
    function (context, props) {
        return {
            TextInputStore: context.getStore(AuthenticationTextInputStore).getState(),
        };
    });
AuthenticationFirstNameInput.propTypes = {
    fieldName: React.PropTypes.string.isRequired,
    initialValue: React.PropTypes.string,
    validateOnChange: React.PropTypes.bool,
    validateOnBlur: React.PropTypes.bool,
};

export default AuthenticationFirstNameInput;