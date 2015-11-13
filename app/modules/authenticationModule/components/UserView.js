/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';
import AuthenticationUserDetailsView from './UserDetailsView';
import AuthenticationUserSecurityView from './UserSecurityView';

var debug = require('debug')('AuthenticationUserView');
class AuthenticationUserView extends React.Component {

    constructor(props, context) {
        super(props,context);
    }

    render() {
        debug("Rendering");
        var userView = '';
        if (this.props.loggedIn) {
            userView =
                <Tabs defaultActiveKey={1}>
                    <Tab eventKey={1} title="Contact">
                        <AuthenticationUserDetailsView
                            jwt={this.props.jwt}
                            user={this.props.user}
                            imageURL={this.props.imageURL}
                            firstName={this.props.firstName}
                            lastName={this.props.lastName}
                            email={this.props.email}
                            verified={this.props.verified}
                            changeUserDetailsMessageStyle={this.props.changeUserDetailsMessageStyle}
                            changeUserDetailsMessage={this.props.changeUserDetailsMessage}
                            changeUserDetailsMessageValidUntil={this.props.changeUserDetailsMessageValidUntil}
                            />
                    </Tab>
                    <Tab eventKey={2} title="Security">
                        <AuthenticationUserSecurityView
                            jwt={this.props.jwt}
                            user={this.props.user}
                            changePasswordMessageStyle={this.props.changePasswordMessageStyle}
                            changePasswordMessage={this.props.changePasswordMessage}
                            changePasswordMessageValidUntil={this.props.changePasswordMessageValidUntil}
                            />
                    </Tab>
                </Tabs>
        }
        return (
            <div className="authentication-userView-group">
                {userView}
            </div>
        );
    }
}

AuthenticationUserView.propTypes = {
    loggedIn: React.PropTypes.bool.isRequired,
    jwt: React.PropTypes.string,
    user:React.PropTypes.string,
    imageURL: React.PropTypes.string,
    firstName: React.PropTypes.string,
    lastName: React.PropTypes.string,
    email: React.PropTypes.string,
    verified: React.PropTypes.bool,

    changePasswordMessageStyle: React.PropTypes.string,
    changePasswordMessage: React.PropTypes.string,
    changePasswordMessageValidUntil: React.PropTypes.object,

    changeUserDetailsMessageStyle: React.PropTypes.string,
    changeUserDetailsMessage: React.PropTypes.string,
    changeUserDetailsMessageValidUntil: React.PropTypes.object
};

export default AuthenticationUserView;
