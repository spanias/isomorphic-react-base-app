/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */
import keyMirror from "react/lib/keyMirror";
import Actions from "./constant";
import AuthenticationStore from '../stores/authenticationStore';

/*
 This function is used to save and load the login state store.
 could get the whole store here like this if you wanted to save it to the server:
 var store = context.getStore(exampleStore).getState()
 */
export default function (context, payload, done) {
    console.log("The payload in the Action login action  ->", payload);

    switch(payload[0]){
        case "Login":
            console.log("Reading AuthenticationService ->", payload[1]);
            context.service.read('AuthenticationService', payload[1], {}, function (err, token) {
                 if (err || !token) {
                 context.dispatch(Actions.LOGINFAILED_ACTION, err);
                 } else {
                 context.dispatch(Actions.LOGINSUCCESS_ACTION, token);
                 }
                 done();
            });

            break;

        case "Logout":
            var store = context.getStore(AuthenticationStore).getState();
            if (store.loggedIn){
                context.dispatch(Actions.LOGOUT_ACTION, null)
            }
            break;
    }
};
