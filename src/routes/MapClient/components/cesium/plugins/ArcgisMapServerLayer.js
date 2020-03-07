import Layers from '../../../../../utils/cesium/Layers';
const Cesium = require('../cesium');



const createLayer = options => {
    let layer;
    try {
        layer = new Cesium.ArcGisMapServerImageryProvider(options);
    } catch (error) {
        console.error(error);
    }
    return layer;
};

const updateLayer = (layer, newOptions, oldOptions) => {
    if (newOptions.securityToken !== oldOptions.securityToken
    || oldOptions.format !== newOptions.format) {
        return createLayer(newOptions);
    }
    return null;
};

Layers.registerType('map', {create: createLayer, update: updateLayer});
