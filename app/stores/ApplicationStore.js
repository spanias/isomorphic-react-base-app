/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
import {BaseStore} from 'fluxible/addons';
import Actions from "../../constants/Actions";

class ApplicationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.pageTitle = '';
    }
    updatePageTitle(payload) {
    	console.log(payload);
        this.pageTitle = payload.pageTitle;
        this.emitChange();
    }
    getPageTitle() {
        return this.pageTitle;
    }
    getState() {
        return {
            pageTitle: this.pageTitle
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.pageTitle = state.pageTitle;
    }
}

ApplicationStore.storeName = 'ApplicationStore'; // PR open in dispatchr to remove this need
ApplicationStore.handlers = {
    [Actions.UPDATE_PAGE_TITLE]: 'updatePageTitle'
};

export default ApplicationStore;
