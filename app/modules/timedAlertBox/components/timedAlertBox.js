/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {Alert} from 'react-bootstrap';

import MessagingStore from '../stores/messagingStore'
import MessagingActions from '../actions/messagingActions';

var debug = require('debug')('TimedAlertBox');

var timeoutCounter = null;



class TimedAlertBox extends React.Component {
    constructor(props, context) {
        super(props,context);
        this.state ={
            visible: false
        };
        this._hide = this._hide.bind(this);
        this._show = this._hide.bind(this);
        this._refreshCounter = this._refreshCounter.bind(this);

    }
    componentDidMount() {
        if (this.props != null) {
            if (this.props.MessagingStore[this.props.messagingName] && this.props.MessagingStore[this.props.messagingName].messageValidUntil){
                if (this.props.MessagingStore[this.props.messagingName].messageValidUntil.getTime() > new Date().getTime()) {
                    this._refreshCounter(this.props);
                    this.setState({visible: true});
                }
                else {
                    this.setState({visible: false});
                }
            }
            else if (this.props.appearsUntil) {
                if (this.props.appearsUntil.getTime() > new Date().getTime()) {
                    this._refreshCounter(this.props);
                    this.setState({visible: true});
                }
                else {
                    this.setState({visible: false});
                }
            }
            else
            {
                this.setState({visible: false});
            }
        }
    }
    componentWillUnmount(){
        clearTimeout(timeoutCounter);
    }

    componentWillReceiveProps(nextProps) {
        debug("ReceivedProps -> ", nextProps);
        if (nextProps.MessagingStore[nextProps.messagingName] && nextProps.MessagingStore[nextProps.messagingName].messageValidUntil){
            if (nextProps.MessagingStore[nextProps.messagingName].messageValidUntil.getTime() > new Date().getTime()) {
                this._refreshCounter(nextProps);
                this.setState({visible: true});
            }
            else {
                this.setState({visible: false});
            }
        }
        else if (nextProps.appearsUntil){
            if (nextProps.appearsUntil.getTime() > new Date().getTime()) {
                this._refreshCounter(nextProps);
                this.setState({visible: true});
            }
            else {
                this.setState({visible: false});
            }
        }
        else {
            this.setState({visible: false});
        }

    }

    _refreshCounter(props){
        if (timeoutCounter) {
            clearTimeout(timeoutCounter);
        }
        if (props.MessagingStore[props.messagingName] && props.MessagingStore[props.messagingName].messageValidUntil) {
            if (props.MessagingStore[props.messagingName].messageValidUntil) {
                var timeout = props.MessagingStore[props.messagingName].messageValidUntil.getTime() - new Date().getTime();
                if (timeout > 0) {
                    timeoutCounter = setTimeout(this._hide, timeout);
                }
                else {
                    this._hide();
                }
            }
        }
        else {
            if (props.appearsUntil) {
                var timeout = props.appearsUntil.getTime() - new Date().getTime();
                if (timeout > 0) {
                    timeoutCounter = setTimeout(this._hide, timeout);
                }
                else {
                    this._hide();
                }
            }
        }
    }
    _hide(){
        this.setState({visible: false});
    }

    _show(){
        this.setState({visible: true});
    }

    render() {
        debug("Rendering");

        var alert = '';
        if (this.state.visible) {
            if (this.props.MessagingStore[this.props.messagingName] && this.props.MessagingStore[this.props.messagingName].message) {
                alert = <Alert bsStyle={this.props.MessagingStore[this.props.messagingName] ? this.props.MessagingStore[this.props.messagingName].messageStyle : "info"}>
                    {this.props.MessagingStore[this.props.messagingName] ? this.props.MessagingStore[this.props.messagingName].message : null }
                </Alert>;
            }
            else if (this.props.message) {
                alert = <Alert bsStyle={this.props.style}>{this.props.message}</Alert>;
            }
        }

        return (
            <div>
                {alert}
            </div>
        );
    }
}

var datePropType = function(props, propName, component){
  if (!function (){
          if (Object.proptype.toString.call(props[propName]) !== "[object Date]"){
              return false;
          }
          return !isNaN(props[propName].getTime());
      })  {
      return new Error ("Invalid date!");

  }
};

TimedAlertBox = connectToStores(TimedAlertBox, [MessagingStore], function (context, props) {
    return {
        MessagingStore: context.getStore(MessagingStore).getState()
    };
});

TimedAlertBox.propTypes = {
    messagingName: React.PropTypes.string,
    message: React.PropTypes.string,
    style: React.PropTypes.string,
    appearsUntil: datePropType
};

export default TimedAlertBox;
