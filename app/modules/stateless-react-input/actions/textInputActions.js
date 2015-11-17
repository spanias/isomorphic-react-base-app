/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */
import Actions from "./constant";
import TextInputStore from '../stores/textInputStore';
var debug = require('debug')('TextInputActions');

var TextInputActions = module.exports = {

    validateEmail: function (value) {
        // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(value)) {
            return true;
        }
        else {
            return false;
        }
    },

    validateFirstName: function (value) {
        // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^$|\s/;
        if (re.test(value)) {
            return false;
        }
        else {
            return true;
        }
    },

    validateLastName: function (value) {
        // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^$|\s/;
        if (re.test(value)) {
            return false;
        }
        else {
            return true;
        }
    },

    validateUsername: function (value) {
        // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^$|\s|;/;
        if (re.test(value)) {
            return false;
        }
        else {
            return true;
        }
    },
    validatePassword: function (value) {
        // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^$|\s/;
        if (re.test(value)) {
            return false;
        }
        else {
            return true;
        }
    },

    validateFieldValue: function (context, payload, done){
        context.dispatch(
            Actions.UPDATE_TEXTINPUT_STORE,
            {
                fieldType: payload.fieldType,
                fieldName: payload.fieldName,
                values: {
                    isValid: payload.validationFunction(payload.values.fieldValue)
                }
            }
        );
        done();
    },

    updateFieldValue: function (context,payload,done) {
        context.dispatch(Actions.UPDATE_TEXTINPUT_STORE, payload);
        done();
    },

    eraseFieldData: function (context, payload, done){
        context.dispatch(Actions.RESET_TEXTINPUT_STORE, payload);
        done();
    },
    onChange: function (context, payload, done) {
        context.dispatch(Actions.UPDATE_TEXTINPUT_STORE, payload);
        done();
    }
}
export default TextInputActions;