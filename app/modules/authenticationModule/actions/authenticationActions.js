/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */
import keyMirror from "react/lib/keyMirror";
import Actions from "./constant";
import AuthenticationStore from '../stores/authenticationStore';
var debug = require('debug')('AuthenticationAction');
/*
 This function is used to save and load the login state store.
 could get the whole store here like this if you wanted to save it to the server:
 var store = context.getStore(exampleStore).getState()
 */
export default function (context, payload, done) {
    debug("The payload in the Action login action  ->", payload);
    var loginTimemout = 10000;
    switch(payload[0]) {
        case "Login":
            debug("Reading AuthenticationService ->", payload[1]);
            context.service.read('AuthenticationService', payload[1], {timeout: loginTimemout}, function (err, data) {
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

        case "LoginWithToken":
                var parameters = {accessToken: true };
                debug("Reading AuthenticationService ->", parameters);
                context.service.read('AuthenticationService', parameters, {timeout: loginTimemout}, function (err, data) {
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
            var parameters = {changePassword: true , username: payload[1], password: payload[2], newPassword: payload[3]};
            debug("Reading AuthenticationService ->", parameters);
            context.service.read('AuthenticationService', parameters, {timeout: loginTimemout}, function (err, data) {
                if (err || !data) {
                    debug("Calling CHANGE_PASSWORD action, Err: ", err, " data:", data);
                    context.dispatch(Actions.CHANGE_PASSWORD, err);
                }
                else {
                    context.dispatch(Actions.CHANGE_PASSWORD, data);
                }
                done();
            });
            break;
        
        case "Logout":
            var store = context.getStore(AuthenticationStore).getState();
            if (store.loggedIn){

                var parameters = {logout: true };
                context.service.read('AuthenticationService', parameters, {timeout: loginTimemout}, function (err, data) {
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
