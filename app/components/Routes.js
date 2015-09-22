/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
var React = require('react');
var Route = require('react-router').Route;
var DefaultRoute = require('react-router').DefaultRoute;
var Application = require('./Application.js');
var Home = require('./pages/Home.js');
var About = require('./pages/About.js');


var routes = (
    <Route name="app" path="/" handler={Application}>
        <Route name="/about" handler={About}/>
        <DefaultRoute name="/" handler={Home}/>
    </Route>
);

module.exports = routes;

