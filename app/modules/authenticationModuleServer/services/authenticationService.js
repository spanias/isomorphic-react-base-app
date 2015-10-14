/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
**/
var jwt = require('jsonwebtoken');

//using https://www.npmjs.com/package/password-hash-and-salt
var password = require('password-hash-and-salt');
var UserModel = require('./dataconnectors/userModel');

var key = 'ACsoiaeaeOE128jJA£7121WNnAWnnnACVjjawUEwj';
var tokenexpirydays = 7;

module.exports = {
    name: 'AuthenticationService',
    dataconnection : null,
    readonly_dataconnection: null,
    key : 'ACsoiaeaeOE128jJA£7121WNnAWnnnACVjjawUEwj',
    tokenexpirydays : 7,

    authenticate: function(params, callback) {
        var myuser = new UserModel();
        myuser.username = params.username;

        var currentdataconnection = this.dataconnection;
        //console.log("dataconnection: " + JSON.stringify(this.readonly_dataconnection, null, 4));
        if (this.readonly_dataconnection) {
            this.readonly_dataconnection.readUser("test", myuser, function (err, data) {
                if (!err) {
                    console.log("AuthenticationService: Data Retrieved from dataconnection: " + JSON.stringify(data, null,4));

                    if(data.length === 1) {
                        //console.log("Hash: " + data[0].hash);
                        password(params.password).verifyAgainst(data[0].hash, function (error, verified) {
                            if (error)
                                throw new Error('AuthenticationService: Hash verification failed by unknown error!');
                            if (!verified || !data[0].active) {
                                console.log("AuthenticationService: Password hash failed to verify!");
                                var err = {errorID: 1, message: 'Authentication Failed'};
                                callback(err, null)
                            } else {
                                console.log("AuthenticationService: Password hash verified!");
                                var expirydate= new Date();
                                expirydate.setDate(expirydate.getDate() + tokenexpirydays);
                                var token = jwt.sign({
                                    user: data[0].username,
                                    email: data[0].email,
                                    expiry: expirydate
                                }, key);
                                var result = {
                                    user: data[0].username,
                                    group: data[0].group,
                                    email: data[0].email,
                                    imageurl: data[0].imageurl,
                                    firstname: data[0].firstname,
                                    lastname: data[0].lastname,
                                    verified: data[0].verified,
                                    active: data[0].active,
                                    token: token
                                };
                                if (params.rememberme) {
                                    console.log("AuthenticationService: Saving token to database...");
                                    password(token).hash(function (error, hashedtoken) {
                                        if (error)
                                            throw new Error('AuthenticationService: Hash generation failed!');
                                        // pbkdf2  10000 iterations
                                        // Store hash (incl. algorithm, iterations, and salt)
                                        currentdataconnection.updateAccessToken("test", hashedtoken, data[0].userid, function (err, data) {
                                            if (err) {
                                                console.log("AuthenticationService: Token not saved.", err)
                                            }
                                            else {
                                                console.log("AuthenticationService: Token saved.", data)
                                            }
                                        });
                                    });
                                }

                                callback(null, result);
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
                    console.log("Data Retrieval failed from dataconnection: " + JSON.stringify(err));
                }
            });
        }
    },

    setDataConnectors(_dataconnector,_readonly_dataconnector){
        this.dataconnection = _dataconnector;
        this.readonly_dataconnection = _readonly_dataconnector;
    },

    /*
    setAuthenticateMethod: function(authenticateMethod){
        this.authenticate = authenticateMethod;
    },*/

    /*
    setCreateMethod: function(createMethod){
        this.createmethod = createMethod;
    },*/

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
        /*
        // Creating hash and salt
        //this will read the user's data (we generate it here instead

        password('password').hash(function(error, hash) {
            if(error)
                throw new Error('AuthenticationService: Hash generation failed!');
            // pbkdf2  10000 iterations
            // Store hash (incl. algorithm, iterations, and salt)
            console.log("AuthenticationService: Verifying against user: "+ myuser.username +  " hash: " + hash);
        });*/
    create: function(req, resource, params, body, config, callback) {

    }
};
    /*
     // create: function(req, resource, params, body, config, callback) {},
     // update: function(req, resource, params, body, config, callback) {},
     // delete: function(req, resource, params, config, callback) {}
    */

