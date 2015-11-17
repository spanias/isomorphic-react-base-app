/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */
var debug = require('debug')('TextInputStore');
import {BaseStore} from 'fluxible/addons';
import Actions from "../actions/constant";

class TextInputStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.propStore = {};
    }
    updateStore(payload) {
        var changes = false;
        debug("Updating store using payload: " , payload);
        if (payload.fieldName != undefined && payload.values != undefined) {
            if (this.propStore[payload.fieldName] == undefined){
                this.propStore[payload.fieldName] = {};
            }
            if (payload.values.fieldValue !== undefined && this.propStore[payload.fieldName].fieldValue != payload.values.fieldValue) {
                changes = true;
                this.propStore[payload.fieldName].fieldValue = payload.values.fieldValue;
            }
            if (payload.values.fieldStyle !== undefined && this.propStore[payload.fieldName].fieldStyle != payload.values.fieldStyle) {
                changes = true;
                this.propStore[payload.fieldName].fieldStyle = payload.values.fieldStyle;
            }
            if (payload.values.isValid !== undefined && this.propStore[payload.fieldName].isValid != payload.values.isValid) {
                changes = true;
                this.propStore[payload.fieldName].isValid = payload.values.isValid;
            }

            if (payload.values.hasChanges !== undefined && this.propStore[payload.fieldName].hasChanges != payload.values.hasChanges) {
                changes = true;
                this.propStore[payload.fieldName].hasChanges = payload.values.hasChanges;
            }

            if (payload.fieldType == "emailInput") {
                if (payload.values.emailVerified !== undefined && this.propStore[payload.fieldName].emailVerified != payload.values.emailVerified) {
                    changes = true;
                    this.propStore[payload.fieldName].emailVerified = payload.values.emailVerified;
                }
            }
        }
        debug("Store updated: " , this.propStore);

        if (changes){
            this.emitChange();
        }

    }

    //If field name is defined, reset the particular field name
    resetStore(payload) {
        if (payload.fieldName != undefined) {
            if (this.propStore[payload.fieldName]) {
                 this.propStore[payload.fieldName] = undefined;
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
TextInputStore.storeName = 'textInputStore';
TextInputStore.handlers = {
    [Actions.UPDATE_TEXTINPUT_STORE]: 'updateStore',
    [Actions.RESET_TEXTINPUT_STORE]: 'resetStore'
};

export default TextInputStore;