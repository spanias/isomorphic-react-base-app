/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
**/
var jwt = require('jsonwebtoken');
var dataconnection = require('./dataconnectors/awsdynamodb');

//using https://www.npmjs.com/package/password-hash-and-salt
var password = require('password-hash-and-salt');
var UserModel = require('./dataconnectors/userModel');

module.exports = {
    name: 'AuthenticationService',

    authenticate: function(params,callback){
        var key = 'private';
        var myuser = new UserModel();
        myuser.username = params.username;
        dataconnection.readuser("test", myuser, function(err, data){
            if(!err)
            {
                console.log("Data Retrieved from Dynamo: " + JSON.stringify(data));
            }
            else
            {
                console.log("Data Retrieval failed from Dynamo: " + JSON.stringify(err));
            }
        });

        // Creating hash and salt
        myuser.username = "spanias";
        //this will read the user's data (we generate it here instead

        password('password').hash(function(error, hash) {
            if(error)
                throw new Error('AuthenticationService: Hash generation failed!');

            // pbkdf2  10000 iterations
            // Store hash (incl. algorithm, iterations, and salt)
            console.log("AuthenticationService: Verifying against user: "+ myuser.username +  " hash: " + hash);

            //Verifying the hash
            password(params.password).verifyAgainst(hash, function(error, verified) {
                if(error)
                    throw new Error('AuthenticationService: Hash verification failed by unknown error!');
                if(!verified) {
                    console.log("AuthenticationService: Password hash failed to verify!");
                    passwordVerified = false;
                } else {
                    console.log("AuthenticationService: Password hash verified!");
                    if (params.username === myuser.username) {
                        console.log("AuthenticationService: Authentication Successful!");
                        var token = jwt.sign({
                            user: myuser.username,
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
                }
            });
        });
    },

    setAuthenticateMethod: function(authenticateMethod){
        this.authenticate = authenticateMethod;
    },

    setCreateMethod: function(createMethod){
        this.createmethod = createMethod;
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
    },

    create: function(req, resource, params, body, config, callback) {

    }
};
    /*
     // create: function(req, resource, params, body, config, callback) {},
     // update: function(req, resource, params, body, config, callback) {},
     // delete: function(req, resource, params, config, callback) {}
    */

