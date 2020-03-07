/*
 * @Author: your name
 * @Date: 2020-01-15 15:07:07
 * @LastEditTime : 2020-01-16 23:49:25
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \portal\src\routes\MapClient\components\cesium\plugins\Cesium3DTilesetLayer.js
 */
var Layers = require("../../../../../utils/cesium/Layers");
var Cesium = require("../cesium");
const assign = require('object-assign');


Layers.registerType("3dtiles", {
  create: (options, map) => {
    var translation=Cesium.Cartesian3.fromArray([-80, -105, -25]);
    var modelmatrix= Cesium.Matrix4.fromTranslation(translation);

    const tileoptions = assign({}, {maximumScreenSpaceError: 2,
        maximumMemoryUsage: 4096,
        cullWithChildrenBounds: false,
        luminanceAtZenith: 0.6,
        skipLevels:15}, options);
    var tileset = new Cesium.Cesium3DTileset(tileoptions);
    tileset.style=new Cesium.Cesium3DTileStyle({
      color: { conditions: [["true", "rgb(3, 104, 255)"]] }
    })
    let tilesetinfo;
    tileset.readyPromise
      .then(function(data) {
        tilesetinfo = map.scene.primitives.add(data);
        //map.scene.primitives.add(data);
        // var boundingSphere = tileset.boundingSphere;
        // var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
        // var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
        // var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, -22);
        // var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
        // tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
        map.zoomTo(tileset, new Cesium.HeadingPitchRange(0.5, -0.4, tileset.boundingSphere.radius * 4.0));
      })
      .otherwise(function(error) {
        console.log(error);
      });
     

    return {
      detached: true,
      tilesetinfo: tilesetinfo,
      remove: () => {
       map.scene.primitives.remove(tilesetinfo);
      }
    };
  }
});
