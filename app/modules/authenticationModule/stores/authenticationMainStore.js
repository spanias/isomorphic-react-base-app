/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */
var debug = require('debug')('AuthenticationMainStore');
import {BaseStore} from 'fluxible/addons';
import Actions from "../actions/constant";
import {DateAdd} from '../utils';

class AuthenticationMainStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.propStore = {
            loggedIn: false,
            attempts: 0,
            user: null,
            jwt: null,
            email: null,
            group: null,
            firstName: null,
            lastName: null,
            imageURL: null,
            verified: false,

            loginMessageStyle: null,
            loginMessage: null,
            loginMessageValidUntil: null,

            changePasswordMessageStyle: null,
            changePasswordMessage: null,
            changePasswordMessageValidUntil: null,

            changeUserDetailsMessageStyle: null,
            changeUserDetailsMessage: null,
            changeUserDetailsMessageValidUntil: null,

            requestVerificationEmailMessageStyle: null,
            requestVerificationEmailMessage: null,
            requestVerificationEmailValidUntil: null,

            verifyEmailMessageStyle: null,
            verifyEmailMessage: null,
            verifyEmailMessageValidUntil: null
        };
    }
    loginAction(payload) {
        this.propStore.loggedIn =  true;
        this.propStore.attempts = 0;
        this.propStore.user= payload.user;
        this.propStore.jwt = payload.token;
        this.propStore.group =  payload.group;
        this.propStore.email = payload.email;
        this.propStore.firstName = payload.firstName;
        this.propStore.lastName = payload.lastName;
        this.propStore.imageURL =  payload.imageURL;
        this.propStore.verified = payload.verified;

        this.propStore.loginMessageStyle = null;
        this.propStore.loginMessage = null;
        this.propStore.loginMessageValidUntil = null;

        this.emitChange();
    }

    loginFailedAction(payload) {
        var appearsUntil = DateAdd(new Date(), 'second', 10);
        var attemptIncrement= 1;
        var errorMessage = "";

        if (payload != undefined){
            if (payload.message === "XMLHttpRequest timeout")
            {
                debug("loginFailedAction -  Timeout detected!");
                attemptIncrement = 0;
                errorMessage = "Login request timed out!"
            }
            if (payload.message === "Token cannot be found!"){
                debug("loginFailedAction -  Token login failure!");
                attemptIncrement = 0;
                errorMessage = null;
            }
            if (payload.message === "Authentication Failed"){
                debug("loginFailedAction -  Authentication failed!");
                attemptIncrement = 0;
                errorMessage = "Invalid username and password combination!";
            }
        }

        this.propStore.loggedIn = false;
        this.propStore.attempts = this.propStore.attempts + attemptIncrement;
        this.propStore.user =  null;
        this.propStore.jwt =  null;
        this.propStore.email = null;
        this.propStore.group = null;
        this.propStore.firstName = null;
        this.propStore.lastName = null;
        this.propStore.imageURL = null;
        this.propStore.verified = false;

        this.propStore.loginMessageStyle = "danger";
        this.propStore.loginMessage = errorMessage;
        this.propStore.loginMessageValidUntil = appearsUntil;


        this.emitChange();
    }
    logoutAction(payload) {
        this.propStore.loggedIn = false;
        this.propStore.attempts = 0;
        this.propStore.user =  null;
        this.propStore.jwt =  null;
        this.propStore.email = null;
        this.propStore.group = null;
        this.propStore.firstName = null;
        this.propStore.lastName = null;
        this.propStore.imageURL = null;
        this.propStore.verified = false;

        this.propStore.loginMessageStyle = null;
        this.propStore.loginMessage = null;
        this.propStore.loginMessageValidUntil = null;

        this.emitChange();
    }

    resetMessagesAction(payload) {

        //Messages displayed after user detail change request
        this.propStore.changeUserDetailsMessageStyle = null;
        this.propStore.changeUserDetailsMessage = null;
        this.propStore.changeUserDetailsMessageValidUntil = null;

        //Messages displayed after password change request
        this.propStore.changePasswordMessageStyle = null;
        this.propStore.changePasswordMessage=  null;
        this.propStore.changePasswordMessageValidUntil=  null;

        //Messages displayed after request of verification email
        this.propStore.requestVerificationEmailMessageStyle = false;
        this.propStore.requestVerificationEmailMessage= null;
        this.propStore.requestVerificationEmailMessageValidUntil= null;

        //Messages displayed email verification request
        this.propStore.verifyEmailMessageStyle= null;
        this.propStore.verifyEmailMessage = null;
        this.propStore.verifyEmailMessageValidUntil = null;

        //Messages displayed after login attempt
        this.propStore.loginMessageStyle = null;
        this.propStore.loginMessage = null;
        this.propStore.loginMessageValidUntil = null;

        this.emitChange();
    }

    changePasswordAction(payload) {
        var appearsUntil = DateAdd(new Date(), 'second', 10);
        this.propStore.changePasswordMessageStyle= "success";
        this.propStore.changePasswordMessage =  "Password changed successfully!";
        this.propStore.changePasswordMessageValidUntil = appearsUntil;

        this.emitChange();
    }
    changePasswordFailedAction(payload) {
        var appearsUntil = DateAdd(new Date(), 'second', 10);
        var message = null;
        debug("changePasswordFailedAction -  payload: ", payload);
        if (payload != undefined){
            if (payload.message === "XMLHttpRequest timeout")
            {
                debug("changePasswordFailedAction -  Timeout detected!");
                message = "Change password request timed out!"
            }
            if (payload.message === "Current password cannot be verified!")
            {
                debug("Current password cannot be verified!");
                message = "Current password cannot be verified! Password not changed!"
            }
        }

        this.propStore.changePasswordMessageStyle= "danger";
        this.propStore.changePasswordMessage =  message;
        this.propStore.changePasswordMessageValidUntil = appearsUntil;

        this.emitChange();
    }

    changeUserDetailsAction(payload) {
        var appearsUntil = DateAdd(new Date(), 'second', 10);
        if (payload)
        {
            this.propStore.verified = payload.verified;
            this.propStore.imageURL = payload.imageURL;
            this.propStore.email = payload.email;
            this.propStore.firstName = payload.firstName;
            this.propStore.lastName = payload.lastName;
        }
        this.propStore.changeUserDetailsMessageStyle = "success";
        this.propStore.changeUserDetailsMessage =  "Details changed successfully!";
        this.propStore.changeUserDetailsMessageValidUntil = appearsUntil;
        this.emitChange();
    }

    changeUserDetailsFailedAction(payload) {
        var appearsUntil = DateAdd(new Date(), 'second', 10);
        var message = null;
        if (payload != undefined){
            if (payload.message === "XMLHttpRequest timeout")
            {
                debug("changeUserDetailsFailed -  Timeout detected!");
                message = "Change user details request timed out!"
            }
        }
        this.propStore.changeUserDetailsMessageStyle = "danger";
        this.propStore.changeUserDetailsMessage = message;
        this.propStore.changeUserDetailsMessageValidUntil = appearsUntil;
        this.emitChange();
    }

    verifiedEmail(payload){
        var appearsUntil = DateAdd(new Date(), 'second', 10);
        this.propStore.verifyEmailMessageStyle ="success";
        this.propStore.verifyEmailMessage = "Email Verification was successful!";
        this.propStore.verifyEmailMessageValidUntil = appearsUntil;

        this.propStore.verified = payload.verified;

        this.emitChange();
    }

    verifyEmailFailed(payload){

        var appearsUntil = DateAdd(new Date(), 'second', 10);

        if (payload.message === "XMLHttpRequest timeout")
        {
            debug("changePasswordFailedAction -  Timeout detected!");
            this.propStore.verifyEmailMessage = "Email Verification was unsuccessful! Request timed out!";
        }
        else
        {
            this.propStore.verifyEmailMessage = "Email Verification was unsuccessful! " + payload.message;
        }
        this.propStore.verifyEmailMessageStyle ="danger";
        this.propStore.verifyEmailMessageValidUntil = appearsUntil;

        this.emitChange();
    }

    requestEmailVerification(payload){
        var appearsUntil = DateAdd(new Date(), 'second', 10);
        this.propStore.verifyEmailMessageStyle ="info";
        this.propStore.verifyEmailMessage = "A verification email has been sent to your email address!";
        this.propStore.verifyEmailMessageValidUntil = appearsUntil;

        this.emitChange();
    }
    requestEmailVerificationFailed(payload){
        var appearsUntil = DateAdd(new Date(), 'second', 10);


        if (payload.message === "XMLHttpRequest timeout") {
            debug("changePasswordFailedAction -  Timeout detected!");
            this.propStore.verifyEmailMessage = "Request for verification email was unsuccessful! Request timed out!";
        }
        else {
            this.propStore.verifyEmailMessage = "Verification email request failed. " + payload.message;
        }
        this.propStore.verifyEmailMessageStyle = "danger";
        this.propStore.verifyEmailMessageValidUntil = appearsUntil;

        this.emitChange();
    }

    refreshUser(payload){
        this.propStore.group = payload.group;
        this.propStore.email =  payload.email;
        this.propStore.firstName = payload.firstName;
        this.propStore.lastName = payload.lastName;
        this.propStore.imageURL = payload.imageURL;
        this.propStore.verified = payload.verified;

        this.emitChange();
    }

    updateLoginMessage(payload){
        debug("Updating Login Message: ", payload);
        var appearsUntil = DateAdd(new Date(), 'second', payload.appearFor);
        this.propStore.loginMessageStyle = payload.style;
        this.propStore.loginMessage = payload.message;
        this.propStore.loginMessageValidUntil = appearsUntil;
        this.emitChange();
    }
    updateSecurityMessage(payload){
        debug("Updating Security Message: ", payload);
        var appearsUntil = DateAdd(new Date(), 'second', payload.appearFor);
        this.propStore.changePasswordMessageStyle = payload.failure;
        this.propStore.changePasswordMessage = payload.message;
        this.propStore.changePasswordMessageValidUntil = appearsUntil;
        this.emitChange();
    }
    updateUserDetailsMessage(payload){
        debug("Updating User Details Message: ", payload);
        var appearsUntil = DateAdd(new Date(), 'second', payload.appearFor);
        this.propStore.changeUserDetailsMessageStyle = payload.style;
        this.propStore.changeUserDetailsMessage =  payload.message;
        this.propStore.changeUserDetailsMessageValidUntil = appearsUntil;
        this.emitChange();
    }
    updateVerifyEmailMessage(payload){
        debug("Updating Verify Email Message: ", payload);
        var appearsUntil = DateAdd(new Date(), 'second', payload.appearFor);
        this.propStore.verifyEmailMessageStyle =payload.style;
        this.propStore.verifyEmailMessage = payload.message;
        this.propStore.verifyEmailMessageValidUntil = appearsUntil;
        this.emitChange();
    }


    getState() {
        return this.propStore;
    }
    dehydrate() {
        return {propStore: this.propStore};
    }
    rehydrate(state) {
        this.propStore = state.propStore;
    }
}

