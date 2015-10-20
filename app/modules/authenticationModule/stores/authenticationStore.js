/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */
var debug = require('debug');
var debugauth = debug('AuthenticationStore');
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
            errorMessage: null
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
            errorMessage: null
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
            errorMessage: errormessage
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
            errorMessage: null
        };
        this.emitChange();
    }

    changePasswordAction(payload) {
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
            errorMessage: null
        };
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
    [Actions.CHANGEPASSWORD_ACTION]: 'changePasswordAction'

};

export default AuthenticationStore;
