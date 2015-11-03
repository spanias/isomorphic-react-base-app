/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
**/

var dateAdd = require('../utils').DateAdd;
var jwt = require('jsonwebtoken');

//using https://www.npmjs.com/package/password-hash-and-salt
var password = require('password-hash-and-salt');
var UserModel = require('./dataconnectors/userModel');
var debug = require('debug')('AuthenticationService');

module.exports = {
    name: 'AuthenticationService',
    dataConnection : null,
    readOnlyDataConnection: null,
    key : 'ACsoiaeaeOE128jJA£7121WNnAWnnnACVjjawUEwj',
    prefix: "test",
    tokenExpiryDays : 7,
    checkedForInitialization: false,

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
        var successfulLogin = function (request, parameters, callback) {
            debug("Successful login procedure: ", parameters);
            var token = null;
            //refresh session token
            var expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + tokenExpiryDays);
            token = jwt.sign({
                user: parameters.data[0].username,
                email: parameters.data[0].email,
                expiry: expiryDate
            }, key);

            if (parameters.rememberMe || parameters.refreshToken) {
                request.res.cookie('authentoken', token, {expires: expiryDate, httpOnly: true /*, secure: true */});
            }
            request.res.cookie('sessiontoken', token, {httpOnly: true /*, secure: true */});

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

            //if (parameters.rememberMe || parameters.refreshToken) {
            debug("Saving new token to database...");
            password(token).hash(function (error, hashedToken) {
                if (!error) {
                    // pbkdf2  10000 iterations
                    // Store hash (incl. algorithm, iterations, and salt)

                    parameters.currentDataConnection.updateAccessToken(parameters.prefix, hashedToken, parameters.data[0].username, function (err, retrievedData) {
                        if (err) {
                            debug("Token not saved.", err)
                        }
                        else {
                            debug("Token saved.", retrievedData)
                        }
                    });
                }
            });
            //}
        };

        //params contains username, password
        debug("Reading -> ", params);
        if (this.checkedForInitialization) {
            var myUser = new UserModel();
            var currentDataConnection = this.dataConnection;
            var currentReadOnlyDataConnection = this.readOnlyDataConnection;
            var key = this.key;
            var prefix = this.prefix;
            var tokenExpiryDays = this.tokenExpiryDays;
            //This function gets executed when credentials are validated.


            if (params.accessToken && params.username == undefined) {
                //Token authentication
                debug("Attempting to login with token!");
                if (req.cookies['authentoken'] || req.cookies['sessiontoken']) {

                    var token = '';
                    var refreshAuthenToken = false;
                    if (req.cookies['authentoken']) {
                        debug('Logging in with long term cookie!');
                        refreshAuthenToken = true;
                        token = req.cookies['authentoken'];
                    }
                    else {
                        debug('Logging in with session cookie!');
                        refreshAuthenToken = false;
                        token = req.cookies['sessiontoken'];
                    }

                    jwt.verify(token, key, function (err, decoded) {
                        if (!err) {
                            myUser.username = decoded.user;
                            debug("Decrypted token: ", decoded);
                            if (new Date(decoded.expiry) >= new Date()) {
                                if (currentReadOnlyDataConnection) {
                                    currentReadOnlyDataConnection.readUser(prefix, myUser, function (err, data) {
                                        debug("Data Retrieved from dataconnection: " + JSON.stringify(data, null, 4));
                                        if (data.length === 1) {
                                            password(token).verifyAgainst(data[0].activeToken, function (error, verified) {
                                                if (!verified || !data[0].active) {
                                                    debug("Token hash failed to verify! ", verified, data[0].active);
                                                    req.res.clearCookie('authentoken');
                                                    req.res.clearCookie('sessiontoken');
                                                    callback(new Error('Token Authentication Failed'), null)
                                                }
                                                else {
                                                    debug("Token hash verified!");
                                                    var forwardParameters = {
                                                        data: data,
                                                        rememberMe: params.rememberMe,
                                                        refreshToken: refreshAuthenToken,
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
                                req.res.clearCookie('sessiontoken');
                                callback(new Error("Token is expired!"), null);
                            }
                        }
                        else {
                            debug("Token cannot be verified!");
                            req.res.clearCookie('authentoken');
                            req.res.clearCookie('sessiontoken');
                            callback(new Error("Token cannot be verified!"), null);
                        }
                    });
                }
                else {
                    debug("Token not set in cookies! Aborting login procedure.");
                    callback(new Error("Token cannot be found!"), null);
                }
            }
            else  if (params.refreshUser) {
                //Token authentication
                if (params.jwt) {
                    debug("Attempting to login with token!");
                    jwt.verify(params.jwt, key, function (err, decoded) {
                        if (!err) {
                            myUser.username = decoded.user;
                            debug("Decrypted token: ", decoded);
                            if (new Date(decoded.expiry) >= new Date()) {
                                if (currentReadOnlyDataConnection) {
                                    currentReadOnlyDataConnection.readUser(prefix, myUser, function (err, data) {
                                        if (!err && data) {

                                            debug("Data Retrieved from dataconnection: " + JSON.stringify(data, null, 4));
                                            if (data.length == 1) {
                                                var myUser = {
                                                    username: data[0].username,
                                                    email: data[0].email,
                                                    firstName: data[0].firstName,
                                                    lastName: data[0].lastName,
                                                    imageURL: data[0].imageURL,
                                                    verified: data[0].verified

                                                };
                                                callback(null, myUser);
                                            }
                                            else {
                                                debug("User not found!");
                                                callback(new Error("User not found!"), null);
                                            }
                                        }
                                        else{
                                            debug("Error returned from dataconnection:", err);
                                            callback(err, null);
                                        }
                                    });
                                }
                            }
                            else {
                                debug("Token expired!");
                                callback(new Error("Token is expired!"), null);
                            }
                        }
                        else {
                            debug("Token cannot be verified!");
                            callback(new Error("Session token cannot be verified!"), null);
                        }
                    });
                }
                else {
                    debug("Session token not set! Aborting login procedure.");
                    callback(new Error("Session token not set!"), null);
                }
            }
            else if (params.logout) {
                debug("Invoking logout procedure!");

                debug("Removing cookie token!");
                req.res.clearCookie('authentoken');
                req.res.clearCookie('sessiontoken');

                debug("Removing token from dataconnection!");
                //TODO: Remove tokens from dataconnection

                callback(null, true);
            }
            else if (params.requestEmailVerificationToken) {
                debug("Requested eMail verification token.");
                if (params.jwt) {
                    jwt.verify(params.jwt, key, function (err, decoded) {
                        if (!err){
                            var user = {username: decoded.user}
                            if (currentReadOnlyDataConnection) {
                                currentReadOnlyDataConnection.readUser(prefix, user, function (error, data) {
                                    if (!error) {
                                        debug("Data Retrieved from dataconnection: " + JSON.stringify(data, null, 4));
                                        if (data.length === 1) {
                                            var expiryDate = dateAdd(new Date(), 'minute', 10);
                                            token = jwt.sign({
                                                user: data[0].username,
                                                email: data[0].email,
                                                expiry: expiryDate
                                            }, key);
                                            debug('Created token: '+token+' for user: ' + data[0].username + ' and email ' + data[0].email);

                                            if (currentDataConnection) {
                                                debug('Updating email verification token in datastore');
                                                currentDataConnection.updateEmailVerificationToken(prefix,token,data[0].username,function(errorneus, success){
                                                   if (!errorneus) {
                                                       debug('Sending token email with link: http://localhost:3000/verifyEmail/' + token);

                                                       //TODO: Implement SMTP Sending of emails
                                                   }
                                                    else{
                                                       callback(new Error('Cound not update email verification token on dataconnection!'));
                                                   }
                                                });
                                            }
                                            else {
                                                callback(new Error('Dataconnection not defined!'))
                                            }
                                        }
                                        else{
                                            callback(new Error('User not found or multiple users found!'))
                                        }
                                    }
                                    else
                                    {
                                        callback(new Error('Unable to retrieve user from dataconnection!'))
                                    }
                                });
                            }
                            else
                            {
                                callback(new Error('Readonly dataconnection not defined!'))
                            }
                        }
                        else{
                            debug('JWT Token not verified.');
                            callback (new Error('JWT Token cannot be verified.'), null);
                        }
                    });
                }
                else {
                    debug('JWT Token not provided.');
                    callback (new Error('JWT Token is required to verify user.'), null);
                }
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
                                        callback(new Error('Authentication Failed'), null)
                                    } else {
                                        debug("Password hash verified!");
                                        var forwardParameters = {
                                            data: data,
                                            rememberMe: params.rememberMe,
                                            refreshToken: false,
                                            currentDataConnection: currentDataConnection,
                                            prefix: prefix
                                        };
                                        successfulLogin(req, forwardParameters, function (err, result) {
                                            callback(err, result);
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
                else {
                    debug("Readonly data connection not set!")
                }
            }
        }
        else {
            debug("DataConnection not initialized.");
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
        var myUser = {};
        var currentDataConnection = this.dataConnection;
        var currentReadOnlyDataConnection = this.readOnlyDataConnection;
        var key = this.key;
        var prefix = this.prefix;

        var verifyEmailFunction = function (params, decoded,myUser, callback){
            if (currentDataConnection) {
                if (params.emailToken) {
                    jwt.verify(params.emailToken, key, function (error, dec) {
                        if (!error && dec) {
                            if (new Date(dec.expiry) >= new Date()) {
                                if (dec.email == decoded.email) {
                                    myUser.verified = true;
                                    currentDataConnection.updateUser(prefix, myUser, function (err, data) {
                                        if (!err) {
                                            debug("Verified email address successfully! ", data);
                                            callback(null, data);
                                        }
                                        else {
                                            debug("Could not verify email address! ", err);
                                            callback(err, null);
                                        }
                                    });
                                }
                                else {
                                    debug('Invalid email verification token. Email does not match the account email');
                                    callback(new Error('Invalid verification token!'), null);
                                }
                            }
                            else {
                                debug('Invalid email verification token. Token expired');
                                callback(new Error('Invalid verification token! Token expired!'), null);
                            }
                        }
                        else{
                            debug('Invalid email verification token.');
                            callback(new Error('Invalid verification token!!'), null);
                        }

                    });
                }
                else{
                    debug("Token not set!");
                    callback(new Error('Token not set!'), null);
                }
            }
            else {
                debug("Data connection not set!");
                callback(new Error('Data Retrieval failed from dataconnection!'), null);
            }
        }
        var updateUserFunction = function (params, decoded, myUser, callback){
            debug("Updating user details: " + JSON.stringify(params, null, 4));

            if (params.myUser.firstName) {
                myUser.firstName = params.myUser.firstName;
            }
            if (params.myUser.lastName) {
                myUser.lastName = params.myUser.lastName;
            }
            if (params.myUser.email) {
                myUser.email = params.myUser.email;
                myUser.verified = false;
            }

            if (params.myUser.imageURL) {
                myUser.imageURL = params.myUser.imageURL;
            }

            if (Object.keys(myUser).length > 1) {
                if (currentDataConnection) {
                    currentDataConnection.updateUser(prefix, myUser, function (err, data) {
                        if (!err) {
                            debug("Updated user successfully! ", data);
                            callback(null, data);
                        }
                        else {
                            debug("Couldn't update user! ", err);
                            callback(err, null);
                        }
                    });
                }
                else {
                    debug("Data connection not set!");
                    callback(new Error('Data Retrieval failed from dataconnection!'), null);
                }
            }
            else {
                debug("No data to change!");
                callback(new Error('No changes requested!'), null);
            }
        }
        var changePasswordFunction = function (params, decoded, myUser, callback) {
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
                                    callback(new Error('Current password cannot be verified!'), null)
                                }
                                else {
                                    debug("Current password hash verified! Proceeding with password change.");
                                    password(params.newPassword).hash(function (error, newHash) {
                                        if (error)
                                            throw new Error('AuthenticationService: Hash generation failed!');

                                        debug("Generated new hash for password: " + newHash);
                                        currentDataConnection.updatePassword(prefix, newHash, data[0].username, function (error, data) {
                                            if (error) {
                                                debug('Could not update hash: ' + JSON.stringify(error));
                                                callback(error, null);
                                            }
                                            else {
                                                debug('Password hash updated: ' + JSON.stringify(data));
                                                callback(null, data);
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
            else {
                debug("Readonly data connection not set!");
                callback(new Error('Data Retrieval failed from dataconnection!'), null);
            }
        }

        if (params.jwt) {
            jwt.verify(params.jwt, key, function (err, decoded) {
                if (!err) {
                    myUser.username = decoded.user;
                    debug("Decrypted token: ", decoded);
                    if (new Date(decoded.expiry) >= new Date()) {

                        if (params.changePassword) {
                            changePasswordFunction(params, decoded, myUser, callback);
                        }
                        else if (params.updateUserDetails) {
                            updateUserFunction(params, decoded, myUser,callback);
                        }
                        else if (params.verifyEmail){
                            verifyEmailFunction(params, decoded, myUser, callback);
                        }
                        else {
                            debug("Update action not defined!");
                            callback(new Error('Update action not defined!'), null);
                        }
                    }
                    else {
                        //Session token expired
                        debug("JWT Token expired!");
                        callback(new Error('Session token has expired!'), null);
                    }
                }
                else {
                    //Error decrypting session token
                    debug("Unable to decrypt JWT!");
                    callback(new Error('Session token could not be decrypted!'), null);
                }
            });
        }
        else{
            //Not jwt token provided
            debug("JWT Token not provided!");
            callback(new Error('No session token provided!'), null);
        }

    }
};


