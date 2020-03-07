const AREALOCATION_RESULT = 'AREALOCATION_RESULT';
const RESET_AREALOCATION = 'RESET_AREALOCATION';
const SELECTED_AREA = 'SELECTED_AREA';

function setAreaLocation(result) {
    return {
        type: AREALOCATION_RESULT,
        result
    };
}

function selectAreaLocation(currentarea) {
    return {
        type: SELECTED_AREA,
        currentarea
    };
}

function resetAreaLocation() {
    return {
        type: RESET_AREALOCATION
    };
}

export {
    AREALOCATION_RESULT,
    SELECTED_AREA,
    setAreaLocation,
    selectAreaLocation,
    resetAreaLocation
};