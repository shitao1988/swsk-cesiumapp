const LOAD_STATISTICDATA='LOAD_STATISTICDATA';
import axios from 'axios';


function loadStatisticData(result) {
    return {
        type: LOAD_STATISTICDATA,
        result
    };
}

export {
    loadStatisticData,
    LOAD_STATISTICDATA
};
