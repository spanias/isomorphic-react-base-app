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

let app = new Fluxible({
    component: Routes,
    stores: [
        ApplicationStore,
        ExampleStore
    ]
});

app.plug(fetchrPlugin({
    xhrPath: '/api'
}));

export default app;
