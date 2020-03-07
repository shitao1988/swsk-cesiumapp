
const {
    LOAD_STATISTICDATA
} = require('./actions');

const assign = require('object-assign');

const initialState = {
    statisticlist: {
        fields: [],
        features: []
      }
}
function statistics(state = initialState, action) {
    switch (action.type) {

        case LOAD_STATISTICDATA: {
            return assign({}, state, {
                statisticlist: action.result,
                resultError: null
            });
        }
       
    default:
        return state;
    }
}

export default statistics;
