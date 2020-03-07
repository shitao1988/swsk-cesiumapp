
const {
    RESOURCES_RESULT,
    SHOW_THEM,
    CHANGEOPACITY_THEM,
    RESOURCES_ADD,
    CHANGEINDEX_THEM
} = require('./actions');

const assign = require('object-assign');

const initialState = {
    reslist: []
}
function layermanager(state = initialState, action) {
    switch (action.type) {

        case RESOURCES_RESULT: {
            return assign({}, state, {
                reslist: action.resresult,
                resultError: null
            });
        }

        case RESOURCES_ADD:{
            return assign({}, state, {
                reslist: [...state.reslist,action.data],
                resultError: null
            });
        }

        case SHOW_THEM:
        return assign({}, state, {
            reslist: state.reslist.map(
                res =>
                    res.id === action.id ? { ...res, visibility: !res.visibility } : res
            ),
            resultError: null
        });


    case CHANGEOPACITY_THEM:
        return assign({}, state, {
            reslist: state.reslist.map(
                res =>
                    res.id === action.id ? { ...res, opacity: action.opacity } : res
            ),
            resultError: null
        });


    case CHANGEINDEX_THEM:
        return assign({}, state, {
            reslist: state.reslist.map(
                res =>
                    res.id === action.id ? { ...res, layerindex: action.layerindex } : res
            ),
            resultError: null
        });
    

    default:
        return state;
    }
}

export default layermanager;
