/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
import React from 'react';
import Fluxible from 'fluxible';
import Routes from './app/components/Routes';
import ApplicationStore from './app/stores/ApplicationStore';
import ExampleStore from './app/stores/exampleStore';
import fetchrPlugin from 'fluxible-plugin-fetchr';
import {AuthenticationMainStore} from './app/modules/authenticationModule/index'
import {TextInputStore} from './app/modules/stateless-react-input/index';
import {MessagingStore} from './app/modules/stateless-react-notifications/index'

let app = new Fluxible({
    component: Routes,
    stores: [
        ApplicationStore,
        ExampleStore,
        AuthenticationMainStore,
        TextInputStore,
        MessagingStore
    ]
});

app.plug(fetchrPlugin({
    xhrPath: '/api'
}));
export default app;
