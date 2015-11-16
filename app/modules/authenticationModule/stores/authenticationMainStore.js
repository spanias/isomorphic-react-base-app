/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */
var debug = require('debug')('AuthenticationMainStore');
import {BaseStore} from 'fluxible/addons';
import Actions from "../actions/constant";
import {DateAdd} from '../utils';
import MessagingActions  from '../../timedAlertBox/actions/messagingActions';

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
        this.emitChange();
    }

    loginFailedAction(payload) {
        var attemptIncrement= 1;
        if (payload != undefined){
            if (payload.message === "XMLHttpRequest timeout")
            {
                attemptIncrement = 0;
            }
            if (payload.message === "Token cannot be found!"){
                attemptIncrement = 0;
            }
            if (payload.message === "Authentication Failed"){
                attemptIncrement = 0;
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
        this.emitChange();
    }

    verifiedEmail(payload) {
        this.propStore.verified = payload.verified;
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
    [Actions.CHANGE_USER_DETAILS_ACTION]: 'changeUserDetailsAction',
    [Actions.VERIFIED_EMAIL]: 'verifiedEmail',
    [Actions.REFRESH_USER_ACTION]: 'refreshUser',

};

export default AuthenticationMainStore;
