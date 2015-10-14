/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
'use strict';
require('babel/register');
var express = require('express');
var favicon = require('serve-favicon');
var serialize = require('serialize-javascript');
var navigateAction = require('./app/actions/navigate');
var debug = require('debug')('Example');
var React = require('react');
var app = require('./app');
var HtmlComponent = React.createFactory(require('./Html.js'));
var Router = require('react-router');
var FluxibleComponent = require('fluxible-addons-react/FluxibleComponent');


// Needed to parse posts
var bodyParser = require('body-parser');

/// both needed for csrf protection
var cookieParser = require('cookie-parser');
var csrf = require('csurf');

var server = express();
server.set('state namespace', 'App');

server.use(favicon(__dirname + '/favicon.ico'));

// On production, use the public directory for static files
// This directory is created by webpack on build time.
if (server.get("env") === "production") {
  server.use('/public', express.static(__dirname + '/public'));
}

// On development, serve the static files from the webpack dev server.
if (server.get("env") === "development") {
	require("./webpack/hotServer");
}

server.use(cookieParser());
server.use(bodyParser.json());
server.use(csrf({cookie: true}));


var AuthenticationService = require('./app/modules/authenticationModuleServer/index').AuthenticationService;
var AWSDynamoDBConnector = require ('./app/modules/authenticationModuleServer/index').AWSDynamoDBConnector;

var readonly_dynamocredentials = require('./dynamodbuserreadonly.json');
var full_dynamocredentials = require('./dynamodbuser.json');
var readonly_connector = new AWSDynamoDBConnector(readonly_dynamocredentials, true);
var full_connector = new AWSDynamoDBConnector(full_dynamocredentials, false);
AuthenticationService.setDataConnectors(full_connector, readonly_connector);

//Custom authentication procedure
//If you use this always use salted-hashed-passwords
//var jwt = require('jsonwebtoken');
/*var authFunc = function(params,callback){
    var key = 'private';
    if (params.username === "spanias" && params.password === "itworks") {
        console.log("AuthenticationService: Authentication Successful!");
        var token = jwt.sign({
            user: 'spanias',
            group: 'administrator',
            email: 'demetris@spanias.com',
            imageurl: "https://scontent-frt3-1.xx.fbcdn.net/hprofile-xtp1/v/t1.0-1/p160x160/11836815_10153529476323501_7420840948075719399_n.jpg?oh=194d9ba316763547aef705da984b08fc&oe=5697E8A6",
            firstname: "Demetris",
            lastname: "Spanias",
            verified: false
        }, key);
        callback(null, token);
    }
    else {
        console.log("AuthenticationService: Authentication Failed!");
        var err = {errorID: 1, message: 'Authentication Failed'};
        callback(err, null)
    }
};
AuthenticationService.setAuthenticateMethod(authFunc);*/

var fetchrPlugin = app.getPlugin('FetchrPlugin');
fetchrPlugin.registerService(require('./app/services/exampleService'));
fetchrPlugin.registerService(AuthenticationService);
server.use(fetchrPlugin.getXhrPath(), fetchrPlugin.getMiddleware());

var webpackStats;

if (process.env.NODE_ENV === "production") {
  webpackStats = require("./webpack/utils/webpack-stats.json");
}

server.use(function (req, res, next) {

	if (process.env.NODE_ENV === "development") {
		webpackStats = require("./webpack/utils/webpack-stats.json");
		delete require.cache[require.resolve("./webpack/utils/webpack-stats.json")];
	}

    var context = app.createContext({
        req: req,
        xhrContext: {
            _csrf: req.csrfToken()
        }
    });

    Router.run(app.getComponent(), req.path, function (Handler, state) {
        context.executeAction(navigateAction, state, function () {

            var exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

            var Component = React.createFactory(Handler);
            
            var html = React.renderToStaticMarkup(HtmlComponent({
                state: exposed,
                script: webpackStats.script,
                css: webpackStats.css,
                markup: React.renderToString(
                    React.createElement(
                        FluxibleComponent,
                        { context: context.getComponentContext() },
                        Component()
                    )
                )
            }));

            res.send(html);
        });
    });
});

var port = process.env.PORT || 3000;
server.listen(port);
console.log('Listening on port ' + port);
