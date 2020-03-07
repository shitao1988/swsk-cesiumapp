const Layers = require("../../../../../utils/cesium/Layers");
const Cesium = require("../cesium");
const assign = require("object-assign");
const { isEqual } = require("lodash");

Layers.registerType("geojson", {
  create: (options, map) => {
    const style = assign(
      {},
      {
        stroke: Cesium.Color.HOTPINK,
        fill: Cesium.Color.PINK.withAlpha(0.5),
        strokeWidth: 3
      },
      options.style
    );
    let curdataSource;
    Cesium.GeoJsonDataSource.load(options.data, style).then(function(
      dataSource
    ) {
      map.dataSources.add(dataSource);
      curdataSource = dataSource;
    });
    if (options.zoomTo) {
      map.zoomTo(dataSource);
    }

    return {
      detached: true,
      dataSource: curdataSource,
      remove: () => {
        map.dataSources.remove(curdataSource, true);
      }
    };
  },
  update: function(layer, newOptions, oldOptions, map) {
    if (!isEqual(newOptions.data, oldOptions.data)) {
      layer.remove();
      return this.create(newOptions, map);
    }
    return null;
  }
});
