/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
import React from 'react';
import NavBar from './NavBar';
import ApplicationStore from '../stores/ApplicationStore';
import {connectToStores, provideContext} from 'fluxible-addons-react';

import  { AuthenticationActions, AuthenticationMainStore} from '../modules/authenticationModule/index';

var RouteHandler = require('react-router').RouteHandler;
var refreshUserTimer = null;
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
    componentDidMount(){

        //Registers a timer which will refresh user every 10 seconds
        /*
        var refreshFunction = function(){
            console.log('Automatically refreshing user.')
            context.executeAction(AuthenticationActions, ["RefreshUser", {jwt: this.props.AuthenticationMainStore.jwt}]);
        };
        refreshFunction = refreshFunction.bind(this);
        refreshUserTimer= setInterval(refreshFunction, 10 * 1000);
        */

        //attempts to login using token as soon as it loads
        context.executeAction(AuthenticationActions.loginWithToken);


    }
    componentDidUnmount() {
        //clearInterval(refreshUserTimer);
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

Application = connectToStores(Application, [ApplicationStore, AuthenticationMainStore], function (context, props) {
    return {
        ApplicationStore: context.getStore(ApplicationStore).getState(),
        AuthenticationMainStore: context.getStore(AuthenticationMainStore).getState()
    };
});

Application = provideContext(Application);
export default Application;
