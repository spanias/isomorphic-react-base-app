/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {Input, Row, Col, Alert} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';

var debug = require('debug')('AuthenticationLoginView');

class AuthenticationLoginView extends React.Component {

    getUsernameValue() {
        return this.state.usernameText;
    }

    getPasswordValue() {
        return this.state.passwordText;
    }

    constructor(props, context) {
        super();
        this.state= {
            usernameText: props.usernameText,
            passwordText: props.passwordText
        };
        this._handleKeyPress = this._handleKeyPress.bind(this);
        this._handleUsernameInput = this._handleUsernameInput.bind(this);
        this._handlePasswordInput = this._handlePasswordInput.bind(this);
        this.getUsernameValue = this.getUsernameValue.bind(this);
        this.getPasswordValue = this.getPasswordValue.bind(this);
    }

    _handleKeyPress(event) {
        var charCode = event.which || event.charCode || event.keyCode || 0;
        if (charCode === 13) {
            if (this.props.onSubmit) {
                this.props.onSubmit();
            }
        }
    }

    _handleUsernameInput()
    {
        this.setState({
            usernameText: this.refs.userInput.getValue()
        });
    }

    _handlePasswordInput()
    {
        this.setState({
            passwordText: this.refs.passInput.getValue()
        });
    }

    render() {
        var form =
                <Row>
                    <Col xs={6}>
                        <Input type="text" ref="userInput" placeholder="Username"
                               value = {this.state.usernameText}
                               onChange={this._handleUsernameInput}
                               onKeyPress={this._handleKeyPress}/>
                    </Col>
                    <Col xs={6}>
                        <Input type="password" ref="passInput"  placeholder="Password"
                               value = {this.state.passwordText}
                               onChange={this._handlePasswordInput}
                               onKeyPress={this._handleKeyPress}/>
                    </Col>
                </Row>;

        return (<div>{form}</div>);
    }
}

AuthenticationLoginView.propTypes = {
};

export default AuthenticationLoginView;