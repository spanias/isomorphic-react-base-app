/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 **/
    var DynDB = null;
    var debug = require('debug')('AWSDynamoDBConnector');
    //var UserModel = require("./userModel");

class AWSDynamoDB {
    // always initialize all instance properties
    constructor(dynamoDBConfig, readOnly) {
        this.dbReadOnly = readOnly;
        if (dynamoDBConfig && dynamoDBConfig.hasOwnProperty('accessKeyId')) {
            DynDB = require('aws-dynamodb')(dynamoDBConfig);
            this.accessTokenSet = true;
        }
        else
        {
            this.accessTokenSet = false;
        }

        this.createTable = this.createTable.bind(this);
        this.readUser = this.readUser.bind(this);
    }

    isInitialised(prefix, callback){
        if (DynDB && this.accessTokenSet) {
            DynDB.client.listTables(function(err,data){
                if(!err) {
                    var missingTables = [];
                    debug("Initialization data: " , data);
                    if(data.TableNames.indexOf(prefix + '_users')<0) {
                        missingTables.push(prefix + '_users')
                    }
                    if (missingTables.length >0) {
                        callback(new Error('Missing tables: '+ missingTables.toString()), missingTables);
                    }
                    else {
                        callback(null, true);
                    }
                }
                else
                {
                    debug("Initialization error: " , err);
                    callback(err,false);
                }
            });
        }
        else
        {
            //Access token not set or token readonly
            callback(new Error('Access token not set!'),false);
        }

    }

    createTable (prefix, callback) {
        if (this.accessTokenSet && !this.dbReadOnly) {
            var params = {
                AttributeDefinitions: [
                    {AttributeName: "username", AttributeType: "S"},
                    {AttributeName: "email", AttributeType: "S"}
                    /*
                    {AttributeName: "hash", AttributeType: "S"},
                    {AttributeName: "imageURL", AttributeType: "S"},
                    {AttributeName: "firstName", AttributeType: "S"},
                    {AttributeName: "lastName", AttributeType: "S"},
                    {AttributeName: "verified", AttributeType: "S"},
                    {AttributeName: "active", AttributeType: "S"},
                    {AttributeName: "activeToken", AttributeType: "S"}*/
                ],
                KeySchema: [
                    {AttributeName: "username", KeyType: "HASH"}
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                },
                TableName: prefix + "_users",
                GlobalSecondaryIndexes: [
                    {
                        IndexName: 'email-index',
                        KeySchema: [
                            {AttributeName: "email", KeyType: "HASH"}
                        ],
                        ProvisionedThroughput: {
                            ReadCapacityUnits: 1,
                            WriteCapacityUnits: 1
                        },
                        Projection: {
                            ProjectionType: 'ALL'
                        }
                    }
                ],
                StreamSpecification: {
                    StreamEnabled: true,
                    StreamViewType: 'NEW_AND_OLD_IMAGES'
                }

            };
            DynDB.client.createTable(params, function (err, data) {
                if (err) {
                    debug("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                    callback(err, false);
                } else {
                    debug("Created table. Table description JSON:", JSON.stringify(data, null, 2));
                    callback(null, data);
                }
            });
        }
    };

    readUser(prefix, user, callback) {
        DynDB.table(prefix + '_users')
            .where('username').eq(user.username)
            .query(function (err, data) {
                if (err) {
                    debug(err, err.stack);
                    callback(err, null);
                } // an error occurred
                else {
                    //debug(data);           // successful response
                    callback(null, data);
                }
            });
    };
    updateAccessToken(prefix, token, username, callback)
    {
        //TODO: Add multiple tokens to dataconnection for multiple browsers
        if (this.dbReadOnly)
        {
            callback(new Error( "Cannot write with readonly credentials!"), null);
        }
        else
        {
            debug("Updating token for user with id:" + username + " with token: " + token + " in table: " + prefix + "_users");
            DynDB.table(prefix + '_users')
                .where('username').eq(username)
                .return(DynDB.ALL_NEW)
                .update(
                {activeToken: token},
                function (err, data) {
                    if (err) {
                        debug(err, err.stack);
                        callback(err, null);
                    } // an error occurred
                    else {
                        //debug(data);           // successful response
                        callback(null, data);
                    }
                });
        }
    }

    updatePassword(prefix, newPassword, username, callback)
    {
        //TODO: Add multiple tokens to dataconnection for multiple browsers
        if (this.dbReadOnly)
        {
            callback(new Error( "Cannot write with readonly credentials!"), null);
        }
        else {
            debug("Updating password hash for user with id:" + username + " with hash: " + newPassword + " in table: " + prefix + "_users");
            DynDB.table(prefix + '_users')
                .where('username').eq(username)
                .return(DynDB.ALL_NEW)
                .update(
                {hash: newPassword},
                function (err, data) {
                    if (err) {
                        debug(err, err.stack);
                        callback(err, null);
                    }
                    else {
                        callback(null, data);
                    }
                });
        }
    }

    updateUser(prefix, newUserDetails, callback)
    {
        //TODO: Add multiple tokens to dataconnection for multiple browsers
        if (this.dbReadOnly)
        {
            callback(new Error( "Cannot write with readonly credentials!"), null);
        }
        else {

            debug("Updating user details for user:" + newUserDetails.username + " with details: " + JSON.stringify(newUserDetails) + " in table: " + prefix + "_users");
            var updateStructure = {};
            if (newUserDetails.firstName) {
                updateStructure.firstName = newUserDetails.firstName;
            }
            if (newUserDetails.lastName) {
                updateStructure.lastName = newUserDetails.lastName;
            }
            if (newUserDetails.email) {
                updateStructure.email = newUserDetails.email;
            }
            if (newUserDetails.verified != null) {
                updateStructure.verified = newUserDetails.verified;
            }
            if (newUserDetails.imageURL) {
                updateStructure.imageURL = newUserDetails.imageURL;
            }

            DynDB.table(prefix + '_users')
                .where('username').eq(newUserDetails.username)
                .return(DynDB.ALL_NEW)
                .update(
                updateStructure,
                function (err, data) {
                    if (err) {
                        debug(err, err.stack);
                        callback(err, null);
                    }
                    else {
                        callback(null, data);
                    }
                });
        }
    }
    createUser(user, callback) {

    };
}
// export the class
export default  AWSDynamoDB;