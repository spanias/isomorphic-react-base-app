/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
**/
var jwt = require('jsonwebtoken');

module.exports = {
    name: 'AuthenticationService',


    authenticate: function(params,callback){
        var key = 'private';
        if (params.username === "spanias" && params.password === "password") {
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
    },

    setAuthenticateMethod: function(authenticateMethod){
        this.authenticate = authenticateMethod;
    },

    read: function (req, resource, params, config, callback) {
        //params contains username, password
        console.log("AuthenticationService: reading -> ", params, "==", params.username, ":", params.password);
        this.authenticate(params, function(err, token) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, token)
            }
        });
    }
};
    /*
     // create: function(req, resource, params, body, config, callback) {},
     // update: function(req, resource, params, body, config, callback) {},
     // delete: function(req, resource, params, config, callback) {}
    */

