/**
* Copyright 2015, Digital Optimization Group, LLC.
* Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
*/
import Actions from "../../constants/Actions";

/*
	This function is called when a change of path occurs. It is also called on the server to 
	allow for isomorphic rendering. It allows you to dynamically load something into a given 
	store that will be needed for the path. To create a service you must also register it in server.js. 
	See the example in server.js of how to register a service. You 
	would also need to create the service as shown in exampleService.js in the services folder.
	Also remember that when creating a new store it must be added to the app.js file.
*/
export default function (context, payload, done) {
	
	/*
		navigate.js is also used to set the page title dynamically. This happens in the Application.js file.
	*/
	var path = payload.path;
	var titles = {
		"/": {pageTitle: "Home Page"},
		"/about": {pageTitle: "About Us"}
	}
	context.dispatch('UPDATE_PAGE_TITLE', titles[path]);
	
	done();
};

