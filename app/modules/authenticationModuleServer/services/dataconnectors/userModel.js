/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 **/
class UserModel {
        // always initialize all instance properties
    constructor() {
        this.username = "";
        this.hash = "";
        this.accesstokens = {};
        this.group = "";
        this.email = "";
        this.imageurl = "";
        this.firstname = "";
        this.lastname = "";
        this.verified = false;
        this.active = false;
    }
}
module.exports = UserModel;