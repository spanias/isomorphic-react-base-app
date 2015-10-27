/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */
import keyMirror from "react/lib/keyMirror";
import Actions from "./constant";
import AuthenticationMainStore from '../stores/authenticationMainStore';
var debug = require('debug')('AuthenticationAction');
/*
 This function is used to save and load the login state store.
 could get the whole store here like this if you wanted to save it to the server:
 var store = context.getStore(exampleStore).getState()
 */

export default function (context, payload, done) {
    debug("The payload in the Action function  ->", payload);
    var loginTimeOut = 20000;
    switch(payload[0]) {
        case "Login":
            debug("Reading AuthenticationService ->", payload[1]);
            context.service.read('AuthenticationService', payload[1], {timeout: loginTimeOut}, function (err, data) {
                if (err || !data) {
                    debug("Calling LOGINFAILED_ACTION, Err: ", err, " data:", data);
                    context.dispatch(Actions.LOGINFAILED_ACTION, err);
                }
                else {
                    //https://www.npmjs.com/package/react-cookie
                    context.dispatch(Actions.LOGINSUCCESS_ACTION, data);
                }
                done();
            });

            break;

        case "RefreshUser":
            if (payload[1].jwt) {
                debug("Reading AuthenticationService ->", payload[1]);
                context.service.read('AuthenticationService', {
                    refreshUser: true,
                    jwt: payload[1].jwt
                }, {timeout: loginTimeOut}, function (err, data) {
                    debug("Calling REFRESH_USER_ACTION, Err: ", err, " data:", data);
                    if (err || !data) {
                        //COULDN'T RETRIEVE USER. DO NOTHING
                    }
                    else {
                        context.dispatch(Actions.REFRESH_USER_ACTION, data);
                    }
                    done();
                });
            }
            done();
            break;
        case "ResetMessages":
            var store = context.getStore(AuthenticationMainStore).getState();
                context.dispatch(Actions.RESET_MESSAGES_ACTION, null);
                done();
            break;

        case "LoginWithToken":
                var parameters = {accessToken: true };
                debug("Reading AuthenticationService ->", parameters);
                context.service.read('AuthenticationService', parameters, {timeout: loginTimeOut}, function (err, data) {
                    if (err || !data) {
                        debug("Calling LOGINFAILED_ACTION, Err: ", err, " data:", data);
                        context.dispatch(Actions.LOGINFAILED_ACTION, err);
                    }
                    else {
                        context.dispatch(Actions.LOGINSUCCESS_ACTION, data);
                    }
                    done();
                });
            break;

        case "ChangePassword":
            var parameters = {changePassword: true , jwt: payload[1].jwt, username: payload[1].username, password: payload[1].password, newPassword: payload[1].newPassword};
            debug("Updating AuthenticationService ->", parameters);
            context.service.update('AuthenticationService', parameters, {}, {timeout: loginTimeOut}, function (err, data) {
                if (err || !data) {
                    debug("Calling CHANGE_PASSWORD action, Err: ", err, " data:", data);
                    context.dispatch(Actions.CHANGE_PASSWORD_FAILED_ACTION, err);
                }
                else {
                    context.dispatch(Actions.CHANGE_PASSWORD_ACTION, data);
                }
                done();
            });
            break;

        case "ChangeUserDetails":
            var parameters = {updateUserDetails: true , jwt: payload[1].jwt, myUser: payload[1].myUser};
            debug("Updating AuthenticationService ->", parameters);
            context.service.update('AuthenticationService', parameters, {}, {timeout: loginTimeOut}, function (err, data) {
                if (err || !data) {
                    debug("Calling CHANGE_PASSWORD action, Err: ", err, " data:", data);
                    context.dispatch(Actions.CHANGE_USER_DETAILS_FAILED_ACTION, err);
                }
                else {
                    context.dispatch(Actions.CHANGE_USER_DETAILS_ACTION, data);
                }
                done();
            });
            break;

        case "RequestVerificationEmail":
            var parameters = {requestEmailVerificationToken: true , jwt: payload[1].jwt};
            debug("Reading AuthenticationService ->", parameters);
            context.service.read('AuthenticationService', parameters, {}, {timeout: loginTimeOut}, function (err, data) {
                //TODO: Take actions in the store for these actions
                if (err || !data) {
                    debug("Calling REQUEST_EMAIL_VERIFICATION_FAILED action, Err: ", err, " data:", data);
                    context.dispatch(Actions.REQUEST_EMAIL_VERIFICATION_FAILED, err);
                }
                else {
                    context.dispatch(Actions.REQUEST_EMAIL_VERIFICATION, data);
                }
                done();
            });
            break;
        case "VerifyEmail":
            var parameters = {verifyEmail: true , jwt: payload[1].jwt, emailToken: payload[1].token};
            debug("Updating AuthenticationService ->", parameters);
            context.service.update('AuthenticationService', parameters, {}, {timeout: loginTimeOut}, function (err, data) {
                //TODO: Take actions in the store for these actions
                if (err || !data) {
                    debug("Calling VERIFY_EMAIL_FAILED action, Err: ", err, " data:", data);
                    context.dispatch(Actions.VERIFY_EMAIL_FAILED, err);
                }
                else {
                    context.dispatch(Actions.VERIFIED_EMAIL, data);
                }
                done();
            });
            break;
        
        case "Logout":
            var store = context.getStore(AuthenticationMainStore).getState();
            if (store.loggedIn){

                var parameters = {logout: true };
                context.service.read('AuthenticationService', parameters, {timeout: loginTimeOut}, function (err, data) {
                    if (err) {
                        debug("Logout failed! ", err);
                    }
                    else {
                        debug("Logout succeded!");
                    }
                });
                context.dispatch(Actions.LOGOUT_ACTION, null);
                done();
            }
            break;
    }
};
