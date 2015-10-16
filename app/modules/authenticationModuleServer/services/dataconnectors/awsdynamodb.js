/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 **/
    var DynDB = null;
var debug = require('debug')('AWSDynamoDBConnector')
    //var UserModel = require("./userModel");

class AWSDynamoDB {
    // always initialize all instance properties
    constructor(dynamodbconfig, readonly) {
        this.dbreadonly = readonly;
        if (dynamodbconfig && dynamodbconfig.hasOwnProperty('accessKeyId')) {
            DynDB = require('aws-dynamodb')(dynamodbconfig);
            this.accesstokenset = true;
        }
        else
        {
            this.accesstokenset = false;
        }

        this.createTable = this.createTable.bind(this);
        this.readUser = this.readUser.bind(this);
    }

    createTable (prefix, callback) {
        if (this.accesstokenset && !this.dbreadonly) {
            var params = {
                TableName: prefix + "_users",
                KeySchema: [
                    {AttributeName: "userid", KeyType: "HASH"},
                    {AttributeName: "username", KeyType: "HASH"},
                    {AttributeName: "email", KeyType: "HASH"}
                ],
                AttributeDefinitions: [
                    {AttributeName: "userid", AttributeType: "N"},
                    {AttributeName: "username", AttributeType: "S"},
                    {AttributeName: "email", AttributeType: "S"},
                    {AttributeName: "hash", AttributeType: "S"},
                    {AttributeName: "imageurl", AttributeType: "S"},
                    {AttributeName: "firstname", AttributeType: "S"},
                    {AttributeName: "lastname", AttributeType: "S"},
                    {AttributeName: "verified", AttributeType: "S"},
                    {AttributeName: "active", AttributeType: "S"},
                    {AttributeName: "activetoken", AttributeType: "S"}
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 3,
                    WriteCapacityUnits: 3
                }
            };
            this.DynDB.client.createTable(params, function (err, data) {
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
            .order_by('username-index').descending()
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
    updateAccessToken(prefix, token, userid, callback)
    {
        //TODO: Add multiple tokens to dataconnection for multiple browsers
        if (this.dbreadonly)
        {
            var err = {errorID: 2, message: "Cannot write with readonly credentials!"};
            callback(err, null);
        }
        else
        {
            debug("Updating token for user with id:" + userid + " with token: " + token + " in table: " + prefix + "_users");
            DynDB.table(prefix + '_users')
                .where('userid').eq(userid)
                .return(DynDB.ALL_OLD)
                .update(
                {activetoken: token},
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
    createUser(user, callback) {

    };
}
// export the class
export default  AWSDynamoDB;