/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */
import keyMirror from "react/lib/keyMirror";
import Actions from "./constant";
import AuthenticationMainStore from '../stores/authenticationMainStore';
var debug = require('debug')('AuthenticationAction');
var serviceTimeOut = 20000;

/*
 This function is used to save and load the login state store.
 could get the whole store here like this if you wanted to save it to the server:
 var store = context.getStore(exampleStore).getState()
 */
var AuthenticationActions = module.exports = {
    login: function (context, payload, done){
        if (payload.username != "" && payload.password != "") {
            context.executeAction(
                AuthenticationActions.updateLoginMessage,
                {
                    message: "Attempting login...",
                    appearFor: 10,
                    style: "info"
                }
            );
            var parameters = {
                login: true,
                username: payload.username,
                password: payload.password,
                rememberMe: payload.rememberMe
            };
            debug("Reading AuthenticationService ->", parameters);
            context.service.read('AuthenticationService', parameters, {timeout: serviceTimeOut}, function (err, data) {
                if (err || !data) {
                    debug("Calling LOGINFAILED_ACTION, Err: ", err, " data:", data);
                    context.dispatch(Actions.LOGINFAILED_ACTION, err);
                }
                else {
                    context.dispatch(Actions.LOGINSUCCESS_ACTION, data);
                }
            });
        }
        else
        {
            context.executeAction(
                AuthenticationActions.updateLoginMessage, {
                    message: "Username and Password cannot be empty!",
                    appearFor: 10,
                    style: "danger"
                }
            );
        }
        done();
    },

    refreshUser: function (context,payload, done){
        if (payload.jwt) {
            var parameters = {
                refreshUser: true,
                jwt: payload.jwt
            };
            debug("Reading AuthenticationService ->", parameters);
            context.service.read(
                'AuthenticationService',
                parameters,
                {timeout: serviceTimeOut},
                function (err, data) {
                    debug("Calling REFRESH_USER_ACTION, Err: ", err, " data:", data);
                    if (err || !data) {

                    }
                    else {
                        context.dispatch(Actions.REFRESH_USER_ACTION, data);
                    }
                    done();
                }
            );
        }
        done();
    },


    updateLoginMessage: function (context,payload, done){
        var parameters = {
            message: payload.message,
            appearFor: payload.appearFor,
            style: payload.style
        };
        context.dispatch(Actions.UPDATE_LOGIN_MESSAGE_ACTION, parameters);
        done();
    },
    updateSecurityMessage: function (context,payload, done){
        var parameters = {
            message: payload.message,
            appearFor: payload.appearFor,
            style: payload.style
        };
        context.dispatch(Actions.UPDATE_SECURITY_MESSAGE_ACTION, parameters);
        done();
    },
    updateUserDetailsMessage: function (context,payload, done){
        var parameters = {
            message: payload.message,
            appearFor: payload.appearFor,
            style: payload.style
        };
        context.dispatch(Actions.UPDATE_USER_DETAILS_MESSAGE_ACTION, parameters);
        done();
    },
    updateVerifyEmailMessage: function (context,payload, done){
        var parameters = {
            message: payload.message,
            appearFor: payload.appearFor,
            style: payload.style
        };
        context.dispatch(Actions.UPDATE_VERIFY_EMAIL_MESSAGE_ACTION, parameters);
        done();
    },

    resetMessages: function (context,payload, done){
        context.dispatch(Actions.RESET_MESSAGES_ACTION, null);
        done();
    },

    loginWithToken: function (context, payload, done){
        var parameters = {accessToken: true };
        debug("Reading AuthenticationService ->", parameters);
        context.service.read('AuthenticationService', parameters, {timeout: serviceTimeOut}, function (err, data) {
            if (err || !data) {
                debug("Calling LOGINFAILED_ACTION, Err: ", err, " data:", data);
                context.dispatch(Actions.LOGINFAILED_ACTION, err);
            }
            else {
                context.dispatch(Actions.LOGINSUCCESS_ACTION, data);
            }
        });
        done();
    },
    changePassword: function (context, payload, done){
        var parameters = {
            changePassword: true ,
            jwt: payload.jwt,
            username: payload.username,
            password: payload.password,
            newPassword: payload.newPassword
        };

        debug("Updating AuthenticationService ->", parameters);
        context.service.update('AuthenticationService', parameters, {}, {timeout: serviceTimeOut}, function (err, data) {
            if (err || !data) {
                debug("Calling CHANGE_PASSWORD action, Err: ", err, " data:", data);
                context.dispatch(Actions.CHANGE_PASSWORD_FAILED_ACTION, err);
            }
            else {
                context.dispatch(Actions.CHANGE_PASSWORD_ACTION, data);
            }
        });
        done();
    },

    changeUserDetails: function (context, payload, done){
        var parameters = {
            updateUserDetails: true,
            jwt: payload.jwt,
            myUser: payload.myUser
        };
        debug("Updating AuthenticationService ->", parameters);
        context.service.update('AuthenticationService', parameters, {}, {timeout: serviceTimeOut}, function (err, data) {
            if (err || !data) {
                debug("Calling CHANGE_PASSWORD action, Err: ", err, " data:", data);
                context.dispatch(Actions.CHANGE_USER_DETAILS_FAILED_ACTION, err);
            }
            else {
                context.dispatch(Actions.CHANGE_USER_DETAILS_ACTION, data);
            }
        });
        done();
    },
    requestVerificationEmail: function (context,payload, done){
        context.executeAction(
            AuthenticationActions.updateUserDetailsMessage,
            {
                message: "Verification email requested.",
                appearFor: 10,
                style: "info"
            }
        );
        var parameters = {
            requestEmailVerificationToken: true ,
            jwt: payload.jwt};
        debug("Reading AuthenticationService ->", parameters);
        context.service.read('AuthenticationService', parameters, {timeout: serviceTimeOut}, function (err, data) {
            //TODO: Take actions in the store for these actions
            if (err || !data) {
                debug("Calling REQUEST_EMAIL_VERIFICATION_FAILED action, Err: ", err, " data:", data);
                context.dispatch(Actions.REQUEST_EMAIL_VERIFICATION_FAILED, err);
            }
            else {
                context.dispatch(Actions.REQUEST_EMAIL_VERIFICATION, data);
            }
        });
        done();
    },
    verifyEmail: function (context,payload, done){
        var parameters = {
            verifyEmail: true ,
            jwt: payload.jwt,
            emailToken: payload.token};
        debug("Updating AuthenticationService ->", parameters);
        context.service.update('AuthenticationService', parameters, {}, {timeout: serviceTimeOut}, function (err, data) {
            //TODO: Take actions in the store for these actions
            if (err || !data) {
                debug("Calling VERIFY_EMAIL_FAILED action, Err: ", err, " data:", data);
                context.dispatch(Actions.VERIFY_EMAIL_FAILED, err);
            }
            else {
                context.dispatch(Actions.VERIFIED_EMAIL, data);
            }
        });
        done();
    },
    logout: function (context,payload, done){
        var store = context.getStore(AuthenticationMainStore).getState();
        if (store.loggedIn){
            var parameters = {logout: true };
            context.service.read('AuthenticationService', parameters, {timeout: serviceTimeOut}, function (err, data) {
                if (err) {
                    debug("Logout failed! ", err);
                }
                else {
                    debug("Logout succeded!");
                }
            });
            context.dispatch(Actions.LOGOUT_ACTION, null);
        }
        done();
    }
};
