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
    prefix: "test",
    tokenexpirydays : 7,



    authenticate: function(params, callback) {
        var currentdataconnection = this.dataconnection;
        var currectreadonlydataconnection = this.readonly_dataconnection;
        var myuser = new UserModel();
        var prefix = this.prefix;

        var successfullogin = function(params, callback) {
            console.log("AuthenticationService: Successful login procedure: ", params);
            var token = null;
            if (params.rememberme || params.refreshtoken) {
                //refresh token
                var expirydate = new Date();
                expirydate.setDate(expirydate.getDate() + tokenexpirydays);
                token = jwt.sign({
                    user: params.data[0].username,
                    email: params.data[0].email,
                    expiry: expirydate
                }, key);
            }
            var result = {
                user: params.data[0].username,
                group: params.data[0].group,
                email: params.data[0].email,
                imageurl: params.data[0].imageurl,
                firstname: params.data[0].firstname,
                lastname: params.data[0].lastname,
                verified: params.data[0].verified,
                active: params.data[0].active,
                token: token
            };
            callback(null, result);

            if (params.rememberme || params.refreshtoken) {
                console.log("AuthenticationService: Saving new token to database...");
                password(token).hash(function (error, hashedtoken) {
                    if (!error) {
                        // pbkdf2  10000 iterations
                        // Store hash (incl. algorithm, iterations, and salt)
                        params.currentdataconnection.updateAccessToken(params.prefix, hashedtoken, params.data[0].userid, function (err, retrieveddata) {
                            if (err) {
                                console.log("AuthenticationService: Token not saved.", err)
                            }
                            else {
                                console.log("AuthenticationService: Token saved.", retrieveddata)
                            }
                        });
                    }
                });
            }
        };
        if (params.accesstoken && !params.username){
            //Token authentication
            console.log("AuthenticationService: Attempting to login with token!");
            jwt.verify(params.accesstoken, key, function(err,decoded){
               if (!err) {
                   myuser.username = decoded.user;
                    console.log("Decrypted token: ", decoded);
                   if (new Date(decoded.expiry) >= new Date() ) {
                       if (currectreadonlydataconnection) {
                           currectreadonlydataconnection.readUser(prefix, myuser, function (err, data) {
                               console.log("AuthenticationService: Data Retrieved from dataconnection: " + JSON.stringify(data, null, 4));
                               if (data.length === 1) {
                                   password(params.accesstoken).verifyAgainst(data[0].activetoken, function (error, verified) {
                                       if (!verified || !data[0].active) {
                                           console.log("AuthenticationService: Token hash failed to verify! " , verified, data[0].active);
                                           callback(new Error('Token Authentication Failed'), null)
                                       }
                                       else {
                                           console.log("AuthenticationService: Token hash verified!");
                                           var forwardparameters = {
                                               data: data,
                                               rememberme: params.rememberme,
                                               refreshtoken: true,
                                               currentdataconnection: currentdataconnection,
                                               prefix: prefix
                                           };
                                           successfullogin(forwardparameters,function(err,result){
                                               callback(err,result);
                                           });
                                       }
                                   });
                               }
                           });
                       }
                   }
                   else {
                       console.log("AuthenticationService: Token expired!");
                       callback(new Error("Token is expired!"), null);
                   }
               }
               else {
                   console.log("AuthenticationService: Token cannot be verified!");
                   callback(new Error("Token cannot be verified!"), null);
               }
            });
        }
        else {
            //Username and password authentication
            myuser.username = params.username;
            //console.log("dataconnection: " + JSON.stringify(this.readonly_dataconnection, null, 4));
            if (currectreadonlydataconnection) {
                currectreadonlydataconnection.readUser(prefix, myuser, function (err, data) {
                    if (!err) {
                        console.log("AuthenticationService: Data Retrieved from dataconnection: " + JSON.stringify(data, null, 4));

                        if (data.length === 1) {
                            //console.log("Hash: " + data[0].hash);
                            password(params.password).verifyAgainst(data[0].hash, function (error, verified) {
                                if (error)
                                    throw new Error('AuthenticationService: Hash verification failed by unknown error!');
                                if (!verified || !data[0].active) {
                                    console.log("AuthenticationService: Password hash failed to verify!");
                                    callback(new Error( 'Authentication Failed'), null)
                                } else {
                                    console.log("AuthenticationService: Password hash verified!");
                                    var forwardparameters = {
                                        data: data,
                                        rememberme: params.rememberme,
                                        refreshtoken: false,
                                        currentdataconnection: currentdataconnection,
                                        prefix: prefix
                                    };
                                    successfullogin(forwardparameters,function(err,result){
                                        callback(err,result);
                                    });
                                }
                            });
                        }
                        else {
                            console.log("AuthenticationService: Username not found!");
                            callback(new Error('Authentication Failed'), null)
                        }
                    }
                    else {
                        console.log("Data Retrieval failed from dataconnection: " + JSON.stringify(err));
                    }
                });
            }
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

