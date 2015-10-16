/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {ButtonToolbar, Button, Input, Row, Col, Alert, Panel} from 'react-bootstrap';
import {Image, Label} from 'react-bootstrap';
import AuthenticationActions  from '../actions/authenticationActions';
import AuthenticationStore from '../stores/authenticationStore';
var debugauth = require('debug')('AuthenticationUserView');
class AuthenticationUserView extends React.Component {

    constructor(props, context) {
        super(props,context);
        this.state = {
            visible: false,
            imageurl:"",
            user: "",
            firstname: "",
            lastname: "",
            email:"",
            verified: "",
            group: ""
        };

        this._refreshStateWithProps = this._refreshStateWithProps.bind(this);
        this._refreshStateWithProps(props);
        this._handleEmailInput = this._handleEmailInput.bind(this);
        this._validateEmail = this._validateEmail.bind(this);
    }
    componentDidMount()
    {
        debugauth("didMount ->", this.props);
        this._refreshStateWithProps(this.props);
    }
    componentWillReceiveProps(nextProps) {
        debugauth("willReceiveProps ->", nextProps);
        this._refreshStateWithProps(nextProps);
    }

    _refreshStateWithProps(nextProps) {
        if (typeof nextProps !== "undefined" && nextProps.loggedIn) {
            this.setState({
                visible: true,
                user: nextProps.user,
                imageurl: nextProps.imageurl,
                firstname: nextProps.firstname,
                lastname: nextProps.lastname,
                email: nextProps.email,
                verified: nextProps.verified,
                group: nextProps.group
            });
        }
        else {
            this.setState({
                visible: false,
                user: "",
                imageurl:"",
                firstname: "",
                lastname: "",
                email:"",
                verified: "",
                group: ""
            });
        }
    }

    _validateEmail() {
        // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if  (re.test(this.state.email))
        {
            return 'success';
        }
        else {
            return 'error';
        }
    }
    _handleEmailInput(){
    this.setState({
        email: this.refs.email.getValue()
    });
}
    /*
    _handleKeyPress(event)
    {
        //debugauth("Keypress event ->", event);
        var charCode = event.which || event.charCode || event.keyCode || 0;
        //debugauth("charCode ->", charCode);
        if (charCode === 13) {

        }
    }
    */


    render() {

        debugauth("Rendering");
        //Contains the main component (empty if not logged in)
        var userview =
            <div className="authentication-userview-group">
            </div>;


        var verifiedlabel = <span><Label bsSize="xs" bsStyle="danger">Unverified</Label></span>;
        if (this.state.verified)
        {
            verifiedlabel = <span><Label bsSize="xs" bsStyle="success">Verified</Label></span>;
        }
        //if there is a user logged in show the user view
        /*
         <Col xs={6}><Image src={this.state.imageurl} circle /></Col>

        */
        var avatarstyle = {
            "border-radius": '50px',
            "width": '125px',
            "height": '140px',
            "padding-bottom": "20px",
            "margin-left": "40px",
            "margin-top": "10px"
        };

        var usernamediv = {
            "padding-bottom": "20px",
            "margin-top": "40px"
        };
        var usernamelabelspan = {
            "font-size": "24px",
            "font-weight": "bold"
        };
        var usernamespan = {
            "font-size": "24px",
            "padding-left": "5px"
        };

        if (this.props.loggedIn){
            userview =
                <div className="authentication-userview-group">
                    <Panel header="User Information" bsStyle="primary">
                        <Row>
                            <Col xs={6}><img src={this.state.imageurl} style={avatarstyle} className="authenticationUserView-avatar"/></Col>
                            <Col xs={6}><div style={usernamediv}><span style={usernamelabelspan}>Username:</span> <span style={usernamespan}>{this.state.user}</span> </div></Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Input
                                    type="text"
                                    placeholder="Enter text"
                                    label="First Name"
                                    value={this.state.firstname} />
                            </Col>
                            <Col xs={6}>
                                <Input
                                    type="text"
                                    placeholder="Enter text"
                                    label="Last Name"
                                    value={this.state.lastname} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <Input
                                    type="text"
                                    placeholder="someone@somewhere.com"
                                    label="E-Mail Address"
                                    value={this.state.email}
                                    addonAfter={verifiedlabel}
                                    ref="email"
                                    bsStyle={this._validateEmail()}
                                    defaultValue={this.state.email}
                                    onChange={this._handleEmailInput}
                                    />
                            </Col>
                        </Row>
                        <Button >Save</Button>
                    </Panel>
                </div>;
        }
        return (
            <div>
                {userview}
            </div>
        );
    }
}

AuthenticationUserView.propTypes = {
};

AuthenticationUserView = connectToStores(AuthenticationUserView, [AuthenticationStore], function (context, props) {
    return context.getStore(AuthenticationStore).getState()
});

export default AuthenticationUserView;
