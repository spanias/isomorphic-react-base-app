var AuthenticationModule = module.exports;

import Actions from './actions/constant'
AuthenticationModule.Actions = Actions;

import AuthenticationComponent from './components/authenticationComponent';
AuthenticationModule.AuthenticationComponent = AuthenticationComponent;

import AuthenticationActions from './actions/authenticationActions';
AuthenticationModule.AuthenticationActions = AuthenticationActions;

import AuthenticationStore from  "./stores/authenticationStore";
AuthenticationModule.AuthenticationStore = AuthenticationStore;

var AuthenticationService  = AuthenticationModule.AuthenticationService = require("./services/authenticationService");
