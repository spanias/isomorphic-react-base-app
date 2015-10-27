/**
 * Copyright 2015, Digital Optimization Group, LLC.
 * Copyrights licensed under the APACHE 2 License. See the accompanying LICENSE file for terms.
 */

import keyMirror from  "react/lib/keyMirror";

const Actions = keyMirror({
    //Authentication Store Uses These
    LOGINSUCCESS_ACTION: null,
    LOGINFAILED_ACTION: null,

    LOGOUT_ACTION: null,

    CHANGE_PASSWORD_ACTION: null,
    CHANGE_PASSWORD_FAILED_ACTION: null,

    CHANGE_USER_DETAILS_ACTION: null,
    CHANGE_USER_DETAILS_FAILED_ACTION: null,

    VERIFY_EMAIL_FAILED: null,
    VERIFIED_EMAIL: null,

    REQUEST_EMAIL_VERIFICATION_FAILED: null,
    REQUEST_EMAIL_VERIFICATION: null,

    RESET_MESSAGES_ACTION: null
});

export default Actions;
