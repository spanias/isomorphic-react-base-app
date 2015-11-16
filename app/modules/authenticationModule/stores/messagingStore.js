/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */
var debug = require('debug')('MessagingStore');
import {BaseStore} from 'fluxible/addons';
import Actions from "../actions/constant";

class MessagingStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.propStore = {};
    }
    updateStore(payload) {
        var changes = false;
        debug("Updating store using payload: " , payload);
        if (payload.messageName != undefined && payload.values != undefined) {
            if (this.propStore[payload.messageName] == undefined){
                this.propStore[payload.messageName] = {};
            }
            if (payload.values.messageStyle !== undefined && this.propStore[payload.messageName].messageStyle != payload.values.messageStyle) {
                changes = true;
                this.propStore[payload.messageName].messageStyle = payload.values.messageStyle;
            }
            if (payload.values.message !== undefined && this.propStore[payload.messageName].message != payload.values.message) {
                changes = true;
                this.propStore[payload.messageName].message = payload.values.message;
            }

            if (payload.values.messageValidUntil !== undefined && this.propStore[payload.messageName].messageValidUntil != payload.values.messageValidUntil) {
                changes = true;
                this.propStore[payload.messageName].messageValidUntil = payload.values.messageValidUntil;
            }
        }
        debug("Store updated: " , this.propStore);

        if (changes){
            this.emitChange();
        }

    }

    //If field name is defined, reset the particular field name
    resetStore(payload) {
        if (payload.messageName != undefined) {
            if (this.propStore[payload.messageName]) {
                this.propStore[payload.messageName] = undefined;
            }
        }
        else {
            this.propStore = {};
        }
        this.emitChange();
    }

    getState() {
        return this.propStore;
    }
    getStateOfField(payload) {
        if (payload) {
            if (this.propStore[payload]) {
                return this.propStore[payload];
            }
            else{
                return new Error("Provided field doesn't exist!");
            }
        }
        else {
            return new Error("No field provided!");
        }
    }
    dehydrate() {
        return {propStore: this.propStore};
    }
    rehydrate(state) {
        this.propStore = state.propStore;
    }
}
MessagingStore.storeName = 'messagingStore';
MessagingStore.handlers = {
    [Actions.UPDATE_MESSAGING_STORE]: 'updateStore',
    [Actions.RESET_MESSAGING_STORE]: 'resetStore'
};

export default MessagingStore;