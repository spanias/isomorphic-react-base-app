/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {Button, Label} from 'react-bootstrap';
import TextInput from './TextInput';
import TextInputActions  from '../actions/textInputActions';
import TextInputStore from '../stores/textInputStore';

var debug = require('debug')('EmailInput');

class EmailInput extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        debug("Rendering");

        var label = "E-Mail Address";
        if (this.props.label!= undefined){
            label = this.props.label;
        }
        var placeholder = "someone@somewhere.com";
        if (this.props.placeholder!= undefined){
            placeholder = this.props.placeholder;
        }

        var verifiedLabel = '';
        if (this.props.addonAfter != undefined){
            verifiedLabel = this.props.addonAfter;
        }
        else {
            verifiedLabel = <span><Button bsSize="xsmall" bsStyle="danger" onClick={this.props.requestValidationEmail}>Unverified</Button></span>;
            if (this.props.verified) {
                verifiedLabel = <span><Label bsSize="xs" bsStyle="success">Verified</Label></span>;
            }
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
EmailInput = connectToStores(EmailInput,
    [TextInputStore],
    function (context, props) {
        return {
            TextInputStore: context.getStore(TextInputStore).getState(),
        };
    });
EmailInput.propTypes = {
    fieldName: React.PropTypes.string.isRequired,
    initialValue: React.PropTypes.string,
    validateOnChange: React.PropTypes.bool,
    validateOnBlur: React.PropTypes.bool,
    requestValidationEmail: React.PropTypes.func
};

export default EmailInput;
