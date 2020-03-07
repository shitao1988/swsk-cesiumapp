/*
 * @Author: 史涛 
 * @Date: 2019-01-05 19:30:14 
 * @Last Modified by: 史涛
 * @Last Modified time: 2019-02-13 10:57:17
 */

const {
    ERRORPANEL_SHOW,
    ERRORLISTPANEL_SHOW,
    STARLISTPANEL_SHOW,
    ERRORQUERY_RESULT,
    STARQUERY_RESULT,
    ERRORHOVER_RESULTINDEX,
    RESET_ERRORQUERY,
    RESET_STARQUERY,
    CHANGE_ERROR_LOC,
    ADD_ERROR

} = require('./actions');

const assign = require('object-assign');


const initialState = {
    errorpanelshow: false,
    errorlistpanelshow:false,
    starlistpanelshow:false,
    errorlist:null,
    starlist:null,
    errorinfo:null,
    errorhoverid:null,
    error_x:null,
    eror_y:null,
    error_new_x:null,
    error_new_y:null,
};

function toolbar(state = initialState, action) {
    switch (action.type) {

        case ERRORPANEL_SHOW: {
            return assign({}, state, {
                errorpanelshow: action.show
            });
        }

        case ADD_ERROR: {
            return assign({}, state, {
                errorinfo: action.errorinfo
            });
        }
        case ERRORLISTPANEL_SHOW: {
            return assign({}, state, {
                errorlistpanelshow: action.show
            });
        }

        case STARLISTPANEL_SHOW: {
            return assign({}, state, {
                starlistpanelshow: action.show
            });
        }

        case CHANGE_ERROR_LOC: {
            return assign({}, state, {
                error_new_x:action.x,
                error_new_y:action.y,
            });
        }

        case ERRORQUERY_RESULT: {
            return assign({}, state, {
                errorlist: action.result
            });
        }
        case STARQUERY_RESULT: {
            return assign({}, state, {
                starlist: action.result
            });
        }

        case ERRORHOVER_RESULTINDEX:{
            return assign({}, state, {
                errorhoverid: action.hoverid,
            });
        }
        case RESET_ERRORQUERY: {
            return assign({}, state, {
                errorlist: null
            });
        }

        case RESET_STARQUERY: {
            return assign({}, state, {
                starlist: null
            });
        }
        

        default:
            return state;
    }
}

export default toolbar;
