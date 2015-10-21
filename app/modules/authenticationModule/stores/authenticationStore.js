/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */
var debugauth = require('debug')('AuthenticationStore');
import {BaseStore} from 'fluxible/addons';
import Actions from "../actions/constant";

class AuthenticationStore extends BaseStore {
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
            changeUserDetailsMessage: null
        };
    }
    loginAction(payload) {
        var decoded = payload;

        this.propStore = {
            loggedIn: true,
            attempts: 0,
            user: decoded.user,
            jwt: decoded.token,
            group: decoded.group,
            email: decoded.email,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            imageURL: decoded.imageURL,
            verified: decoded.verified,
            errorMessage: null,
            changePasswordFailed: false,
            changePasswordErrorMessage: null,
            changeUserDetailsFailed: false,
            changeUserDetailsMessage: null
        };
        this.emitChange();
    }

    loginFailedAction(payload) {
        var attemptincrement= 1;
        var errormessage = "";

        if (payload != undefined){
            if (payload.message === "XMLHttpRequest timeout")
            {
                debugauth("loginFailedAction -  Timeout detected!");
                attemptincrement = 0;
                errormessage = "Login request timed out!"
            }
            if (payload.message === "Token cannot be found!"){
                debugauth("loginFailedAction -  Token login failure!");
                attemptincrement = 0;
                errormessage = null;
            }
            if (payload.message === "Authentication Failed"){
                debugauth("loginFailedAction -  Authentication failed!");
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
            changeUserDetailsMessage: null
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
            changeUserDetailsMessage: null
        };
        this.emitChange();
    }

    resetMessagesAction(payload) {
        this.propStore.changeUserDetailsFailed = false;
        this.propStore.changeUserDetailsMessage = null;
        this.propStore.changePasswordFailed= false;
        this.propStore.changePasswordErrorMessage=  null;
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
        debugauth("changePasswordFailedAction -  payload: ", payload);
        if (payload != undefined){
            if (payload.message === "XMLHttpRequest timeout")
            {
                debugauth("changePasswordFailedAction -  Timeout detected!");
                message = "Change password request timed out!"
            }
            if (payload.message === "Current password cannot be verified!")
            {
                debugauth("Current password cannot be verified!");
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
                debugauth("changeUserDetailsFailed -  Timeout detected!");
                message = "Change user details request timed out!"
            }
        }
        this.propStore.changeUserDetailsFailed = true;
        this.propStore.changeUserDetailsMessage = message;
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

AuthenticationStore.storeName = 'authenticationStore';
AuthenticationStore.handlers = {
    [Actions.LOGINSUCCESS_ACTION]: 'loginAction',
    [Actions.LOGINFAILED_ACTION]: 'loginFailedAction',
    [Actions.LOGOUT_ACTION]: 'logoutAction',
    [Actions.CHANGE_PASSWORD_ACTION]: 'changePasswordAction',
    [Actions.CHANGE_PASSWORD_FAILED_ACTION]: 'changePasswordFailedAction',
    [Actions.RESET_MESSAGES_ACTION]: 'resetMessagesAction',
    [Actions.CHANGE_USER_DETAILS_ACTION]: 'changeUserDetailsAction',
    [Actions.CHANGE_USER_DETAILS_FAILED_ACTION]: 'changeUserDetailsFailedAction'

};

export default AuthenticationStore;
