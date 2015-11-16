/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */
import keyMirror from "react/lib/keyMirror";
import Actions from "./constant";
import AuthenticationMainStore from '../stores/authenticationMainStore';
import {MessagingActions}  from './../../timedAlertBox/index';

var debug = require('debug')('AuthenticationAction');
var serviceTimeOut = 20000;

var AuthenticationActions = module.exports = {

    login: function (context, payload, done){
        if (payload.username != "" && payload.password != "") {
            if (payload.messagingName) {
                context.executeAction(
                    MessagingActions.updateMessage,
                    {
                        messageName: payload.messagingName,
                        values: {
                            message: "Attempting login...",
                            appearFor: 10,
                            messageStyle: "info"
                        }
                    }
                );
            }
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
                    if (payload.messagingName) {
                        var errorMessage = "";
                        if (err != undefined){
                            if (err.message === "XMLHttpRequest timeout")
                            {
                                debug("loginFailedAction -  Timeout detected!");
                                errorMessage = "Login request timed out!"
                            }
                            if (err.message === "Token cannot be found!"){
                                debug("loginFailedAction -  Token login failure!");
                                errorMessage = null;
                            }
                            if (err.message === "Authentication Failed"){
                                debug("loginFailedAction -  Authentication failed!");
                                errorMessage = "Invalid username and password combination!";
                            }
                        }
                        context.executeAction(
                            MessagingActions.updateMessage,
                            {
                                messageName: payload.messagingName,
                                values: {
                                    message: errorMessage,
                                    appearFor: 10,
                                    messageStyle: "danger"
                                }
                            }
                        );
                    }
                }
                else {
                    context.dispatch(Actions.LOGINSUCCESS_ACTION, data);
                    context.executeAction(
                        MessagingActions.eraseMessage,
                        {
                            messageName: payload.messagingName
                        }
                    )
                }
            });
        }
        else
        {
            if (payload.messagingName) {
                context.executeAction(
                    MessagingActions.updateMessage,
                    {
                        messageName: payload.messagingName,
                        values: {
                            message: "Username and Password cannot be empty!",
                            appearFor: 10,
                            messageStyle: "danger"
                        }
                    }
                );
            }
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

        context.service.update('AuthenticationService', parameters, {}, {timeout: serviceTimeOut}, function (err, data) {
            if (err || !data) {
                if (payload.messagingName) {
                    var message = null;
                    if (err != undefined){
                        if (err.message === "XMLHttpRequest timeout") {
                            message = "Change password request timed out!"
                        }
                        if (err.message === "Current password cannot be verified!") {
                            message = "Current password cannot be verified! Password not changed!"
                        }
                    }

                    context.executeAction(
                        MessagingActions.updateMessage,
                        {
                            messageName: payload.messagingName,
                            values: {
                                message: message,
                                appearFor: 10,
                                messageStyle: "danger"
                            }
                        }
                    );
                }
            }
            else {
                if (payload.messagingName) {
                    context.executeAction(
                        MessagingActions.updateMessage,
                        {
                            messageName: payload.messagingName,
                            values: {
                                message: "Password changed successfully!",
                                appearFor: 10,
                                messageStyle: "success"
                            }
                        }
                    );
                }
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
                if (payload.messagingName) {
                    var message = null;
                    if (err != undefined){
                        if (err.message === "XMLHttpRequest timeout") {
                            message = "Change user details request timed out!"
                        }
                    }
                    context.executeAction(
                        MessagingActions.updateMessage,
                        {
                            messageName: payload.messagingName,
                            values: {
                                message: message,
                                appearFor: 10,
                                messageStyle: "danger"
                            }
                        }
                    );
                }
            }
            else {
                context.dispatch(Actions.CHANGE_USER_DETAILS_ACTION, data);
                if (payload.messagingName) {
                    context.executeAction(
                        MessagingActions.updateMessage,
                        {
                            messageName: payload.messagingName,
                            values: {
                                message: "Details changed successfully!",
                                appearFor: 10,
                                messageStyle: "success"
                            }
                        }
                    );
                }
            }
        });
        done();
    },
    requestVerificationEmail: function (context,payload, done){
        if (payload.messagingName) {
            context.executeAction(
                MessagingActions.updateMessage,
                {
                    messageName: payload.messagingName,
                    values: {
                        message: "Verification email requested.",
                        appearFor: 10,
                        messageStyle: "info"
                    }
                }
            );
        }
        var parameters = {
            requestEmailVerificationToken: true ,
            jwt: payload.jwt};
        debug("Reading AuthenticationService ->", parameters);
        context.service.read('AuthenticationService', parameters, {timeout: serviceTimeOut}, function (err, data) {
            if (err || !data) {
                var message = '';
                if (err.message === "XMLHttpRequest timeout") {
                    debug("changePasswordFailedAction -  Timeout detected!");
                    message = "Request for verification email was unsuccessful! Request timed out!";
                }
                else {
                    message = "Verification email request failed. " + err.message;
                }
                if (payload.messagingName) {
                    context.executeAction(
                        MessagingActions.updateMessage,
                        {
                            messageName: payload.messagingName,
                            values: {
                                message: message,
                                appearFor: 10,
                                messageStyle: "danger"
                            }
                        }
                    );
                }

            }
            else {
                if (payload.messagingName) {
                    context.executeAction(
                        MessagingActions.updateMessage,
                        {
                            messageName: payload.messagingName,
                            values: {
                                message: "A verification email has been sent to your email address!",
                                appearFor: 10,
                                messageStyle: "info"
                            }
                        }
                    );
                }
            }
        });
        done();
    },
    verifyEmail: function (context,payload, done){
        var parameters = {
            verifyEmail: true ,
            jwt: payload.jwt,
            emailToken: payload.token
        };
        debug("Updating AuthenticationService ->", parameters);
        context.service.update('AuthenticationService', parameters, {}, {timeout: serviceTimeOut}, function (err, data) {
            if (err || !data) {
                debug("Calling VERIFY_EMAIL_FAILED action, Err: ", err, " data:", data);
                var message = '';
                if (err.message === "XMLHttpRequest timeout")
                {
                    debug("changePasswordFailedAction -  Timeout detected!");
                    message = "Email Verification was unsuccessful! Request timed out!";
                }
                else
                {
                    message = "Email Verification was unsuccessful! " + err.message;
                }

                if (payload.messagingName) {
                    context.executeAction(
                        MessagingActions.updateMessage,
                        {
                            messageName: payload.messagingName,
                            values: {
                                message: message,
                                appearFor: 10,
                                messageStyle: "danger"
                            }
                        }
                    );
                }
            }
            else {
                if (payload.messagingName) {
                    context.executeAction(
                        MessagingActions.updateMessage,
                        {
                            messageName: payload.messagingName,
                            values: {
                                message: "Email Verification was successful!",
                                appearFor: 10,
                                messageStyle: "success"
                            }
                        }
                    );
                }
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
export default AuthenticationActions;