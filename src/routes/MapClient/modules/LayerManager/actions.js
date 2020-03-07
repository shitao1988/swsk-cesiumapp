const CHANGEOPACITY_RES = 'CHANGEOPACITY_RES';
const CHANGEINDEX_RES = 'CHANGEINDEX_RES';
const RESOURCES_RESULT = 'RESOURCES_RESULT';
const RESOURCES_ADD = 'RESOURCES_ADD';
const SHOW_RES = 'SHOW_RES';
const axios = require('axios');

function ShowRes(id) {
    return {
        type: SHOW_RES,
        id
    };
}

function ChangeIndex_Res(id, layerindex) {
    return {
        type: CHANGEINDEX_RES,
        id,
        layerindex
    };
}

function ChangeOpacity_Res(id, opacity) {
    return {
        type: CHANGEOPACITY_RES,
        id,
        opacity
    };
}

function LoadResourcesList() {

    return (dispatch, getState) => {
        return axios.get('resources.json').then((response) => {
            dispatch(ResourcesListResponse(response.data));

        }).catch((e) => {
        });
    };
}

function addResources(data) {
    return {
        type: RESOURCES_ADD,
        data
    };
}

function ResourcesListResponse(resresult) {
    return {
        type: RESOURCES_RESULT,
        resresult
    };
}


export {
    ChangeIndex_Res,
    ChangeOpacity_Res,
    CHANGEINDEX_RES,
    CHANGEOPACITY_RES,
    ResourcesListResponse,
    RESOURCES_RESULT,
    ShowRes,
    SHOW_RES,
    addResources,
    RESOURCES_ADD,
    LoadResourcesList
};