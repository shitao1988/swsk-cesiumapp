const SIDEBAR_SHOW = 'SIDEBAR_SHOW';


const axios = require('axios');

function showSidebar(show,module) {
    return {
        type: SIDEBAR_SHOW,
        show,
        module
    };
}


export {
    SIDEBAR_SHOW,   
    showSidebar,
};