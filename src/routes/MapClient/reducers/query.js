/*
 * @Author: 史涛 
 * @Date: 2019-01-05 19:31:12 
 * @Last Modified by: 史涛
 * @Last Modified time: 2019-07-04 10:32:13
 */

const {
    CHANGE_QUERYPAGEINDEX,
    QUERY_RESULT,
    QUERYALL_RESULT,
    COLLAPSE_RESULT,
    HOVER_RESULTINDEX,
    CLICK_RESULTINDEX,
    QUERY_ERROR,
    QUERY_ONFOCUS,
    CHANGE_QUERYKEY,
    CURRENT_RESPONSE_TIME,
    CHANGE_QUERYAREAKEY,
    QUERY_SIMPLERESULT,
    RESET_QUERY
} = require('../actions/query');

const assign = require('object-assign');



const initialState = {
    featureTypes: {},
    data: {},
    pageindex: 1,
    page: 10,
    type: '',
    key: '',
    areakey:null,
    responsetime:'',
    areatype:'',
    inputfocus: false,
    result: '',
    resultcollapsed: false,
    simpleresult: [],
    hoverid: null,
    clickid:null,
    selectedid: null,
    resultError: null
};

function query(state = initialState, action) {
    switch (action.type) {
        case QUERY_RESULT: {
            return assign({}, state, {
                result: action.result,
                resultError: null
            });
        }

        case CURRENT_RESPONSE_TIME:{
            return assign({}, state, {
                responsetime: action.time
            });
        }

        case QUERYALL_RESULT: {
            return assign({}, state, {
                resultall: action.result,
                resultError: null
            });
        }

        case COLLAPSE_RESULT: {
            return assign({}, state, {
                resultcollapsed: action.collapse
            });
        }


        case QUERY_ERROR: {
            return assign({}, state, {
                result: '',
                resultError: action.error
            });
        }
        case RESET_QUERY: {
            return assign({}, state, {
                result: '',
                resultall:'',
                key: '',
                resultError: null
            });
        }
        case QUERY_SIMPLERESULT: {
            return assign({}, state, {
                simpleresult: action.simpleresult
            });
        }


        case QUERY_ONFOCUS: {
            return assign({}, state, {
                inputfocus: action.inputfocus,
            });
        }

        case CHANGE_QUERYPAGEINDEX: {
            return assign({}, state, {
                pageindex: action.pageindex,
            });
        }
        case HOVER_RESULTINDEX: {
            return assign({}, state, {
                hoverid: action.hoverid,
            });
        }
        case CLICK_RESULTINDEX: {
            return assign({}, state, {
                clickid: action.clickid,
            });
        }
        
        case CHANGE_QUERYKEY: {
            return assign({}, state, {
                key: action.key,
                type: action.querytype
            });
        }
        case CHANGE_QUERYAREAKEY: {
            return assign({}, state, {
                areakey: action.key,
                areatype: action.querytype
            });
        }
        


        default:
            return state;
    }
}

export default query;
