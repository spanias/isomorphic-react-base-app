/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {Row, Col} from 'react-bootstrap';
import {connectToStores} from 'fluxible-addons-react';

import TextInputStore from '../stores/textInputStore';
import PasswordInput from "./PasswordInput";

var debug = require('debug')('NewPasswordInput');
class NewPasswordInput extends React.Component {

    constructor(props, context) {
        super(props,context);
        this._confirmPasswordFieldValidation  = this._confirmPasswordFieldValidation.bind(this);
    }
    _confirmPasswordFieldValidation(value){
        if (this.props.TextInputStore[this.props.newPasswordFieldName] &&
            this.props.TextInputStore[this.props.newPasswordFieldName].fieldValue == value){
            return true;
        }
        else {
            return false;
        }
    }
    render() {
        debug("Rendering");
        return (
            <Row>
                <Col xs={6}>
                    <PasswordInput
                        fieldName={this.props.newPasswordFieldName}
                        initialValue=""
                        placeholder="New Password"
                        label="New password"
                        validateOnChange = {true} />
                </Col>
                <Col xs={6}>
                    <PasswordInput
                        fieldName={this.props.confirmPasswordFieldName}
                        initialValue=""
                        placeholder="Confirm password"
                        label="Confirm password"
                        isValid={(this.props.TextInputStore[this.props.newPasswordFieldName] &&
                                    this.props.TextInputStore[this.props.newPasswordFieldName].isValid &&
                                    this.props.TextInputStore[this.props.confirmPasswordFieldName] &&
                                    this.props.TextInputStore[this.props.newPasswordFieldName].fieldValue == this.props.TextInputStore[this.props.confirmPasswordFieldName].fieldValue)}
                        validationFunction = {this._confirmPasswordFieldValidation}
                        validateOnChange = {true} />
                </Col>
            </Row>
        );
    }
}
NewPasswordInput = connectToStores(NewPasswordInput,
        [TextInputStore],
        function (context, props) {
            return {
                TextInputStore: context.getStore(TextInputStore).getState()
            };
        });


NewPasswordInput.propTypes = {
    newPasswordFieldName: React.PropTypes.string.isRequired,
    confirmPasswordFieldName: React.PropTypes.string.isRequired
};

export default NewPasswordInput;
