/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {ButtonToolbar, Button, Input, Row, Col, Alert, Panel} from 'react-bootstrap';
import {Image, Label, Tabs, Tab} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';
import AuthenticationUserDetailsView from './authenticationUserDetailsView';
import AuthenticationUserSecurityView from './authenticationUserSecurityView';

var debug = require('debug')('AuthenticationUserView');
class AuthenticationUserView extends React.Component {

    constructor(props, context) {
        super(props,context);

        this._refreshStateWithProps = this._refreshStateWithProps.bind(this);
        //this._refreshStateWithProps(props);
    }
    componentDidMount() {
        if (this.props != null) {
            debug("didMount ->", this.props);
            this._refreshStateWithProps(this.props);
        }
    }
    componentWillReceiveProps(nextProps) {
        debug("willReceiveProps ->", nextProps);
        this._refreshStateWithProps(nextProps);
    }

    _refreshStateWithProps(nextProps) {
        if (typeof nextProps !== "undefined" && nextProps.loggedIn) {
            this.setState({
                visible: true,
                user: nextProps.user,
                imageURL: nextProps.imageURL,
                firstName: nextProps.firstName,
                lastName: nextProps.lastName,
                email: nextProps.email,
                verified: nextProps.verified
            });
        }
        else {
            this.setState({
                visible: false,
                user: "",
                imageURL:"",
                firstName: "",
                lastName: "",
                email:"",
                verified: false
            });
        }
    }
    
    render() {
        debug("Rendering");
        //Contains the main component (empty if not logged in)
        var userView =
            <div className="authentication-userView-group">
            </div>;

        if (this.props.loggedIn){
            userView =
                <div className="authentication-userView-group">
                    <Tabs defaultActiveKey={1}>
                        <Tab eventKey={1} title= "Contact">
                            <AuthenticationUserDetailsView {...this.props} />
                        </Tab>
                        <Tab eventKey={2} title="Security">
                            <AuthenticationUserSecurityView {...this.props} />
                        </Tab>
                    </Tabs>
                </div>
        }
        return (
            <div>
                {userView}
            </div>
        );
    }
}

AuthenticationUserView.propTypes = {
};
/*
AuthenticationUserView = connectToStores(AuthenticationUserView, [AuthenticationStore], function (context, props) {
    return context.getStore(AuthenticationStore).getState()
});
*/
export default AuthenticationUserView;
