
const {
    THEMATIC_RESULT,
    SHOW_THEMATICLAYER,
    QUERY_THEMATICRESULT,
    SET_SELECTEDFEATURE,
    SET_SELECTEDQUERYLAYER,
    SHOW_SPATIALQUERY,
    SET_BUFFERDISTANCE
} = require('./actions');

const assign = require('object-assign');

const initialState = {
    themlist: [],
    querylayerid:null,
    themresult:null,
    spatialQueryShow:false,
    bufferdistance:100
}
function themtics(state = initialState, action) {
    switch (action.type) {

        case THEMATIC_RESULT: {
            return assign({}, state, {
                themlist: action.result,
                resultError: null
            });
        }
        case SET_SELECTEDQUERYLAYER: {
            return assign({}, state, {
                querylayerid: action.id,
                resultError: null
            });
        }

        case SHOW_SPATIALQUERY: {
            return assign({}, state, {
                spatialQueryShow: action.show||!state.spatialQueryShow,
                resultError: null
            });
        }
        
        case SET_BUFFERDISTANCE:{
            return assign({}, state, {
                bufferdistance: action.bufferdistance,
                resultError: null
            });
        }

        case SET_SELECTEDFEATURE: {
            return assign({}, state, {
                selectedfeature: action.fea,
                resultError: null
            });
        }

        case QUERY_THEMATICRESULT:{
            return assign({}, state, {
                themresult: action.response,
                querygeometry:action.geometry,
                resultError: null
            });
        }

        case SHOW_THEMATICLAYER:
            return assign({}, state, {
                themlist: state.themlist.map(
                    them =>
                    them.id === action.id ? { ...them, visibility: !them.visibility } : them
                ),
                resultError: null
            });

       
    default:
        return state;
    }
}

export default themtics;
