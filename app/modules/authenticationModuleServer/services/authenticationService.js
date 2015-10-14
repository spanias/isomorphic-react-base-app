/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
**/
var jwt = require('jsonwebtoken');

//using https://www.npmjs.com/package/password-hash-and-salt
var password = require('password-hash-and-salt');
var UserModel = require('./dataconnectors/userModel');

module.exports = {
    name: 'AuthenticationService',
    dataconnection : null,
    readonly_dataconnection : null,

    authenticate: function(params, callback) {
        var key = 'private';
        var myuser = new UserModel();

        myuser.username = params.username;
        console.log("dataconnection: " + JSON.stringify(this.readonly_dataconnection, null, 4));
        if (this.readonly_dataconnection) {
            this.readonly_dataconnection.readUser("test", myuser, function (err, data) {
                if (!err) {
                    console.log("Data Retrieved from Dynamo: " + JSON.stringify(data));

                    if(data.length === 1) {
                        console.log("Hash: " + data[0].hash);
                        password(params.password).verifyAgainst(data[0].hash, function (error, verified) {
                            if (error)
                                throw new Error('AuthenticationService: Hash verification failed by unknown error!');
                            if (!verified || !data[0].active) {
                                console.log("AuthenticationService: Password hash failed to verify!");
                                var err = {errorID: 1, message: 'Authentication Failed'};
                                callback(err, null)
                            } else {
                                console.log("AuthenticationService: Password hash verified!");
                                var token = jwt.sign({
                                    user: data[0].username,
                                    group: data[0].group,
                                    email: data[0].email,
                                    imageurl: data[0].imageurl,//"https://scontent-frt3-1.xx.fbcdn.net/hprofile-xtp1/v/t1.0-1/p160x160/11836815_10153529476323501_7420840948075719399_n.jpg?oh=194d9ba316763547aef705da984b08fc&oe=5697E8A6",
                                    firstname: data[0].firstname,
                                    lastname: data[0].lastname,
                                    verified: data[0].verified,
                                    active: data[0].active
                                }, key);
                                callback(null, token);
                            }
                        });
                    }
                    else
                    {
                        console.log("AuthenticationService: Username not found!");
                        var err = {errorID: 1, message: 'Authentication Failed'};
                        callback(err, null)
                    }
                }
                else {
                    console.log("Data Retrieval failed from Dynamo: " + JSON.stringify(err));
                }
            });
        }
/*
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

        });*/
    },

    setDataConnectors(_dataconnector,_readonly_dataconnector){
        this.dataconnection = _dataconnector;
        this.readonly_dataconnection = _readonly_dataconnector;
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

