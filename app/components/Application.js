/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
import React from 'react';
import NavBar from './NavBar';
import ApplicationStore from '../stores/ApplicationStore';
import {connectToStores, provideContext} from 'fluxible-addons-react';
var RouteHandler = require('react-router').RouteHandler;

/*
	Here we can include the bootstrap theme or other css as less files. The webpack
	less loader will take care of including this in all pages as the application is
	the root. Rembmer that when setting a class on a react component it must be className= and not class=
*/
if (process.env.BROWSER) {
	require("../../style/theme/style.less");
}

class Application extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    
    componentDidUpdate(prevProps) {
        let newProps = this.props;
        if (newProps.ApplicationStore.pageTitle === prevProps.ApplicationStore.pageTitle) {
            return;
        }
        document.title = newProps.ApplicationStore.pageTitle;
    }
    
    render() {
        return (
            <div>
            	<NavBar />
                <RouteHandler />
            </div>
        );
    }
}

Application.contextTypes = {
    getStore: React.PropTypes.func,
    executeAction: React.PropTypes.func
};

Application = connectToStores(Application, [ApplicationStore], function (context, props) {
    return {
        ApplicationStore: context.getStore(ApplicationStore).getState()
    };
});

Application = provideContext(Application);

export default Application;
