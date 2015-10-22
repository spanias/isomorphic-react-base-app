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

class AuthenticationComponent extends React.Component {

    constructor(props, context) {
        super();
        this.state = {
            show: false
        };

        this._refreshStateWithProps = this._refreshStateWithProps.bind(this);
        this._showModal = this._showModal.bind(this);
        this._hideModal = this._hideModal.bind(this);
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
    _showModal() {
        this.setState({
            show: true
        });
        context.executeAction(AuthenticationActions, ["ResetMessages", {}]);
    }

    _hideModal() {
        this.setState({
            show: false
        });
        context.executeAction(AuthenticationActions, ["ResetMessages", {}]);
    }
    _logout() {
        context.executeAction(AuthenticationActions, ["Logout", {}])
    }


    loginWithToken() {
        if (!this.props.loggedIn) {
            //Authentication Service called here.
            context.executeAction(AuthenticationActions, ["LoginWithToken", {}]);
        }
    }

    render() {
        var mainButtonText = "";
        if (this.props.loggedIn) {
            mainButtonText = "Logout";
        }
        else {
            mainButtonText = "Login";
        }

        //Main page buttons which serve as the entrypoint of the modal
        // TODO: have style props which change how main buttons look
        var mainbuttons =
            <div className="login-mainButtons">
                <Button bsStyle="info" onClick={this._showModal}>
                    User Profile
                </Button>
                <Button bsStyle="primary" onClick={this._logout}>
                    {mainButtonText}
                </Button>
            </div>;

        if (!this.props.loggedIn){
            mainbuttons =
                <Button bsStyle="primary" onClick={this._showModal}>
                    {mainButtonText}
                </Button>;
        }

        return (
            <div>
                {mainbuttons}
                <AuthenticationModalView
                    {...this.props}
                    show={this.state.show}
                    hideModal={this._hideModal}
                    />
            </div>
        );
    }
}

AuthenticationComponent.propTypes = {
};

AuthenticationComponent = connectToStores(AuthenticationComponent, [AuthenticationMainStore], function (context, props) {
    return context.getStore(AuthenticationMainStore).getState()
});

export default AuthenticationComponent;
