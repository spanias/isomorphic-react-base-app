/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import React from 'react';
import {Alert} from 'react-bootstrap';

var debug = require('debug')('TimedAlertBox');
var timeoutCounter = null;
class TimedAlertBox extends React.Component {
//TODO: Fix the fact that it re-appears every time props are refreshed even though timer expired. Solved by giving valid for time.

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
            if (this.props.appearsUntil.getTime() > new Date().getTime()) {
                this._refreshCounter(this.props);
                this.setState({visible: true});
            }
            else{
                this.setState({visible: false});
            }
        }
    }
    componentWillUnmount(){
        clearTimeout(timeoutCounter);
    }
    componentWillReceiveProps(nextProps) {
        debug("ReceivedProps -> ", nextProps );
        if (nextProps.appearsUntil.getTime() > new Date().getTime()) {
            this._refreshCounter(nextProps);
            this.setState({visible: true});
        }
        else{
            this.setState({visible: false});
        }
    }

    _refreshCounter(props){
        if (timeoutCounter) {
            clearTimeout(timeoutCounter);
        }
        if(props.appearsUntil) {
            var timeout = props.appearsUntil.getTime() - new Date().getTime();
            if (timeout >0) {
                timeoutCounter = setTimeout(this._hide, timeout);
            }
            else{
                this._hide();
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
        if (!this.props.style){
            //if no style provide default one (might be doable in propTypes)
        }
        if (this.state.visible) {
            alert = <Alert bsStyle={this.props.style}>{this.props.message}</Alert>;
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

TimedAlertBox.propTypes = {
    message: React.PropTypes.string.isRequired,
    style: React.PropTypes.string,
    appearsUntil: datePropType
};

export default TimedAlertBox;
