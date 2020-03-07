/*
 * @Author: 史涛 
 * @Date: 2019-01-05 19:30:42 
 * @Last Modified by: 史涛
 * @Last Modified time: 2020-03-02 19:34:24
 */


const { MAP_CONFIG_LOADED,
    MAP_INFO_LOAD_START,
    MAP_INFO_LOADED,
    MAP_INFO_LOAD_ERROR,
    LAYERDEFS_CHANGE,
    LAYERIDS_CHANGE,
    LAYERVISIABLE_CHANGE,
    SWITCHLAYERVISIABLE_CHANGE,
    COMPARELAYER_CHANGE,
    MAP_CONFIG_LOAD_ERROR } = require('../actions/config');

const { isArray } = require('lodash');

const assign = require('object-assign');

function config(state = null, action) {
    let map;
    switch (action.type) {
        case MAP_CONFIG_LOADED:
            let size = state && state.map && state.map.present && state.map.present.size || state && state.map && state.map.size;

            let hasVersion = action.config && action.config.version >= 2;
            // we get from the configuration what will be used as the initial state
            let mapState = action.config.map;
            let newMapState = {
                ...mapState,
                layers: mapState.layers.map(l => {
                    if (l.group === "background" && (l.type === "ol" || l.type === "OpenLayers.Layer")) {
                        l.type = "empty";
                    }
                    return l;
                })
            };
            newMapState.map = assign({}, newMapState.map, newMapState.layers, { mapId: action.mapId, size, version: hasVersion ? action.config.version : 1 });
            // we store the map initial state for future usage
            return assign({}, newMapState, { routingurl: action.config.routingurl, 
                searchurl: action.config.searchurl,
                map3d:action.config.map3d,
                solrurl: action.config.solrurl, 
                compare:action.config.compare, 
                serviceurl: action.config.serviceurl,
                resourceurl: action.config.resourceurl});
        case MAP_CONFIG_LOAD_ERROR:
            return {
                loadingError: { ...action.error, mapId: action.mapId }
            };
        case MAP_INFO_LOAD_START:
            map = state && state.map && state.map.present ? state.map.present : state && state.map;
            if (map && map.mapId === action.mapId) {
                map = assign({}, map, { info: { loading: true } });
                return assign({}, state, { map: map });
            }
            return state;
        case MAP_INFO_LOAD_ERROR: {
            map = state && state.map && state.map.present ? state.map.present : state && state.map;
            if (map && map.mapId === action.mapId) {
                map = assign({}, map, { info: { error: action.error } });
                return assign({}, state, { map: map });
            }
            return state;
        }
        case MAP_INFO_LOADED:
            map = state && state.map && state.map.present ? state.map.present : state && state.map;
            if (map && map.mapId === action.mapId) {
                map = assign({}, map, { info: action.info });
                return assign({}, state, { map: map });
            }
            return state;
        case LAYERDEFS_CHANGE:
            let flatLayers = (state.layers || []);
            let newLayers = flatLayers.map((layer) => {
                if (layer.name === '无锡城管网格') {
                    // TODO remove
                    let defs=action.defs.split(',');
                    let qdefs=defs.map(def => {
                        return "网格类型='"+def+"'"
                    });
                    return assign({}, layer, {layerDefs: { "4": qdefs.join(" or ")}});
                }
                return assign({}, layer);
            });
            return assign({}, state, {layers: newLayers});
        case LAYERVISIABLE_CHANGE:
            flatLayers = (state.layers || []);
            newLayers = flatLayers.map((layer) => {
                if (layer.name===action.layername ) {
                    return assign({}, layer, { visibility: action.visiable });
                }
                return assign({}, layer);
            });
            return assign({}, state, { layers: newLayers});
        case SWITCHLAYERVISIABLE_CHANGE:
                flatLayers = (state.map3d.layers || []);
                newLayers = flatLayers.map((layer) => {
                    if(layer.type=='3dtiles'){
                        if (layer.name===action.layername ) {
                            return assign({}, layer, {options:{...layer.options,visibility: true }});
                        }
                        return assign({}, layer, {options:{...layer.options,visibility: false }});
                    }else{
                        return assign({}, layer);
                    }
                   
                });
                return assign({}, state, { map3d: {...state.map3d,layers:newLayers}});
        
        case COMPARELAYER_CHANGE:
             return assign({}, state, { compare: action.compare });
        case LAYERIDS_CHANGE:
             flatLayers = (state.layers || []);
             newLayers = flatLayers.map((layer) => {
                if (layer.name === action.layername) {
                    return assign({}, layer, {layers: action.layerids,visibility:action.layerids.length>0?true:false});
                }
                return assign({}, layer);
            });
            return assign({}, state, {layers: newLayers});

        default:
            return state;
    }

}

export default config;
