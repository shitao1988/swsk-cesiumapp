//import {Cesium} from "../cesium";
const Cesium=require("../cesium");
export class CircleScanMaterialProperty {
  constructor(options) {
    options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
    this._definitionChanged = new Cesium.Event();
    this._color = Cesium.defaultValue(options.color, new Cesium.Color(1.0, 0.0, 0.0, 1.0));
    this._colorSubscription = undefined;
    this._scanImg = Cesium.defaultValue(options.url)

  }
}
Cesium.defineProperties(CircleScanMaterialProperty.prototype, {
  isConstant: {
    get: function() {
      return false;
    }
  },
  definitionChanged: {
    get: function() {
      return this._definitionChanged;
    }
  },

  color: Cesium.createPropertyDescriptor("color")
});

CircleScanMaterialProperty.prototype.getType = function(time) {
  return Cesium.Material.CircleScanMaterialType;
};

CircleScanMaterialProperty.prototype.getValue = function(time, result) {
  if (!Cesium.defined(result)) {
    result = {};
  }

  result.color = this._color;
  result.scanImg = this._scanImg;

  return result;
};

CircleScanMaterialProperty.prototype.equals = function(other) {
  return (
    this === other ||
    (other instanceof CircleScanMaterialProperty &&
      Cesium.Property.equals(this._color, other._color))
  );
};

Cesium.Material.CircleScanMaterialType = "CircleScanMaterial";

Cesium.Material.ImageScanSource = "czm_material czm_getMaterial(czm_materialInput materialInput)\r\n{\r\n    czm_material material = czm_getDefaultMaterial(materialInput);\r\n    vec2 st = materialInput.st;\r\n    vec4 imgC = texture2D(scanImg,st);\r\n    if(imgC.a>.0){\r\n        material.diffuse = color.rgb;\r\n    }\r\n    material.alpha = imgC.a;\r\n    return material;\r\n}";

Cesium.Material._materialCache.addMaterial(
  Cesium.Material.CircleScanMaterialType,
  {
    fabric: {
      type: Cesium.Material.CircleScanMaterialType,
      uniforms: {
        color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
        scanImg: ""
      },
      source: Cesium.Material.ImageScanSource
    },
    translucent: function(material) {
      return !0;
    }
  }
);
