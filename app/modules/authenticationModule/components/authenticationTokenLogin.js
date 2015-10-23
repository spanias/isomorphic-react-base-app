/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {Button} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';
import AuthenticationMainStore from '../stores/authenticationMainStore';
import AuthenticationModalView from './authenticationModalView';

var debug = require('debug')('AuthenticationComponent');

class AuthenticationTokenLogin extends React.Component {

    constructor(props, context) {
        super();

        this._refreshStateWithProps = this._refreshStateWithProps.bind(this);
        this.loginWithToken = this.loginWithToken.bind(this);
    }

    componentDidMount(){
        if (!this.props.loggedIn) {
            this.loginWithToken();
        }
    }
    componentWillReceiveProps(nextProps) {
        debug("Receiving new props ->", nextProps);
        this._refreshStateWithProps(nextProps);
    }

    _refreshStateWithProps(nextProps) {

    }

    loginWithToken() {
        if (!this.props.loggedIn) {
            //Authentication Service called here.
            context.executeAction(AuthenticationActions, ["LoginWithToken", {}]);
        }
    }

    render() {
        return (<div></div>);
    }
}

AuthenticationTokenLogin.propTypes = {
};

AuthenticationTokenLogin = connectToStores(AuthenticationTokenLogin, [AuthenticationMainStore], function (context, props) {
    return context.getStore(AuthenticationMainStore).getState()
});

export default AuthenticationTokenLogin;
