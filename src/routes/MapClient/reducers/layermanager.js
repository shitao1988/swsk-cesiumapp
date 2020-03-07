
const {
    RESOURCES_RESULT,
    SHOW_RES,
    CHANGEOPACITY_RES,
    RESOURCES_ADD,
    CHANGEINDEX_RES,
    TOGGLE_EXPEND,
    CHANGE_VISIBLE,
    CHANGE_KEYWORD
} = require('../actions/lmanager');

const assign = require('object-assign');

const initialState = {
    reslist: [],
    keyword:null
}
function layermanager(state = initialState, action) {
    switch (action.type) {

        case RESOURCES_RESULT: {
            return assign({}, state, {
                reslist: action.resresult,
                resultError: null
            });
        }

        case SHOW_RES:
        return assign({}, state, {
            reslist: state.reslist.map(
                res =>
                    res.id === action.id ? { ...res, visibility: !res.visibility } : res
            ),
            resultError: null
        });

        case CHANGE_KEYWORD:
            return assign({},state,{
                keyword:action.keyword
            })

        case CHANGEOPACITY_RES:
            return assign({}, state, {
                reslist: state.reslist.map(
                    res =>
                        res.id === action.id ? { ...res, opacity: action.opacity } : res
                ),
                resultError: null
            });


        case CHANGEINDEX_RES:
            return assign({}, state, {
                reslist: state.reslist.map(
                    res =>
                        res.id === action.id ? { ...res, layerindex: action.layerindex } : res
                ),
                resultError: null
            });
            
        case TOGGLE_EXPEND:
            return assign({},state,{
                reslist:state.reslist.map(
                    res=>
                        res.id===action.id?{...res,expend: !res.expend }:res
                ),
                resultError:null
            })
        
        case CHANGE_VISIBLE:{
            return assign({},state,{
                reslist:state.reslist.map(
                    res=>
                        res.id===action.id?{...res,visibility:action.visibility}:res
                )
            })
        }
        default:
            return state;
    }
}

export default layermanager;
