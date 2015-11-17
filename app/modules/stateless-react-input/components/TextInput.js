/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {Button, Input, Label} from 'react-bootstrap';

import TextInputActions  from '../actions/textInputActions';
import TextInputStore from '../stores/textInputStore';

var validationTimer = null;
var lazyValidationTimeout = 500;
var debug = require('debug')('TextInput');

class TextInput extends React.Component {


    constructor(props, context) {
        super(props, context);

        this._hasChanges = this._hasChanges.bind(this);
        this._onChangeInput = this._onChangeInput.bind(this);
        this._onBlurInput = this._onBlurInput.bind(this);
        this._onFocusInput = this._onFocusInput.bind(this);
        this._initializeValueAndValidationWithProps = this._initializeValueAndValidationWithProps.bind(this);
        this._updateValidityWithProps = this._updateValidityWithProps.bind(this);
        this._doValidation=this._doValidation.bind(this);
    }

    componentDidMount (){
        this._initializeValueAndValidationWithProps(this.props)
    }

    componentWillReceiveProps(nextProps) {
        //Check if any of the following fields change and reinitialize
        if (nextProps.initialValue != this.props.initialValue ||
             nextProps.fieldName != this.props.fieldName ||
             nextProps.fieldType != this.props.fieldType ||
             nextProps.validationFunction != this.props.validationFunction){
            this._initializeValueAndValidationWithProps(nextProps);
        }
        if (nextProps.isValid != undefined && nextProps.isValid != this.props.isValid ) {
            this._updateValidityWithProps(nextProps);
        }
    }

    componentWillUnmount(){
        if (this.props.fieldResetOnUnmount) {
            context.executeAction(
                TextInputActions.eraseFieldData,
                {
                    fieldName: this.props.fieldName
                }
            );
        }
    }
    _initializeValueAndValidationWithProps(inProps) {
        if (inProps.initialValue != undefined) {
            context.executeAction(
                TextInputActions.updateFieldValue,
                {
                    fieldType: inProps.fieldType,
                    fieldName: inProps.fieldName,
                    values: {
                        fieldValue: inProps.initialValue,
                        hasChanges: false
                    }
                }
            );

            if (inProps.validationFunction) {
                context.executeAction(
                    TextInputActions.validateFieldValue,
                    {
                        fieldType: inProps.fieldType,
                        fieldName: inProps.fieldName,
                        validationFunction: inProps.validationFunction,
                        values: {
                            fieldValue: inProps.initialValue
                        }
                    }
                );
            }
            if (inProps.fieldType){
                if (inProps.fieldType == "emailInput"){
                    //initialize the email input
                }
                else if (inProps.fieldType == "passwordInput"){
                    //initialize the password input
                }
            }
        }
    }
    _updateValidityWithProps(inProps){
        if (inProps.isValid != undefined && inProps.isValid != this.props.isValid)
        {
            context.executeAction(
                TextInputActions.updateFieldValue,
                {
                    fieldType: inProps.fieldType,
                    fieldName: inProps.fieldName,
                    values: {
                        isValid: inProps.isValid
                    }
                }
            );
        }

    }
    _onChangeInput(e) {
        if (this.props.onChange) {
            this.props.onChange(e);
        }
        else
        {
            context.executeAction(
                TextInputActions.onChange,
                {
                    fieldType: this.props.fieldType,
                    fieldName: this.props.fieldName,
                    values: {
                        fieldValue: e.target.value,
                        hasChanges: this._hasChanges(e.target.value)
                    }
                }
            );
            if (this.props.validateOnChange){
                this._doValidation(e.target.value);
            }
            else if (this.props.validateLazyOnChange){
                if (validationTimer) {
                    clearTimeout(validationTimer);
                }
                var value = e.target.value;
                validationTimer = setTimeout(function() {this._doValidation(value)}.bind(this), lazyValidationTimeout);
            }
        }
    }

    _doValidation(value){
        if (this.props.validationFunction) {
            context.executeAction(
                TextInputActions.validateFieldValue,
                {
                    fieldType: this.props.fieldType,
                    fieldName: this.props.fieldName,
                    validationFunction: this.props.validationFunction,
                    values: {
                        fieldValue: value
                    }
                }
            );
        }
    }
    _hasChanges(currentValue){
        if (this.props.initialValue){
            return (this.props.initialValue != currentValue);
        }
        else{
            return (currentValue != "");
        }
    }

    _onBlurInput(e) {
        if (this.props.onBlur) {
            this.props.onBlur(e);
        }
        else {
            if (this.props.validateOnBlur){
                this._doValidation(e.target.value);
            }
        }
    }
    _onFocusInput(e) {
        if (this.props.onFocus) {
            this.props.onFocus(e);
        }
    }

    render() {
        debug("Rendering");
        var bsStyle =this.props.TextInputStore[this.props.fieldName] ? (this.props.TextInputStore[this.props.fieldName].isValid ? "success" : "error") : undefined;
        if (this.props.TextInputStore[this.props.fieldName] && this.props.TextInputStore[this.props.fieldName].fieldStyle){
            bsStyle = this.props.TextInputStore[this.props.fieldName].fieldStyle
        }
        var label = "";
        if (this.props.label){
            label = this.props.label;
        }
        var placeholder = "";
        if (this.props.placeholder){
            placeholder = this.props.placeholder;
        }

        var inputType = "text";
        if (this.props.fieldType == "passwordInput"){
            inputType = "password";
        }

        var textInput =
            <Input
                {...this.props}
                type={inputType}
                placeholder={placeholder}
                label={label}
                addonAfter={this.props.fieldAfter}
                bsStyle={bsStyle}
                value={this.props.TextInputStore[this.props.fieldName] ? this.props.TextInputStore[this.props.fieldName].fieldValue : ""}
                onChange={this._onChangeInput}
                onBlur={this._onBlurInput}
                onFocus={this._onFocusInput}
                />;
        return (
            <div>
                {textInput}
            </div>
        );
    }
}
TextInput = connectToStores(TextInput,
    [TextInputStore],
    function (context, props) {
        return {
            TextInputStore: context.getStore(TextInputStore).getState()
        };
    });

TextInput.propTypes = {
    fieldType: React.PropTypes.string.isRequired,
    fieldName: React.PropTypes.string.isRequired,
    fieldAfter: React.PropTypes.any,
    fieldResetOnUnmount: React.PropTypes.bool,
    initialValue: React.PropTypes.string,
    validateOnChange: React.PropTypes.bool,
    validateLazyOnChange: React.PropTypes.bool,
    validateOnBlur: React.PropTypes.bool,
    validationFunction: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    onFocus: React.PropTypes.func
};

export default TextInput;
