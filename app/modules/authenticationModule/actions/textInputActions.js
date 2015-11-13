/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */
import keyMirror from "react/lib/keyMirror";
import Actions from "./constant";
import AuthenticationTextInputStore from '../stores/authenticationTextInputStore';
var debug = require('debug')('TextInputActions');

/*
 This function is used to save and load the login state store.
 could get the whole store here like this if you wanted to save it to the server:
 var store = context.getStore(exampleStore).getState()
 */
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

    validateFieldValue: function (context, payload, done){
        context.dispatch(
            Actions.AUTHENTICATION_UPDATE_TEXTINPUT_STORE,
            {
                fieldType: payload.fieldType,
                fieldName: payload.fieldName,
                values: {
                    isValid: payload.validationFunction(payload.values.fieldValue)
                }
            }
        );
    },

    updateFieldValue: function (context,payload,done) {
        context.dispatch(Actions.AUTHENTICATION_UPDATE_TEXTINPUT_STORE, payload);
        done();
    },
    onChange: function (context, payload, done) {
        context.dispatch(Actions.AUTHENTICATION_UPDATE_TEXTINPUT_STORE, payload);
        done();
    }
}