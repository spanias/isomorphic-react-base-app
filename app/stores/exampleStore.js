/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
import {BaseStore} from 'fluxible/addons';
import Actions from "../../constants/Actions";

class ExampleStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.propStore = {};
    }
    handleSetState(payload) {
    	this.propStore = payload;
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

ExampleStore.storeName = 'exampleStore';
ExampleStore.handlers = {
    [Actions.EXAMPLE_ACTION]: 'handleSetState'
};

export default ExampleStore;

