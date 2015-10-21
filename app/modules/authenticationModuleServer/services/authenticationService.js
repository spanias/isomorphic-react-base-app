/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
**/
var jwt = require('jsonwebtoken');

//using https://www.npmjs.com/package/password-hash-and-salt
var password = require('password-hash-and-salt');
var UserModel = require('./dataconnectors/userModel');
var debug = require('debug')('AuthenticationService');

//change this key to something random
//var key = 'ACsoiaeaeOE128jJA£7121WNnAWnnnACVjjawUEwj';

//the amount of days to keep the session token
//var tokenexpirydays = 7;

module.exports = {
    name: 'AuthenticationService',
    dataConnection : null,
    readOnlyDataConnection: null,
    key : 'ACsoiaeaeOE128jJA£7121WNnAWnnnACVjjawUEwj',
    prefix: "test",
    tokenExpiryDays : 7,
    checkedForInitialization: false,

    authenticate: function(req, params, callback) {
        var myUser = new UserModel();
        var currentDataConnection = this.dataConnection;
        var currentReadOnlyDataConnection = this.readOnlyDataConnection;
        var key = this.key;
        var prefix = this.prefix;
        var tokenExpiryDays = this.tokenExpiryDays;
        //This function gets executed when credentials are validated.
        var successfulLogin = function(request, parameters, callback) {

            debug("Successful login procedure: ", parameters);
            var token = null;
            if (parameters.rememberMe || parameters.refreshToken) {
                //refresh token
                var expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + tokenExpiryDays);
                token = jwt.sign({
                    user: parameters.data[0].username,
                    email: parameters.data[0].email,
                    expiry: expiryDate
                }, key);
                request.res.cookie('authentoken', token, { expires: expiryDate, httpOnly: true /*, secure: true */ });
            }
            var result = {
                user: parameters.data[0].username,
                group: parameters.data[0].group,
                email: parameters.data[0].email,
                imageURL: parameters.data[0].imageURL,
                firstName: parameters.data[0].firstName,
                lastName: parameters.data[0].lastName,
                verified: parameters.data[0].verified,
                active: parameters.data[0].active,
                token: token
            };
            callback(null, result);

            if (parameters.rememberMe || parameters.refreshToken) {
                debug("Saving new token to database...");
                password(token).hash(function (error, hashedToken) {
                    if (!error) {
                        // pbkdf2  10000 iterations
                        // Store hash (incl. algorithm, iterations, and salt)

                        parameters.currentDataConnection.updateAccessToken(parameters.prefix, hashedToken, parameters.data[0].userID, function (err, retrievedData) {
                            if (err) {
                                debug("Token not saved.", err)
                            }
                            else {
                                debug("Token saved.", retrievedData)
                            }
                        });
                    }
                });
            }
        };

        if (params.accessToken && params.username == undefined ){
            //Token authentication
            debug("Attempting to login with token!");
            if (req.cookies['authentoken']) {
                jwt.verify(req.cookies['authentoken'], key, function (err, decoded) {
                    if (!err) {
                        myUser.username = decoded.user;
                        debug("Decrypted token: ", decoded);
                        if (new Date(decoded.expiry) >= new Date()) {
                            if (currentReadOnlyDataConnection) {
                                currentReadOnlyDataConnection.readUser(prefix, myUser, function (err, data) {
                                    debug("Data Retrieved from dataconnection: " + JSON.stringify(data, null, 4));
                                    if (data.length === 1) {
                                        password(req.cookies['authentoken']).verifyAgainst(data[0].activeToken, function (error, verified) {
                                            if (!verified || !data[0].active) {
                                                debug("Token hash failed to verify! ", verified, data[0].active);
                                                req.res.clearCookie('authentoken');
                                                callback(new Error('Token Authentication Failed'), null)

                                            }
                                            else {
                                                debug("Token hash verified!");
                                                var forwardParameters = {
                                                    data: data,
                                                    rememberMe: params.rememberMe,
                                                    refreshToken: true,
                                                    currentDataConnection: currentDataConnection,
                                                    prefix: prefix
                                                };
                                                successfulLogin(req, forwardParameters, function (err, result) {
                                                    callback(err, result);
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        }
                        else {
                            debug("Token expired!");
                            req.res.clearCookie('authentoken');
                            callback(new Error("Token is expired!"), null);
                        }
                    }
                    else {
                        debug("Token cannot be verified!");
                        req.res.clearCookie('authentoken');
                        callback(new Error("Token cannot be verified!"), null);
                    }
                });
            }
            else
            {
                debug("Token not set in cookies! Aborting login procedure.");
                callback(new Error("Token cannot be found!"), null);
            }
        }
        else if (params.logout)
        {
            debug("Invoking logout procedure!");

            debug("Removing cookie token!");
            req.res.clearCookie('authentoken');

            debug("Removing token from dataconnection!");
            //TODO: Remove tokens from dataconnection

            callback(null,true);
        }
        else {
            //Username and password authentication
            debug("Attempting to login with username and password!");
            myUser.username = params.username;

            if (currentReadOnlyDataConnection) {
                currentReadOnlyDataConnection.readUser(prefix, myUser, function (err, data) {
                    if (!err) {
                        debug("Data Retrieved from dataconnection: " + JSON.stringify(data, null, 4));

                        if (data.length === 1) {
                            password(params.password).verifyAgainst(data[0].hash, function (error, verified) {
                                if (error)
                                    throw new Error('AuthenticationService: Hash verification failed by unknown error!');
                                if (!verified || !data[0].active) {
                                    debug("Password hash failed to verify!");
                                    callback(new Error( 'Authentication Failed'), null)
                                } else {
                                    debug("Password hash verified!");
                                    var forwardParameters = {
                                        data: data,
                                        rememberMe: params.rememberMe,
                                        refreshToken: false,
                                        currentDataConnection: currentDataConnection,
                                        prefix: prefix
                                    };
                                    successfulLogin(req, forwardParameters,function(err,result){
                                        callback(err,result);
                                    });
                                }
                            });
                        }
                        else {
                            debug("Username not found!");
                            callback(new Error('Authentication Failed'), null)
                        }
                    }
                    else {
                        debug("Data Retrieval failed from dataconnection: " + JSON.stringify(err));
                        callback(new Error('Data Retrieval failed from dataconnection!'), null)
                    }
                });
            }
            else
            {
                debug("Readonly data connection not set!")
            }
        }
    },

    setDataConnectors(_dataconnector,_readonly_dataconnector){
        this.dataConnection = _dataconnector;
        this.readOnlyDataConnection = _readonly_dataconnector;
    },
    setDataPrefix(prefix){
        this.prefix = prefix;
    },
    setTokenPrivateKey(privateKey){
        this.key = privateKey;
    },
    setTokenExpiryPeriod(days){
        this.tokenExpiryDays = days;
    },
    _setInitializationCheck(initialized){
        this.checkedForInitialization = initialized;
    },

    checkAndInitialize(){
        var currentDataConnection = this.dataConnection;
        var prefix = this.prefix;
        var initFunction = this._setInitializationCheck.bind(this);
        this.readOnlyDataConnection.isInitialised(prefix, function(err, data) {
            if (!err && data){
                //everything is fine!
                initFunction(true);
            }
            else
            {
                debug("DataConnection not initialized: ", err);
                if (data){
                    //missing tables is the data
                    currentDataConnection.createTable(prefix,function (err,data){
                        if (!err){
                            debug("Tables created! ", data);
                            initFunction(true);
                        }
                        else{
                            debug("Initialization failed!", err);
                            initFunction(false);
                        }
                    });
                }
                else {
                    initFunction(false);
                }
            }
        });
    },

    read: function (req, resource, params, config, callback) {
        //params contains username, password
        var authenticationFunction = this.authenticate.bind(this);
        debug("Reading -> ", params);
           if (this.checkedForInitialization){
               authenticationFunction(req, params, function(err, token) {
                   if (err) {
                       callback(err, null)
                   } else {
                       callback(null, token)
                   }
               });
           }
           else
           {
               debug("DataConnection not initialized: ", err);
               callback(new Error('Data connection is not initialized!'))
           }

    },

    create: function(req, resource, params, body, config, callback) {
        /*
         // Creating hash and salt
         password('password').hash(function(error, hash) {
         if(error)
         throw new Error('AuthenticationService: Hash generation failed!');
         // pbkdf2  10000 iterations
         // Store hash (incl. algorithm, iterations, and salt)
         debug("Verifying against user: "+ myUser.username +  " hash: " + hash);
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
            debug("Verifying against user: "+ myuser.username +  " hash: " + hash);
        });*/
        var myUser = new UserModel();
        var currentDataConnection = this.dataConnection;
        var currentReadOnlyDataConnection = this.readOnlyDataConnection;
        var key = this.key;
        var prefix = this.prefix;
        var tokenExpiryDays = this.tokenExpiryDays;
        myUser.username = params.username;

        if (params.changePassword) {
            //first confirm current password
            debug("Changing password: " + JSON.stringify(params, null, 4));
            if (currentReadOnlyDataConnection) {
                currentReadOnlyDataConnection.readUser(prefix, myUser, function (err, data) {
                    if (!err) {
                        debug("Data Retrieved from dataconnection: " + JSON.stringify(data, null, 4));

                        if (data.length === 1) {
                            password(params.password).verifyAgainst(data[0].hash, function (error, verified) {
                                if (error)
                                    throw new Error('AuthenticationService: Hash verification failed by unknown error!');
                                if (!verified || !data[0].active) {
                                    debug("Password hash failed to verify!");
                                    callback(new Error( 'Current password cannot be verified!'), null)
                                } else {
                                    debug("Current password hash verified! Proceeding with password change.");
                                    password(params.newPassword).hash(function(error, newHash) {
                                        if(error)
                                            throw new Error('AuthenticationService: Hash generation failed!');

                                        debug("Generated new hash for password: " + newHash);
                                        currentDataConnection.updatePassword(prefix, newHash, data[0].userID, function (error, data){
                                            if(error){
                                                debug('Could not update hash: ' + JSON.stringify(error));
                                                callback(error,null);
                                            }
                                            else {
                                                debug('Password hash updated: ' + JSON.stringify(data));
                                                callback(null,data);
                                            }
                                        });
                                    });

                                }
                            });
                        }
                        else {
                            debug("Username not found!");
                            callback(new Error('Current password cannot be verified!'), null);
                        }
                    }
                    else {
                        debug("Data Retrieval failed from dataconnection: " + JSON.stringify(err));
                        callback(new Error('Data Retrieval failed from dataconnection!'), null);
                    }
                });
            }
            else
            {
                debug("Readonly data connection not set!");
                callback(new Error('Data Retrieval failed from dataconnection!'), null);
            }

        }
        else{
            debug("Update action not defined!");
            callback(new Error('Update action not defined!'), null);
        }
    }
};
    /*
     // create: function(req, resource, params, body, config, callback) {},
     //
     // delete: function(req, resource, params, config, callback) {}
    */

