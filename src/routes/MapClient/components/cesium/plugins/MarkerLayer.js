var Layers = require("../../../../../utils/cesium/Layers");
var Cesium = require("../cesium");
import { CircleWaveMaterialProperty } from "./CircleWaveMaterial";
import { CircleScanMaterialProperty } from "./CircleScanMaterial";
import img from "./circleScan.png";

const { isEqual } = require("lodash");
const assign = require("object-assign");

Layers.registerType("marker", {
  create: (options, map) => {
    var pinBuilder = new Cesium.PinBuilder();
    const style = assign(
      {},
      {
        billboard: {
          image: pinBuilder.fromColor(Cesium.Color.ROYALBLUE, 48).toDataURL(),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        }
      },
      options.style
    );
    const point = map.entities.add(
      assign(
        {
          position: Cesium.Cartesian3.fromDegrees(
            options.point.lng,
            options.point.lat
          )
        },
        style
      )
    );
    return {
      detached: true,
      point: point,
      remove: () => {
        map.entities.remove(point);
      }
    };
  },
  update: function(layer, newOptions, oldOptions, map) {
    if (!isEqual(newOptions.point, oldOptions.point)) {
      layer.remove();
      return this.create(newOptions, map);
    }
    return null;
  }
});

Layers.registerType("models-glb", {
  create: (options, map) => {
    const point = map.entities.add(
      assign({
        position: Cesium.Cartesian3.fromDegrees(
          options.point.lng,
          options.point.lat,
          options.point.height
        ),
        orientation: Cesium.Transforms.headingPitchRollQuaternion(
          Cesium.Cartesian3.fromDegrees(options.point.lng,  options.point.lat, options.point.height*3),
          new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), 0, 0)
        ),
        model: {
          uri: options.uri,
          minimumPixelSize: 128,
          maximumScale: 20000
        }
      })
    );
    return {
      detached: true,
      point: point,
      remove: () => {
        map.entities.remove(point);
      }
    };
  },
  update: function(layer, newOptions, oldOptions, map) {
    if (!isEqual(newOptions.point, oldOptions.point)) {
      layer.remove();
      return this.create(newOptions, map);
    }
    return null;
  }
});

Layers.registerType("scanmarker", {
  create: (options, map) => {
    let r = 0;
    const style = assign(
      {},
      {
        ellipse: {
          semiMinorAxis: 1e3,
          semiMajorAxis: 1e3,
          material: new CircleScanMaterialProperty({
            url: img,
            color: Cesium.Color.fromCssColorString("#5fc4ee")
          }),
          stRotation: new Cesium.CallbackProperty(function() {
            return (r -= 0.1);
          }, !1),
          classificationType: Cesium.ClassificationType.BOTH
        }
      },
      options.style
    );
    const point = map.entities.add(
      assign(
        {
          position: Cesium.Cartesian3.fromDegrees(
            options.point.lng,
            options.point.lat
          )
        },
        style
      )
    );
    return {
      detached: true,
      point: point,
      remove: () => {
        map.entities.remove(point);
      }
    };
  },
  update: function(layer, newOptions, oldOptions, map) {
    if (!isEqual(newOptions.point, oldOptions.point)) {
      layer.remove();
      return this.create(newOptions, map);
    }
    return null;
  }
});

Layers.registerType("wavemarker", {
  create: (options, map) => {
    const style = assign(
      {},
      {
        ellipse: {
          height: 0,
          semiMinorAxis: 500,
          semiMajorAxis: 500,
          material: new CircleWaveMaterialProperty({
            duration: 2e3,
            gradient: 0,
            color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
            count: 3
          })
        }
      },
      options.style
    );
    const point = map.entities.add(
      assign(
        {
          position: Cesium.Cartesian3.fromDegrees(
            options.point.lng,
            options.point.lat
          )
        },
        style
      )
    );
    return {
      detached: true,
      point: point,
      remove: () => {
        map.entities.remove(point);
      }
    };
  },
  update: function(layer, newOptions, oldOptions, map) {
    if (!isEqual(newOptions.point, oldOptions.point)) {
      layer.remove();
      return this.create(newOptions, map);
    }
    return null;
  }
});
