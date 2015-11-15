/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {Button, Input} from 'react-bootstrap';
import {Label} from 'react-bootstrap';

import TextInputActions  from '../../actions/textInputActions';
import AuthenticationTextInputStore from '../../stores/authenticationTextInputStore';
import AuthenticationMainStore from '../../stores/authenticationMainStore';

var debug = require('debug')('AuthenticationTextInput');

class AuthenticationTextInput extends React.Component {


    constructor(props, context) {
        super(props, context);

        this._hasChanges = this._hasChanges.bind(this);
        this._onChangeInput = this._onChangeInput.bind(this);
        this._onBlurInput = this._onBlurInput.bind(this);
        this._onFocusInput = this._onFocusInput.bind(this);
        this._initializeWithProps = this._initializeWithProps.bind(this);
    }

    componentWillMount (){
        this._initializeWithProps(this.props)
    }

    componentWillReceiveProps(nextProps) {
        //Check if any of the following fields change and reinitialize
        if (nextProps.initialValue != this.props.initialValue ||
             nextProps.fieldName != this.props.fieldName ||
             nextProps.fieldType != this.props.fieldType ||
             nextProps.validationFunction != this.props.validationFunction ||
             nextProps.isValid != undefined) {

            this._initializeWithProps(nextProps)

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

    _initializeWithProps(inProps){
        if (inProps.initialValue) {
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
        }
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
        if (inProps.fieldType){
            if (inProps.fieldType == "emailInput"){
                //initialize the email input
            }
            else if (inProps.fieldType == "passwordInput"){
                //initialize the password input
            }
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
                if (this.props.validationFunction) {
                    context.executeAction(
                        TextInputActions.validateFieldValue,
                        {
                            fieldType: this.props.fieldType,
                            fieldName: this.props.fieldName,
                            validationFunction: this.props.validationFunction,
                            values: {
                                fieldValue: e.target.value
                            }
                        }
                    );
                }
            }
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
                if (this.props.validationFunction) {
                    context.executeAction(
                        TextInputActions.validateFieldValue,
                        {
                            fieldType: this.props.fieldType,
                            fieldName: this.props.fieldName,
                            validationFunction: this.props.validationFunction,
                            values: {
                                fieldValue: e.target.value
                            }
                        }
                    );
                }
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
        var bsStyle =this.props.TextInputStore[this.props.fieldName] ? (this.props.TextInputStore[this.props.fieldName].isValid ? "success" : "error") : "info";
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
AuthenticationTextInput = connectToStores(AuthenticationTextInput,
    [AuthenticationTextInputStore],
    function (context, props) {
        return {
            TextInputStore: context.getStore(AuthenticationTextInputStore).getState()
        };
    });

AuthenticationTextInput.propTypes = {
    fieldType: React.PropTypes.string.isRequired,
    fieldName: React.PropTypes.string.isRequired,
    fieldAfter: React.PropTypes.any,
    fieldResetOnUnmount: React.PropTypes.bool,
    initialValue: React.PropTypes.string,
    validateOnChange: React.PropTypes.bool,
    validateOnBlur: React.PropTypes.bool,
    validationFunction: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    onFocus: React.PropTypes.func
};

export default AuthenticationTextInput;
