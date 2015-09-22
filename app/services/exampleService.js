/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
var fs = require('fs');
var _state = require('./data/savedState');

module.exports = {
    name: 'exampleService',
    
    /*
    	"read" is used for GET requests, other methods are also available. see: 
    	https://github.com/yahoo/fluxible-plugin-fetchr/blob/master/docs/fluxible-plugin-fetchr.md
   		Also note that the "req" argument contains the full request object from nodejs. 	
   	*/
    read: function(req, resource, params, config, callback) {
    	callback(null, _state);
    },
    
    update: function(req, resource, params, body, config, callback) {
        _state = params;
		fs.writeFile(__dirname +'/data/savedState.json', JSON.stringify(_state), function(err) {
			if(err) {
				return console.log(err);
			}
		}); 
        callback(null, _state);
    }

};

