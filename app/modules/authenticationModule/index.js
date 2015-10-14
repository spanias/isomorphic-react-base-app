//AuthenticationModule = module.exports;


import _Actions from './actions/constant';
//AuthenticationModule.Actions = _Actions;
export {_Actions as Actions};

import _AuthenticationComponent from './components/authenticationComponent';
//AuthenticationModule.AuthenticationComponent = _AuthenticationComponent;
export  {_AuthenticationComponent as AuthenticationComponent};

import _AuthenticationActions from './actions/authenticationActions';
//AuthenticationModule.AuthenticationActions = _AuthenticationActions;
export {_AuthenticationActions as AuthenticationActions};

import _AuthenticationStore from  "./stores/authenticationStore";
//AuthenticationModule.AuthenticationStore = _AuthenticationStore;
export {_AuthenticationStore as AuthenticationStore};

