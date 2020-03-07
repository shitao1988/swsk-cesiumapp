/*
 * @Author: 史涛 
 * @Date: 2019-01-05 19:30:01 
 * @Last Modified by: 史涛
 * @Last Modified time: 2019-11-15 16:28:24
 */
const ERRORPANEL_SHOW = 'ERRORPANEL_SHOW';
const ERRORLISTPANEL_SHOW='ERRORLISTPANEL_SHOW';
const STARLISTPANEL_SHOW = 'STARLISTPANEL_SHOW';
const ERRORQUERY_RESULT='ERRORQUERY_RESULT';
const STARQUERY_RESULT='STARQUERY_RESULT';
const ERRORHOVER_RESULTINDEX='ERRORHOVER_RESULTINDEX';
const ADD_ERROR = 'ADD_ERROR';
const RESET_ERRORQUERY='RESET_ERRORQUERY';
const RESET_STARQUERY='RESET_STARQUERY';
const CHANGE_ERROR_LOC='CHANGE_ERROR_LOC';
import { message } from 'antd';
const axios = require('axios');


function showErrorPanel(show) {

    return (dispatch) => {
        dispatch({
            type: ERRORPANEL_SHOW,
            show
        });  
    }
}



function showErrorListPanel(show) {

    return (dispatch) => {
        dispatch({
            type: ERRORLISTPANEL_SHOW,
            show
        });  
    }
}

function showStarListPanel(show) {
    return (dispatch) => {
        dispatch({
            type: STARLISTPANEL_SHOW,
            show
        });
    }
}

function onErrorClick(hoverid) {
    return (dispatch) => {
        dispatch({
            type: ERRORHOVER_RESULTINDEX,
            hoverid
        });
    }

}

function changeErrorLocation(x,y) {
    return {
        type: CHANGE_ERROR_LOC,
        x,
        y
    };
}


function addErrorResponse(errorinfo) {
    return {
        type: ADD_ERROR,
        errorinfo
    };
}

function queryErrorSearchResponse(result) {
    return {
        type: ERRORQUERY_RESULT,
        result
    };
}

function queryStarSearchResponse(result) {
    return {
        type: STARQUERY_RESULT,
        result
    };
}

function onErrorQuery(userid,geokey,page) {
    return (dispatch, getState) => {
        const toolbar=getState().toolbar;

        return axios.get(ServerUrl+"/portal/correction/list", {
            params: {
                key:"",
                type:0,
                state:-1,
                page: page?page:1,
                size: 10,
            },
            headers:{token:geokey}
        }).then((response) => {
            dispatch(queryErrorSearchResponse(response.data.result));
        }).catch((e) => {
            message.warning('数据查询失败,请稍后再试');
            
        });
    };
}

function onStarQuery(userid) {
    return (dispatch, getState) => {
        const toolbar=getState().toolbar;

        return axios.get(ServerUrl+"/portal/service/find", {
            params:{
                userid:userid,
                classify:'',
                catalog:'',
                atlas:'',
                key:'',
                tag:1,
                page:1,
                size:100
            }
            }).then((response) => {
                dispatch(queryStarSearchResponse(response.data.result.list));
    }).catch((e) => {
            message.warning('数据查询失败,请稍后再试');

    });
    };
}

function resetErrorQuery() {
    return {
        type: RESET_ERRORQUERY,
    }
}

function resetStarQuery() {
    return {
        type: RESET_STARQUERY,
    }
}

function onAddError(params) {
    return (dispatch, getState) => {
        const toolbar = getState().toolbar;
        const draw=getState().draw;
        if (draw.drawOwner !=='error') {
            message.warning('未添加坐标点');
            return;
        }
        return axios.post(ServerUrl+"/portal/correction/add", {
            file:[],
            obj:{
                "name": params.name,
                "type": params.type_id,
                "describes": params.describes,
                "x":draw.geometry.coordinates[0][0],
                "y":draw.geometry.coordinates[0][1],
                "new_x":toolbar.error_new_x||draw.geometry.coordinates[0][0],
                "new_y":toolbar.error_new_y||draw.geometry.coordinates[0][1],
                "new_name":params.new_name||"",
                "new_address":params.new_address||"",
                "userid": params.userid,
                "email": params.email,
                "phone": params.phone,
            }
        }).then((response) => {
                if(response.data.code===1){
                    dispatch(showErrorPanel(false));
                    dispatch(addErrorResponse(response.data.msg));
                   
                    message.info('添加成功');
                }else{
                    message.warning('提交数据失败,请稍后再试');
                }
               
        }).catch((e) => {
            message.warning('提交数据失败,请稍后再试');
            //dispatch(queryError(e));
        });
    };
}


export {
    ERRORPANEL_SHOW,
    ERRORLISTPANEL_SHOW,
    STARLISTPANEL_SHOW,
    RESET_ERRORQUERY,
    RESET_STARQUERY,
    resetStarQuery,
    ERRORHOVER_RESULTINDEX,
    CHANGE_ERROR_LOC,
    ERRORQUERY_RESULT,
    STARQUERY_RESULT,
    showErrorListPanel,
    showStarListPanel,
    showErrorPanel,
    changeErrorLocation,
    onErrorQuery,
    onStarQuery,
    resetErrorQuery,
    onErrorClick,
    ADD_ERROR,
    onAddError,
    queryStarSearchResponse
};