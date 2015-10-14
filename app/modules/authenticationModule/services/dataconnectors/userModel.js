/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 **/

/*
* {
 user: myuser.username,
 hash:
 accesstokens: { }
 group: 'administrator',
 email: 'demetris@spanias.com',
 imageurl: "https://scontent-frt3-1.xx.fbcdn.net/hprofile-xtp1/v/t1.0-1/p160x160/11836815_10153529476323501_7420840948075719399_n.jpg?oh=194d9ba316763547aef705da984b08fc&oe=5697E8A6",
 firstname: "Demetris",
 lastname: "Spanias",
 verified: false
 }
* */

function UserModel() {
        // always initialize all instance properties
        this.user = "";
        this.hash = "";
        this.accesstokens = { };
        this.group = "";
        this.email = "";
        this.imageurl = "";
        this.firstname = "";
        this.lastname = "";
        this.verified = false;
}

module.exports = UserModel;