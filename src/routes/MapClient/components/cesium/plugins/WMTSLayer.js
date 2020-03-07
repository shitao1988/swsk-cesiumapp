import Layers from '../../../../../utils/cesium/Layers';
// import ConfigUtils from '../../../../utils/ConfigUtils';
// import ProxyUtils from '../../../../utils/ProxyUtils';
import WMTSUtils from '../../../../../utils/WMTSUtils';
const Cesium = require('../cesium');
import { getAuthenticationParam, getURLs } from '../../../../../utils/LayersUtils';
import assign from 'object-assign';
import { isObject, isArray, slice, get, head} from 'lodash';
import urlParser from 'url';
//import { isVectorFormat } from '../../../../utils/VectorTileUtils';

function splitUrl(originalUrl) {
    let url = originalUrl;
    let queryString = "";
    if (originalUrl.indexOf('?') !== -1) {
        url = originalUrl.substring(0, originalUrl.indexOf('?') + 1);
        if (originalUrl.indexOf('%') !== -1) {
            url = decodeURIComponent(url);
        }
        queryString = originalUrl.substring(originalUrl.indexOf('?') + 1);
    }
    return {url, queryString};
}


// function WMTSProxy(proxy) {
//     this.proxy = proxy;
// }

const isValidTile = (tileMatrixSet) => (x, y, level) =>
    tileMatrixSet && tileMatrixSet[level] && !tileMatrixSet[level].ranges ||
    (x <= parseInt(get(tileMatrixSet[level], "ranges.cols.max"), 10) &&
    x >= parseInt(get(tileMatrixSet[level], "ranges.cols.min"), 10) &&
    y <= parseInt(get(tileMatrixSet[level], "ranges.rows.max"), 10) &&
    y >= parseInt(get(tileMatrixSet[level], "ranges.rows.min"), 10));


// WMTSProxy.prototype.getURL = function(resource) {
//     let {url, queryString} = splitUrl(resource);
//     return ProxyUtils.getProxyUrl() + encodeURIComponent(url + queryString);
// };

function NoProxy() {
}

NoProxy.prototype.getURL = function(resource) {
    let {url, queryString} = splitUrl(resource);
    return url + queryString;
};
function getMatrixIds(matrix = [], setId) {
    return ((isObject(matrix) && matrix[setId]) || isArray(matrix) && matrix || []).map((el) => el.identifier);
}

function getDefaultMatrixId(options) {
    let matrixIds = new Array(30);
    for (let z = 0; z < 30; ++z) {
        // generate matrixIds arrays for this WMTS
        matrixIds[z] = options.tileMatrixPrefix + z;
    }
    return matrixIds;
}

const limitMatrix = (matrix, len) => {
    if (matrix.length > len) {
        return slice(matrix, 0, len);
    }
    if (matrix.length < len) {
        return matrix.concat(new Array(len - matrix.length));
    }
    return matrix;
};

const getTilingSchema = (srs) => {
    if (srs.indexOf("EPSG:4326") >= 0) {
        return new Cesium.GeographicTilingScheme();
    } else if (srs.indexOf("EPSG:3857") >= 0) {
        return new Cesium.WebMercatorTilingScheme();
    }
    return null;
};

const getMatrixOptions = (options, srs) => {
    const tileMatrixSet = WMTSUtils.getTileMatrixSet(options.tileMatrixSet, srs, options.allowedSRS, options.matrixIds);
    const matrixIds = limitMatrix(options.matrixIds && getMatrixIds(options.matrixIds, tileMatrixSet) || getDefaultMatrixId(options));
    return {tileMatrixSet, matrixIds};
};

function getQueryString(parameters) {
    return Object.keys(parameters).map((key) => key + '=' + encodeURIComponent(parameters[key])).join('&');
}

function wmtsToCesiumOptions(options) {
    let srs = 'EPSG:4326';
    let { tileMatrixSet: tileMatrixSetID, matrixIds} = getMatrixOptions(options, srs);
    if (matrixIds.length === 0) {
        srs = 'EPSG:3857';
        const matrixOptions = getMatrixOptions(options, srs);
        tileMatrixSetID = matrixOptions.tileMatrixSet;
        matrixIds = matrixOptions.matrixIds;
    }
    // NOTE: can we use opacity to manage visibility?
    // var opacity = options.opacity !== undefined ? options.opacity : 1;
    // let proxyUrl = ConfigUtils.getProxyUrl({});
    // let proxy;
    // if (proxyUrl) {
    //     proxy = ProxyUtils.needProxy(options.url) && proxyUrl;
    // }
    //const isValid = isValidTile(options.matrixIds && options.matrixIds[tileMatrixSetID]);
    const queryParametersString = urlParser.format({ query: {...getAuthenticationParam(options)}});

    return assign({
        // TODO: multi-domain support, if use {s} switches to RESTFul mode
        url: head(getURLs(isArray(options.url) ? options.url : [options.url], queryParametersString)),
        // set image format to png if vector to avoid errors while switching between map type
        format: options.format||'image/png',
        layer: options.layer||0,
        style: options.style || "",
        tk:options.tk||"",
                //tileMatrixLabels: matrixIds,
        //tilingScheme: getTilingSchema(srs, options.matrixIds[tileMatrixSetID]),
        //proxy: proxy && new WMTSProxy(proxy) || new NoProxy(),
        enablePickFeatures: false,
        tileWidth: options.tileWidth || options.tileSize || 256,
        tileHeight: options.tileHeight || options.tileSize || 256,
        tileMatrixSetID: tileMatrixSetID,
        maximumLevel: 30,
        parameters: {...options}
    });
}

const createLayer = options => {
    let layer=null;
    const cesiumOptions = wmtsToCesiumOptions(options);
    // const cesiumOptions={
    //     url: "http://t0.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=7928d8a53076431e739c24262a0a5828",
    //     layer: "tdtVecBasicLayer",
    //     style: "default",
    //     format: "image/png",
    //     tk:'7928d8a53076431e739c24262a0a5828',
    //     maximumLevel: 18,
    //     tileMatrixSetID: "tdtimgw",
    //     show: true
    //   }
    try {
        layer = new Cesium.WebMapTileServiceImageryProvider(cesiumOptions);
    } catch (error) {
        console.error(error);
    }
    
    // const orig = layer.requestImage;
    // layer.requestImage = (x, y, level) => cesiumOptions.isValid(x, y, level) ? orig.bind(layer)( x, y, level) : new Promise( () => undefined);
    // layer.updateParams = (params) => {
    //     const newOptions = assign({}, options, {
    //         params: assign({}, options.params || {}, params)
    //     });
    //     return createLayer(newOptions);
    // };
    return layer;
};

const updateLayer = (layer, newOptions, oldOptions) => {
    if (newOptions.securityToken !== oldOptions.securityToken
    || oldOptions.format !== newOptions.format) {
        return createLayer(newOptions);
    }
    return null;
};

Layers.registerType('wmts', {create: createLayer, update: updateLayer});
