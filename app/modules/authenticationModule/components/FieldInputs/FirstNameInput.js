/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {Button, Input} from 'react-bootstrap';
import {Label} from 'react-bootstrap';
import AuthenticationActions  from '../../actions/authenticationActions';

var debug = require('debug')('AuthenticationFirstNameInput');

class AuthenticationFirstNameInput extends React.Component {

    constructor(props, context) {
        super(props,context);
        this.state = {
            firstName: ""
        };

        this._refreshStateWithProps = this._refreshStateWithProps.bind(this);
        this._handleFirstNameInput = this._handleFirstNameInput.bind(this);
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
                firstName: nextProps.firstName
            });
        }
        else {
            this.setState({
                firstName:""
            });
        }
    }

    _handleFirstNameInput() {
        this.setState({
            firstName: this.refs.firstName.getValue()
        });

        if (this.props.onChange) {
            this.props.onChange();
        }
    }


    hasChanges() {
        return (this.state.firstName != this.props.firstName);
    }

    isValid(){
        return (this.state.firstName != "");
    }
    getValue(){
        return this.refs.firstName.getValue();
    }


    render() {
        debug("Rendering");
        return (
            <div>
                <Input
                    type="text"
                    placeholder="Enter text"
                    label="First Name"
                    ref="firstName"
                    value={this.state.firstName}
                    defaultValue={this.props.firstName}
                    onChange={this._handleFirstNameInput}/>
            </div>
        );
    }
}

AuthenticationFirstNameInput.propTypes = {
    firstName: React.PropTypes.string,
    onChange: React.PropTypes.func

};

export default AuthenticationFirstNameInput;
