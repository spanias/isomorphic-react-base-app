/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 **/
    var DynDB = null;
    var UserModel = require("./userModel");

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

    createTable (prefix, callback)
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

    readUser(prefix, user, callback)
    {
        console.log("The DynDB client:" + JSON.stringify(DynDB.client));
        DynDB.client.listTables(function(err, data) {
            console.log("The DynDB table list: " + JSON.stringify(data.TableNames));
        });


        //console.log("Querying table: " + prefix + '_users WHERE username = ' + user.username  );

        DynDB.table(prefix + '_users')
            .where('username-index: username').eq(user.username)
            .get(function( err, data ) {
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

    createUser(user, callback)
    {

    };
}
// export the class
export default  AWSDynamoDB;