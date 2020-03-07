
const {
    SIDEBAR_SHOW

} = require('./actions');

const assign = require('object-assign');


const initialState = {
    show: false,
    module: '1'
};

function sidebar(state = initialState, action) {
    switch (action.type) {

        case SIDEBAR_SHOW: {
            return assign({}, state, {
                show: action.show,
                module:action.module
            });
        }

      
        default:
            return state;
    }
}

export default sidebar;
