/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */
import keyMirror from "react/lib/keyMirror";
import Actions from "./constant";
import MessagingStore from '../stores/messagingStore.js';
import {DateAdd} from '../utils';


var debug = require('debug')('MessagingActions');

var MessagingActions = module.exports = {

    updateMessage: function (context,payload,done) {
        if (payload.values) {
            var appearsUntil = DateAdd(new Date(), 'second', payload.values.appearFor);
            var parameters = {
                messageName: payload.messageName,
                values: {
                    message: payload.values.message,
                    messageStyle: payload.values.messageStyle,
                    messageValidUntil: appearsUntil
                }
            }
            context.dispatch(Actions.UPDATE_MESSAGING_STORE, parameters);
        }
        done();
    },

    eraseMessage: function (context, payload, done){
        if (payload.messageName) {
            context.dispatch(Actions.RESET_MESSAGING_STORE, payload);
        }
        done();
    }
}
export default MessagingActions;