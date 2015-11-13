/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {Button, Input} from 'react-bootstrap';
import {Label} from 'react-bootstrap';
import AuthenticationActions  from '../../actions/authenticationActions';

var debug = require('debug')('AuthenticationUsernameInput');

class AuthenticationUsernameInput extends React.Component {

    constructor(props, context) {
        super(props,context);
        this.state = {
            username: ""
        };

        this._refreshStateWithProps = this._refreshStateWithProps.bind(this);
        this._handleUsernameInput = this._handleUsernameInput.bind(this);
        this.hasChanges = this.hasChanges.bind(this);
        this.isValid = this.isValid.bind(this);
        this.getValue = this.getValue.bind(this);
    }
    componentDidMount() {
        if (this.props != null) {
            debug("didMount ->", this.props);
            this._refreshStateWithProps(this.props);
        }
    }

    _refreshStateWithProps(nextProps) {
        if (typeof nextProps !== "undefined") {
            this.setState({
                username: nextProps.username
            });
        }
        else {
            this.setState({
                username:""
            });
        }
    }

    _handleUsernameInput() {
        this.setState({
            username: this.refs.username.getValue()
        });

        if (this.props.onChange) {
            this.props.onChange();
        }
    }


    hasChanges() {
        return (this.state.username != this.props.username);
    }

    isValid(){
        return (this.state.username != "");
    }
    getValue(){
        return this.refs.username.getValue();
    }


    render() {
        debug("Rendering");
        return (
            <div>
                <Input
                    type="text"
                    placeholder="Enter text"
                    label="Username"
                    ref="username"
                    value={this.state.username}
                    defaultValue={this.props.username}
                    onChange={this._handleUsernameInput}/>
            </div>
        );
    }
}

AuthenticationUsernameInput.propTypes = {
    username: React.PropTypes.string,
    onChange: React.PropTypes.func

};

export default AuthenticationUsernameInput;
