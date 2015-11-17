/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';

import TextInput from './TextInput';
import TextInputActions  from '../actions/textInputActions';
import TextInputStore from '../stores/textInputStore';

var debug = require('debug')('FirstNameInput');

class FirstNameInput extends React.Component {

    constructor(props, context) {
        super(props, context);
    }
    render() {
        debug("Rendering");

        var label = "First Name";
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
FirstNameInput = connectToStores(FirstNameInput,
    [TextInputStore],
    function (context, props) {
        return {
            TextInputStore: context.getStore(TextInputStore).getState(),
        };
    });
FirstNameInput.propTypes = {
    fieldName: React.PropTypes.string.isRequired,
    initialValue: React.PropTypes.string,
    validateOnChange: React.PropTypes.bool,
    validateOnBlur: React.PropTypes.bool
};

export default FirstNameInput;