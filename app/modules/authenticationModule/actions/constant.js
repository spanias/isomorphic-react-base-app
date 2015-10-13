/**
 * Created by Turmoil on 07/10/2015.
 * var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];
 * var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];
 */
import keyMirror from  "react/lib/keyMirror";

const Actions = keyMirror({
    //Authentication Store Uses These
    LOGINSUCCESS_ACTION: null,
    LOGINFAILED_ACTION: null,
    LOGOUT_ACTION: null
});

export default Actions;
/*
exports.__esModule = true;
exports['default'] = Actions;
module.exports = exports['default'];
    */