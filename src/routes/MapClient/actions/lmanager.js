const CHANGEOPACITY_RES = 'CHANGEOPACITY_RES';
const CHANGEINDEX_RES = 'CHANGEINDEX_RES';
const RESOURCES_RESULT = 'RESOURCES_RESULT';
const RESOURCES_ADD = 'RESOURCES_ADD';
const SHOW_RES = 'SHOW_RES';
const TOGGLE_EXPEND = 'TOGGLE_EXPEND'; 
const CHANGE_VISIBLE = 'CHANGE_VISIBLE';
const CHANGE_KEYWORD = 'CHANGE_KEYWORD';
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

function Toggle_Expend(id){
    return {
        type: TOGGLE_EXPEND,
        id
    }
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
        const dataresP = getState().mapConfig.dataresP;
        const params = {
            userid:-1,
            keyword:"",
            code:dataresP.reCode
        }
        return axios.get(dataresP.url,{
            params: params
        }).then((response) => {
            response.data.result.list.map(item=>{item.expend=false;item.visibility=false;item.key=item.id;item.from='lma';item.url=dataresP.poxip+item.proxy_url});
            dispatch(ResourcesListResponse(response.data.result.list));

        }).catch((e) => {
        });
    };
}

function ChangeVisible(id,visibility){
    return {
        type:CHANGE_VISIBLE,
        id,
        visibility
    }
}

function ResourcesListResponse(resresult) {
    return {
        type: RESOURCES_RESULT,
        resresult
    };
}

function ChangeKeyword(keyword){
    return {
        type:CHANGE_KEYWORD,
        keyword
    }
}


export {
    ChangeIndex_Res,
    ChangeOpacity_Res,
    CHANGEINDEX_RES,
    CHANGEOPACITY_RES,
    RESOURCES_RESULT,
    ShowRes,
    SHOW_RES,
    RESOURCES_ADD,
    LoadResourcesList,
    Toggle_Expend,
    TOGGLE_EXPEND,
    ChangeVisible,
    CHANGE_VISIBLE,
    CHANGE_KEYWORD,
    ChangeKeyword
};