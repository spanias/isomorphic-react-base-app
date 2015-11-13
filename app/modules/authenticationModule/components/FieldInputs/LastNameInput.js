/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {Button, Input} from 'react-bootstrap';
import {Label} from 'react-bootstrap';
import AuthenticationActions  from '../../actions/authenticationActions';
var debug = require('debug')('AuthenticationLastNameInput');

class AuthenticationLastNameInput extends React.Component {

    constructor(props, context) {
        super(props,context);
        this.state = {
            lastName: ""
        };

        this._refreshStateWithProps = this._refreshStateWithProps.bind(this);
        this._handleLastNameInput = this._handleLastNameInput.bind(this);
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
                lastName: nextProps.lastName
            });
        }
        else {
            this.setState({
                lastName:""
            });
        }
    }

    _handleLastNameInput() {
        this.setState({
            lastName: this.refs.lastName.getValue()
        });
        if (this.props.onChange) {
            this.props.onChange();
        }
    }


    hasChanges() {
        return (this.state.lastName != this.props.lastName);
    }

    isValid(){
        return (this.state.lastName != "");
    }
    getValue(){
        return this.refs.lastName.getValue();
    }


    render() {
        debug("Rendering");

        return (
            <div>
                <Input
                    type="text"
                    placeholder="Enter text"
                    label="Last Name"
                    ref="lastName"
                    value={this.state.lastName}
                    defaultValue={this.props.lastName}
                    onChange={this._handleLastNameInput}/>
            </div>
        );
    }
}

AuthenticationLastNameInput.propTypes = {
    lastName: React.PropTypes.string,
    onChange: React.PropTypes.func

};

export default AuthenticationLastNameInput;
