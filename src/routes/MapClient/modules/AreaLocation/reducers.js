
const {
    AREALOCATION_RESULT,
    RESET_AREALOCATION,
    SELECTED_AREA
} = require('./actions');

const assign = require('object-assign');


const initialState = {
    result: '',
    currentarea:'',
    resultError: null
};

function arealocation(state = initialState, action) {
    switch (action.type) {

    case AREALOCATION_RESULT: {
        return assign({}, state, {
            result: action.result,
            resultError: null
        });
    }

    case RESET_AREALOCATION: {
        return assign({}, state, {
            result: '',
            resultError: null
        });
    }
    case SELECTED_AREA: {
        return assign({}, state, {
            currentarea: action.currentarea,
        });
    }

    

    default:
        return state;
    }
}

export default arealocation;
