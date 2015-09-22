/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
import Actions from "../../constants/Actions";
import exampleStore from '../stores/exampleStore';
var RSVP = require('rsvp');

/*
	This function is used to save and load the state of the editorState store.
*/
export default function (context, payload, done) {
	console.log("The payload in the Action saveState ->",payload);
	
	switch(payload[0]){
		
		case "Save":
			// could get the whole store here like this if you wanted to save it to the server: var store = context.getStore(exampleStore).getState()
			console.log("Payload in Action", payload);
			context.service.update('exampleService', payload[1], {}, function (err) {
				if (err) {
				    done();
				    return;
				}
				done();
			});
			break
		
		case "Load":
		    var getState = new RSVP.Promise(function (resolve, reject) {
			context.service.read('exampleService', {}, {}, function(err, results) {
			    if (err) { reject(err); }
			    	resolve(results);
				});
			});
			getState.then(function(state) {
				console.log("Loaded State", JSON.parse(state));
				context.dispatch(Actions.EXAMPLE_ACTION, JSON.parse(state));
				done();
			}).catch(function (err) {
				console.error(err);
				done(err);
			});
			break

	}

};

