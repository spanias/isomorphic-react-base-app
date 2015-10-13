/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import {BaseStore} from 'fluxible/addons';
import Actions from "../actions/constant";
var jwt = require('jsonwebtoken');

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
            firstname: null,
            lastname: null,
            imageurl: null,
            verified: false
        };
    }
    loginAction(payload) {
        var key = 'private';
        try {
            var decoded = jwt.verify(payload, key);
            this.propStore = {
                loggedIn: true,
                attempts: 0,
                user: decoded.user,
                jwt: payload,
                group: decoded.group,
                email: decoded.email,
                firstname: decoded.firstname,
                lastname: decoded.lastname,
                imageurl: decoded.imageurl,
                verified: decoded.verified
            };
        } catch(err) {
            // err
            this.propStore = {
                loggedIn: false,
                attempts: 0,
                user: null,
                jwt: null,
                email: null,
                group: null,
                firstname: null,
                lastname: null,
                imageurl: null,
                verified: false
            };
        }
        this.emitChange();
    }
    loginFailedAction(payload) {
        this.propStore = {
            loggedIn: false,
            attempts: this.propStore.attempts +1,
            user: null,
            jwt: null,
            email: null,
            group: null,
            firstname: null,
            lastname: null,
            imageurl: null,
            verified: false
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
            firstname: null,
            lastname: null,
            imageurl: null,
            verified: false
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
    [Actions.LOGOUT_ACTION]: 'logoutAction'
};

export default AuthenticationStore;
