
const Cesium=require("../cesium");
export class GroundLineFlowMaterialProperty {
  constructor(options) {
    options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
        this.color= Cesium.defaultValue(options.color, new Cesium.Color(1, 0, 0, 1)),
        this.image = options.url || options.image,
        this.repeat = Cesium.defaultValue(options.repeat, {
            x: 10,
            y: 1
        }),
        this.axisY = Cesium.defaultValue(options.axisY, !1),
        this.speed = Cesium.defaultValue(options.speed, 1);
  }
}




Cesium.Material.GroundLineFlowMaterialType = "GroundLineFlowMaterial";

Cesium.Material.GroundLineFlowSource = "czm_material czm_getMaterial(czm_materialInput materialInput) \r\n{ \r\n    czm_material material = czm_getDefaultMaterial(materialInput); \r\n    vec2 st = repeat * materialInput.st;\r\n    // vec4 color = texture2D(image, materialInput.st/repeat); \r\n    vec4 colorImage = texture2D(image, vec2(fract((axisY?st.t:st.s) - czm_frameNumber*speed/100.0), st.t));\r\n    if(color.a == 0.0)\r\n    {\r\n        material.alpha = colorImage.a;\r\n        material.diffuse = colorImage.rgb; \r\n    }\r\n    else\r\n    {\r\n        material.alpha = colorImage.a * color.a;\r\n        material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb); \r\n    }\r\n    return material; \r\n}";

Cesium.Material._materialCache.addMaterial(
  Cesium.Material.GroundLineFlowMaterialType,
  {
    fabric: {
      type: Cesium.Material.GroundLineFlowMaterialType,
      uniforms: {
        color: this.color,
        image: this.image,
        repeat: this.repeat,
        axisY: this.axisY,
        speed: this.speed
      },
      source: Cesium.Material.PolylineTrailSource
    },
    translucent: function(material) {
      return !0;
    }
  }
);
