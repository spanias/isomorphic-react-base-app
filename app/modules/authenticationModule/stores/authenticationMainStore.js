/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */
var debug = require('debug')('AuthenticationMainStore');
import {BaseStore} from 'fluxible/addons';
import Actions from "../actions/constant";

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
            errorMessage: null,
            changePasswordFailed: false,
            changePasswordErrorMessage: null,
            changeUserDetailsFailed: false,
            changeUserDetailsMessage: null,
            requestVerificationEmailFailed: false,
            requestVerificationEmailMessage: null,
            verifyEmailFailed: false,
            verifyEmailMessage: null
        };
    }
    loginAction(payload) {
        this.propStore = {
            loggedIn: true,
            attempts: 0,
            user: payload.user,
            jwt: payload.token,
            group: payload.group,
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            imageURL: payload.imageURL,
            verified: payload.verified,
            errorMessage: null,
            changePasswordFailed: false,
            changePasswordErrorMessage: null,
            changeUserDetailsFailed: false,
            changeUserDetailsMessage: null,
            requestVerificationEmailFailed: false,
            requestVerificationEmailMessage: null,
            verifyEmailFailed: false,
            verifyEmailMessage: null
        };
        this.emitChange();
    }

    loginFailedAction(payload) {
        var attemptincrement= 1;
        var errormessage = "";

        if (payload != undefined){
            if (payload.message === "XMLHttpRequest timeout")
            {
                debug("loginFailedAction -  Timeout detected!");
                attemptincrement = 0;
                errormessage = "Login request timed out!"
            }
            if (payload.message === "Token cannot be found!"){
                debug("loginFailedAction -  Token login failure!");
                attemptincrement = 0;
                errormessage = null;
            }
            if (payload.message === "Authentication Failed"){
                debug("loginFailedAction -  Authentication failed!");
                attemptincrement = 0;
                errormessage = "Invalid username and password combination!";
            }
        }

        this.propStore = {
            loggedIn: false,
            attempts: this.propStore.attempts +attemptincrement,
            user: null,
            jwt: null,
            email: null,
            group: null,
            firstName: null,
            lastName: null,
            imageURL: null,
            verified: false,
            errorMessage: errormessage,
            changePasswordFailed: false,
            changePasswordErrorMessage: null,
            changeUserDetailsFailed: false,
            changeUserDetailsMessage: null,
            requestVerificationEmailFailed: false,
            requestVerificationEmailMessage: null,
            verifyEmailFailed: false,
            verifyEmailMessage: null
        };

        this.emitChange();
    }
    logoutAction(payload) {
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
            errorMessage: null,
            changePasswordFailed: false,
            changePasswordErrorMessage: null,
            changeUserDetailsFailed: false,
            changeUserDetailsMessage: null,
            requestVerificationEmailFailed: false,
            requestVerificationEmailMessage: null,
            verifyEmailFailed: false,
            verifyEmailMessage: null
        };
        this.emitChange();
    }

    resetMessagesAction(payload) {

        //Messages displayed after user detail change request
        this.propStore.changeUserDetailsFailed = false;
        this.propStore.changeUserDetailsMessage = null;

        //Messages displayed after password change request
        this.propStore.changePasswordFailed= false;
        this.propStore.changePasswordErrorMessage=  null;

        //Messages displayed after request of verification email
        this.propStore.requestVerificationEmailFailed = false;
        this.propStore.requestVerificationEmailMessage= null;

        //Messages displayed email verification request
        this.propStore.verifyEmailFailed= false;
        this.propStore.verifyEmailMessage = null;

        //Messages displayed after login attempt
        this.propStore.errorMessage = null;

        this.emitChange();
    }

    changePasswordAction(payload) {
        this.propStore.changePasswordFailed= false;
        this.propStore.changePasswordErrorMessage=  "Password changed successfully!";
        this.emitChange();
    }
    changePasswordFailedAction(payload) {
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
        this.propStore.changePasswordFailed= true;
        this.propStore.changePasswordErrorMessage =  message;

        this.emitChange();
    }

    changeUserDetailsAction(payload) {
        if (payload)
        {
            this.propStore.verified = payload.verified;
            this.propStore.imageURL = payload.imageURL;
            this.propStore.email = payload.email;
            this.propStore.firstName = payload.firstName;
            this.propStore.lastName = payload.lastName;
        }
        this.propStore.changeUserDetailsFailed = false;
        this.propStore.changeUserDetailsMessage =  "Details changed successfully!";
        this.emitChange();
    }

    changeUserDetailsFailedAction(payload) {
        var message = null;
        if (payload != undefined){
            if (payload.message === "XMLHttpRequest timeout")
            {
                debug("changeUserDetailsFailed -  Timeout detected!");
                message = "Change user details request timed out!"
            }
        }
        this.propStore.changeUserDetailsFailed = true;
        this.propStore.changeUserDetailsMessage = message;
        this.emitChange();
    }

    verifiedEmail(payload){
        this.propStore.verifyEmailFailed =false;
        this.propStore.verifyEmailMessage = "Email Verification was successful!";
        this.propStore.verified = payload.verified;

        this.emitChange();
    }

    verifyEmailFailed(payload){
        this.propStore.verifyEmailFailed =true;

        if (payload.message === "XMLHttpRequest timeout")
        {
            debug("changePasswordFailedAction -  Timeout detected!");
            this.propStore.verifyEmailMessage = "Email Verification was unsuccessful! Request timed out!";
        }
        else
        {
            this.propStore.verifyEmailMessage = "Email Verification was unsuccessful! " + payload.message;
        }

        this.emitChange();
    }

    requestEmailVerification(payload){
        this.propStore.verifyEmailFailed =false;
        this.propStore.verifyEmailMessage = "A verification email has been sent to your email address!";

        this.emitChange();
    }
    requestEmailVerificationFailed(payload){
        this.propStore.verifyEmailFailed =true;

        if (payload.message === "XMLHttpRequest timeout") {
            debug("changePasswordFailedAction -  Timeout detected!");
            this.propStore.verifyEmailMessage = "Request for verification email was unsuccessful! Request timed out!";
        }
        else {
            this.propStore.verifyEmailMessage = "Verification email request failed. " + payload.message;
        }

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
    [Actions.RESET_MESSAGES_ACTION]: 'resetMessagesAction',
    [Actions.CHANGE_USER_DETAILS_ACTION]: 'changeUserDetailsAction',
    [Actions.CHANGE_USER_DETAILS_FAILED_ACTION]: 'changeUserDetailsFailedAction',
    [Actions.VERIFIED_EMAIL]: 'verifiedEmail',
    [Actions.VERIFY_EMAIL_FAILED]: 'verifyEmailFailed',
    [Actions.REQUEST_EMAIL_VERIFICATION_FAILED]: 'requestEmailVerificationFailed',
    [Actions.REQUEST_EMAIL_VERIFICATION]: 'requestEmailVerification',
    [Actions.REFRESH_USER_ACTION]: 'refreshUser'
};

export default AuthenticationMainStore;
