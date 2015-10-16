/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
**/
var jwt = require('jsonwebtoken');

//using https://www.npmjs.com/package/password-hash-and-salt
var password = require('password-hash-and-salt');
var UserModel = require('./dataconnectors/userModel');
var debugauth = require('debug')('AuthenticationService');

//change this key to something random
//var key = 'ACsoiaeaeOE128jJA£7121WNnAWnnnACVjjawUEwj';

//the amount of days to keep the session token
//var tokenexpirydays = 7;

module.exports = {
    name: 'AuthenticationService',
    dataconnection : null,
    readonly_dataconnection: null,
    key : 'ACsoiaeaeOE128jJA£7121WNnAWnnnACVjjawUEwj',
    prefix: "test",
    tokenexpirydays : 7,

    authenticate: function(req, params, callback) {
        var currentdataconnection = this.dataconnection;
        var currectreadonlydataconnection = this.readonly_dataconnection;
        var myuser = new UserModel();
        var prefix = this.prefix;
        var key = this.key;
        var tokenexpirydays = this.tokenexpirydays;
        //This function gets executed when credentials are validated.
        var successfullogin = function(request, parameters, callback) {

            debugauth("Successful login procedure: ", parameters);
            var token = null;
            if (parameters.rememberme || parameters.refreshtoken) {
                //refresh token
                var expirydate = new Date();
                expirydate.setDate(expirydate.getDate() + tokenexpirydays);
                token = jwt.sign({
                    user: parameters.data[0].username,
                    email: parameters.data[0].email,
                    expiry: expirydate
                }, key);
                request.res.cookie('authentoken', token, { expires: expirydate, httpOnly: true /*, secure: true */ });
            }
            var result = {
                user: parameters.data[0].username,
                group: parameters.data[0].group,
                email: parameters.data[0].email,
                imageurl: parameters.data[0].imageurl,
                firstname: parameters.data[0].firstname,
                lastname: parameters.data[0].lastname,
                verified: parameters.data[0].verified,
                active: parameters.data[0].active,
                token: token
            };
            callback(null, result);

            if (parameters.rememberme || parameters.refreshtoken) {
                debugauth("Saving new token to database...");
                password(token).hash(function (error, hashedtoken) {
                    if (!error) {
                        // pbkdf2  10000 iterations
                        // Store hash (incl. algorithm, iterations, and salt)

                        parameters.currentdataconnection.updateAccessToken(parameters.prefix, hashedtoken, parameters.data[0].userid, function (err, retrieveddata) {
                            if (err) {
                                debugauth("Token not saved.", err)
                            }
                            else {
                                debugauth("Token saved.", retrieveddata)
                            }
                        });
                    }
                });
            }
        };

        if (params.accesstoken && params.username == undefined ){
            //Token authentication
            debugauth("Attempting to login with token!");
            if (req.cookies['authentoken']) {
                jwt.verify(req.cookies['authentoken'], key, function (err, decoded) {
                    if (!err) {
                        myuser.username = decoded.user;
                        debugauth("Decrypted token: ", decoded);
                        if (new Date(decoded.expiry) >= new Date()) {
                            if (currectreadonlydataconnection) {
                                currectreadonlydataconnection.readUser(prefix, myuser, function (err, data) {
                                    debugauth("Data Retrieved from dataconnection: " + JSON.stringify(data, null, 4));
                                    if (data.length === 1) {
                                        password(req.cookies['authentoken']).verifyAgainst(data[0].activetoken, function (error, verified) {
                                            if (!verified || !data[0].active) {
                                                debugauth("Token hash failed to verify! ", verified, data[0].active);
                                                //request.res.cookie('authentoken', "", { expires: new Date(0)});
                                                req.res.clearCookie('authentoken');
                                                callback(new Error('Token Authentication Failed'), null)

                                            }
                                            else {
                                                debugauth("Token hash verified!");
                                                var forwardparameters = {
                                                    data: data,
                                                    rememberme: params.rememberme,
                                                    refreshtoken: true,
                                                    currentdataconnection: currentdataconnection,
                                                    prefix: prefix
                                                };
                                                successfullogin(req, forwardparameters, function (err, result) {
                                                    callback(err, result);
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        }
                        else {
                            debugauth("Token expired!");
                            //request.res.cookie('authentoken', "", { expires: new Date(0)});
                            req.res.clearCookie('authentoken');
                            callback(new Error("Token is expired!"), null);
                        }
                    }
                    else {
                        debugauth("Token cannot be verified!");
                        //request.res.cookie('authentoken', "", { expires: new Date(0)});
                        req.res.clearCookie('authentoken');
                        callback(new Error("Token cannot be verified!"), null);
                    }
                });
            }
            else
            {
                debugauth("Token not set in cookies! Aborting login procedure.");
                callback(new Error("Token cannot be found!"), null);
            }
        }
        else if (params.logout)
        {
            debugauth("Invoking logout procedure!");

            debugauth("Removing cookie token!");
            req.res.clearCookie('authentoken');

            debugauth("Removing token from dataconnection!");
            //TODO: Remove tokens from dataconnection
            callback(null,true);
        }
        else {
            //Username and password authentication
            debugauth("Attempting to login with username and password!");
            myuser.username = params.username;
            //debugauth("dataconnection: " + JSON.stringify(this.readonly_dataconnection, null, 4));
            if (currectreadonlydataconnection) {
                currectreadonlydataconnection.readUser(prefix, myuser, function (err, data) {
                    if (!err) {
                        debugauth("Data Retrieved from dataconnection: " + JSON.stringify(data, null, 4));

                        if (data.length === 1) {
                            password(params.password).verifyAgainst(data[0].hash, function (error, verified) {
                                if (error)
                                    throw new Error('AuthenticationService: Hash verification failed by unknown error!');
                                if (!verified || !data[0].active) {
                                    debugauth("Password hash failed to verify!");
                                    callback(new Error( 'Authentication Failed'), null)
                                } else {
                                    debugauth("Password hash verified!");
                                    var forwardparameters = {
                                        data: data,
                                        rememberme: params.rememberme,
                                        refreshtoken: false,
                                        currentdataconnection: currentdataconnection,
                                        prefix: prefix
                                    };
                                    successfullogin(req, forwardparameters,function(err,result){
                                        callback(err,result);
                                    });
                                }
                            });
                        }
                        else {
                            debugauth("Username not found!");
                            callback(new Error('Authentication Failed'), null)
                        }
                    }
                    else {
                        debugauth("Data Retrieval failed from dataconnection: " + JSON.stringify(err));
                        callback(new Error('Data Retrieval failed from dataconnection!'), null)
                    }
                });
            }
        }
    },

    setDataConnectors(_dataconnector,_readonly_dataconnector){
        this.dataconnection = _dataconnector;
        this.readonly_dataconnection = _readonly_dataconnector;
    },

    setTokenPrivateKey(privatekey){
        this.key = privatekey;
    },

    setTokenExpiryPeriod(days){
        this.tokenexpirydays = days;
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
        debugauth("Reading -> ", params, "==", params.username, ":", params.password);
        this.authenticate(req, params, function(err, token) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, token)
            }
        });
    },

    create: function(req, resource, params, body, config, callback) {
        /*
         // Creating hash and salt
         password('password').hash(function(error, hash) {
         if(error)
         throw new Error('AuthenticationService: Hash generation failed!');
         // pbkdf2  10000 iterations
         // Store hash (incl. algorithm, iterations, and salt)
         debugauth("Verifying against user: "+ myuser.username +  " hash: " + hash);
         });*/

    },
    update: function(req, resource, params, body, config, callback) {
        /*
        // Creating hash and salt
        password('password').hash(function(error, hash) {
            if(error)
                throw new Error('AuthenticationService: Hash generation failed!');
            // pbkdf2  10000 iterations
            // Store hash (incl. algorithm, iterations, and salt)
            debugauth("Verifying against user: "+ myuser.username +  " hash: " + hash);
        });*/
    }
};
    /*
     // create: function(req, resource, params, body, config, callback) {},
     //
     // delete: function(req, resource, params, config, callback) {}
    */

