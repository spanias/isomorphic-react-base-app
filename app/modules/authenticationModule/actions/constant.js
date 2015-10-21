/**
 * Created by Turmoil on 07/10/2015.

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

    RESET_MESSAGES_ACTION: null
});

export default Actions;