AuthenticationMainStore.storeName = 'authenticationMainStore';
AuthenticationMainStore.handlers = {
    [Actions.LOGINSUCCESS_ACTION]: 'loginAction',
    [Actions.LOGINFAILED_ACTION]: 'loginFailedAction',

    [Actions.LOGOUT_ACTION]: 'logoutAction',

    [Actions.CHANGE_PASSWORD_ACTION]: 'changePasswordAction',
    [Actions.CHANGE_PASSWORD_FAILED_ACTION]: 'changePasswordFailedAction',

    [Actions.CHANGE_USER_DETAILS_ACTION]: 'changeUserDetailsAction',
    [Actions.CHANGE_USER_DETAILS_FAILED_ACTION]: 'changeUserDetailsFailedAction',

    [Actions.VERIFIED_EMAIL]: 'verifiedEmail',
    [Actions.VERIFY_EMAIL_FAILED]: 'verifyEmailFailed',

    [Actions.REQUEST_EMAIL_VERIFICATION_FAILED]: 'requestEmailVerificationFailed',
    [Actions.REQUEST_EMAIL_VERIFICATION]: 'requestEmailVerification',

    [Actions.REFRESH_USER_ACTION]: 'refreshUser',

    [Actions.RESET_MESSAGES_ACTION]: 'resetMessagesAction',
    [Actions.UPDATE_LOGIN_MESSAGE_ACTION]: 'updateLoginMessage',
    [Actions.UPDATE_SECURITY_MESSAGE_ACTION]: 'updateSecurityMessage',
    [Actions.UPDATE_USER_DETAILS_MESSAGE_ACTION]: 'updateUserDetailsMessage',
    [Actions.UPDATE_VERIFY_EMAIL_MESSAGE_ACTION]: 'updateVerifyEmailMessage'
};

export default AuthenticationMainStore;
