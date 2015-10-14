/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 **/
var AWS = require("aws-sdk");
var _DynDB =  AWS.DynamoDB;
var DynDB = require('aws-dynamodb')(_DynDB);


var UserModel = require("./userModel");

function AWSDynamoDB() {
    // always initialize all instance properties

    this.dbreadonly = true;
    this.accesstokenset = false;
}
// class methods
AWSDynamoDB.prototype.setAccessToken = function(path, dbreadonly, callback)
{
    if(AWS.config.loadFromPath(path))
    {
        this.accesstokenset = true;
        this.dbreadonly = dbreadonly;
        callback(true);
    }
    else
    {
        callback(false);
    }
};

AWSDynamoDB.prototype.createTable = function(prefix, callback)
{
    if (this.accesstokenset && !this.dbreadonly){
        var params = {
            TableName : prefix + "_users",
            KeySchema: [
                { AttributeName: "userid", KeyType: "HASH"},
                { AttributeName: "username", KeyType: "HASH"},
                { AttributeName: "email", KeyType: "HASH" }
            ],
            AttributeDefinitions: [
                { AttributeName: "userid", AttributeType: "N"},
                { AttributeName: "username", AttributeType: "S" },
                { AttributeName: "email", AttributeType: "S" },
                { AttributeName: "hash", AttributeType: "S" },
                { AttributeName: "accesstokens", AttributeType: "S" },
                { AttributeName: "imageurl", AttributeType: "S" },
                { AttributeName: "firstname", AttributeType: "S" },
                { AttributeName: "lastname", AttributeType: "S" },
                { AttributeName: "verified", AttributeType: "S" },
                { AttributeName: "active", AttributeType: "S" }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 3,
                WriteCapacityUnits: 3
            }
        };

        this.DynDB.client.createTable(params, function(err, data) {
            if (err) {
                console.error("awsdynamodb: Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                callback(err, false);
            } else {
                console.log("awsdynamodb: Created table. Table description JSON:", JSON.stringify(data, null, 2));
                callback(null, data);
            }
        });
    }
};
AWSDynamoDB.prototype.readUser = function(prefix, user, callback)
{
    var params = {
        TableName: prefix + '_users',
        IndexName: 'username',
        Key: {
            username: {S: user.username}
        },
        ReturnConsumedCapacity: 'TOTAL',
        ScanIndexForward: true
    };
    DynDB.client.getItem(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err, null);
        } // an error occurred
        else{
            console.log(data);           // successful response
            callback(null, data);
        }
    });

};

AWSDynamoDB.prototype.createUser = function(user, callback)
{

};
// export the class
module.exports = AWSDynamoDB;