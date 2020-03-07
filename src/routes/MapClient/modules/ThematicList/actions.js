
const THEMATIC_RESULT = 'THEMATIC_RESULT';
const SHOW_THEMATICLAYER='SHOW_THEMATICLAYER';
const SHOW_SPATIALQUERY='SHOW_SPATIALQUERY';
const QUERY_THEMATICRESULT='QUERY_THEMATICRESULT';
const SET_SELECTEDFEATURE='SET_SELECTEDFEATURE';
const SET_SELECTEDQUERYLAYER='SET_SELECTEDQUERYLAYER';
const SET_BUFFERDISTANCE='SET_BUFFERDISTANCE';
import axios from 'axios';


function loadThematicsList(result) {
    return {
        type: THEMATIC_RESULT,
        result
    };
}

function showSpatialQuery(show) {
    return {
        type:SHOW_SPATIALQUERY,
        show
    }
}

function showThematicLayer(id) {
    return {
        type: SHOW_THEMATICLAYER,
        id
    };
}

function setSelectedFeature(fea) {
    return {
        type: SET_SELECTEDFEATURE,
        fea
    };
}

function setBufferDistance(bufferdistance) {
    return {
        type: SET_BUFFERDISTANCE,
        bufferdistance
    };
}

function setSelectedQueryLayer(id) {
    return {
        type: SET_SELECTEDQUERYLAYER,
        id
    };
}

function queryThematicResponces(response,geometry) {
    return {
        type: QUERY_THEMATICRESULT,
        response,
        geometry
    };
}

function queryThematic(url,layerid,geometry,geometryType,where) {
    return (dispatch, getState) => {
        const thematics = getState().thematics;
        return axios.get(url+'/'+layerid+'/query', {
            params: {
                "returnGeometry": true,
                "where": where||"1=1",
                "outSr": 4326,
                "outFields": "*",
                "inSr": 4326,
                "geometry": geometry||"",
                "geometryType": geometryType||"",
                "spatialRel": "esriSpatialRelIntersects",
                "f": "json"
            }
            
        }).then((response) => {
            dispatch(queryThematicResponces(response.data,geometry))
        }).catch((e) => {
           // message.warning('数据查询失败,请稍后再试');
           // dispatch(queryError(e));
        });
        
    };
}


export {
    loadThematicsList,
    setSelectedFeature,
    SET_SELECTEDFEATURE,
    THEMATIC_RESULT,
    SHOW_THEMATICLAYER,
    showThematicLayer,
    setBufferDistance,
    SET_BUFFERDISTANCE,
    setSelectedQueryLayer,
    SET_SELECTEDQUERYLAYER,
    SHOW_SPATIALQUERY,
    showSpatialQuery,
    queryThematic,
    QUERY_THEMATICRESULT,
    queryThematicResponces
};