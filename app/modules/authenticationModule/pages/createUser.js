/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {ButtonToolbar, Modal, Button, Input, Row, Col, Alert, ModalTrigger} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';
import AuthenticationMainStore from '../stores/authenticationMainStore';

var debug = require('debug')('CreateUserPage');

class CreateUserPage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="container">
                <h1> Create User Page! </h1>
            </div>
        );
    }
}

CreateUserPage.propTypes = {

};

CreateUserPage = connectToStores(CreateUserPage, [AuthenticationMainStore], function (context, props) {
    return context.getStore(AuthenticationMainStore).getState();
});
export default CreateUserPage;