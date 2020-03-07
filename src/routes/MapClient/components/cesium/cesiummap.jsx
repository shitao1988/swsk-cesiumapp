const PropTypes = require("prop-types");
const React = require("react");
const CMap = require("./Map");
const CLayer = require("./Layer");
const Cesium = require("./cesium");

import {
  geojsonToArcGIS,arcgisToGeoJSON
} from "@esri/arcgis-to-geojson-utils";
import turfcentroid from "@turf/centroid";
import { connect } from "react-redux";
import {
  queryThematic,
  setSelectedFeature,
  queryThematicResponces
} from "../../modules/ThematicList/actions";
require("./plugins/WMSLayer");
require("./plugins/ArcgisMapServerLayer");
require("./plugins/WMTSLayer");
require("./plugins/Cesium3DTilesetLayer");
require("./plugins/MarkerLayer");
require("./plugins/GeoJsonLayer");
require("./plugins/OverlayLayer")


import { changeMap3DView } from "../MapBoxGL/actions";

class CesiumMapApp extends React.Component {
  static propTypes = {
    // redux store slice with map configuration (bound through connect to store at the end of the file)
    map: PropTypes.object,
    layers: PropTypes.array,
    mapOptions: PropTypes.object,
    // redux store dispatch func
    dispatch: PropTypes.func,
    textSearch: PropTypes.func,
    searchTextChanged: PropTypes.func,
    resultsPurge: PropTypes.func,
    changeMapView: PropTypes.func,
    changeMousePosition: PropTypes.func,
    toggleGraticule: PropTypes.func,
    updateMarker: PropTypes.func,
    mousePosition: PropTypes.object,
    messages: PropTypes.object,
    locale: PropTypes.string,
    localeError: PropTypes.string,
    searchResults: PropTypes.array,
    mapStateSource: PropTypes.string,
    showGraticule: PropTypes.bool,
    marker: PropTypes.object,
    searchText: PropTypes.string
  };

  state = {
    map: {
      projection: "EPSG:4326",
      center: { x: 120.56, y: 32.1, crs: "EPSG:4326" },
      zoom: 19,
      layers: [
        {
          type: "3dtiles",
          name: "",
          options: {
            type: "3dtiles",
            visibility: true,
            url: "http://geowork.wicp.vip:25081/cesiumdata/tileset.json"
          }
        },
        {
          type: "wmts",
          name: "",
          options: {
            type: "wmts",
            visibility: true,
            name: "cia",
            layer: "cia",
            tk: "7928d8a53076431e739c24262a0a5828",
            format: "tiles",
            style: "default",
            tileMatrixSet: "w",
            url: "http://t0.tianditu.gov.cn/cia_w/wmts"
          }
        }
      ]
    }
  };

  static defaultProps = {
    mapOptions: {}
  };

  onSearchClick = (center, option) => {
    this.props.updateMarker(center, option);
  };

  getMarkerPoint = () => {
    let feature = this.props.marker;
    if (feature.type === "Feature") {
      feature = pointOnSurface(feature);
    } else if (feature.lng !== undefined && feature.lat !== undefined) {
      return feature;
    }
    return {
      lat: feature.geometry && feature.geometry.coordinates[1],
      lng: feature.geometry && feature.geometry.coordinates[0]
    };
  };

  renderThematicLayers = () => {
    if (this.props.thematics) {
      return this.props.thematics.themlist.map(function(layer) {
        let options;
        switch (layer.serviceType) {
          case "wms":
            options = {
              type: "wms",
              visibility: layer.visibility ? true : false,
              name: "0",
              style: "default",
              format: "image/png",
              url: ServerIp + layer.proxy_url
            };
            break;
          case "wmts":
            options = {
              visibility: layer.visibility ? true : false,
              url: ServerIp + layer.proxy_url
            };
            break;
          case "map":
            options = {
              visibility: layer.visibility ? true : false,
              url: ServerIp + layer.proxy_url
            };
            break;
          default:
            break;
        }

        return (
          <CLayer type={layer.serviceType} key={layer.name} options={options} />
        );
      });
    }
    return null;
  };

  /**
   *渲染专题数据气泡框
   *
   * @returns
   * @memberof MapBoxMap
   */
   renderThematicPopup() {
    const { selectedfeature } = this.props.thematics;
    let options;
    if(selectedfeature){
      const point =turfcentroid(selectedfeature).geometry.coordinates;
      let element = document.createElement("div");
      element.id = "popup-thematic";
      document.body.appendChild(element);
  
      options = {
        id: "popup-thematic",
        position: {x:point[0],y:point[1]},
        content:`<div class="content">
        ${this.renderThematicContent(
          selectedfeature.attributes || selectedfeature.properties
        )}
      </div>`
      };
    }
   

    return (
      selectedfeature && (
        <CLayer type="overlay" key="spatialqueryoverlay" options={options} />
      )
    );
  }

  /**
   *渲染专题要素信息
   *
   * @param {*} feas
   * @returns
   * @memberof MapBoxMap
   */
  renderThematicContent(feas) {
    let list = [];
    for (const key in feas) {
      list.push(
        `<p>
          ${key}: ${feas[key] ? feas[key] : "空"}
        </p>`
      );
    }
    return list.join('');
  }

  renderMarkerLayers = () => {
    if (this.props.query.result) {
      var pinBuilder = new Cesium.PinBuilder();
      return this.props.query.result.docs.map((marker, index) => {
        let options = {
          point: { lng: marker.x, lat: marker.y },
          style: {
            billboard: {
              image: pinBuilder
                .fromText(index + 1, Cesium.Color.RED, 32)
                .toDataURL(),
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            }
          }
        };
        return <CLayer type="marker" key={marker.id} options={options} />;
      });
    }
    return null;
  };
  renderGeoJsonLayer = () => {
    const { themresult, querygeometry } = this.props.thematics;
    if (themresult && querygeometry) {
      let jsonfeas = [];
      themresult.features.forEach(fea => {
        jsonfeas.push(arcgisToGeoJSON(fea));
      });

      let data = {
        type: "FeatureCollection",
        features: jsonfeas
      };
      return (
        <CLayer
          type={"geojson"}
          key={"spatialqueryhighlight"}
          options={{ data: data }}
        />
      );
    }
    return null;
  };
  renderLayers = layers => {
    if (layers) {
      return layers
        .map(layer => {
          return (
            <CLayer
              type={layer.type}
              key={layer.name}
              options={layer.options}
            />
          );
        })
        .concat(this.renderThematicLayers())
        .concat(this.renderGeoJsonLayer())
        .concat(this.renderThematicPopup())
        .concat(this.renderMarkerLayers());
    }
    return null;
  };

  drawCreated = geo => {
    const arcgisgeo = geojsonToArcGIS(geo);
    const selectedThematic = this.props.thematics.themlist.filter(
      e => e.visibility
    );
    switch (geo.type) {
      case "Point":
        this.props.queryThematic(
          selectedThematic[0].id,
          JSON.stringify(arcgisgeo),
          "esriGeometryPoint"
        );
        break;
      case "Polygon":
        this.props.queryThematic(
          selectedThematic[0].id,
          JSON.stringify(arcgisgeo),
          "esriGeometryPolygon"
        );
        break;
      case "LineString":
        this.props.queryThematic(
          selectedThematic[0].id,
          JSON.stringify(arcgisgeo),
          "esriGeometryPolyline"
        );
        break;
      default:
        break;
    }
  };

  componentDidMount() {
    var that = this;
    const ele = document.getElementById("loading");
    ele.style.display = "none";
  }

  render() {
    // const mapOptions={
    //   imageryProvider: new Cesium.MapboxImageryProvider({
    //     mapId: 'mapbox.dark',
    //     accessToken: 'pk.eyJ1Ijoic2hpdGFvMTk4OCIsImEiOiJjaWc3eDJ2eHowMjA5dGpsdzZlcG5uNWQ5In0.nQQjb4DrqnZtY68rOQIjJA'
    //   })
    // }

    const mapOptions = {
      imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        //url:"http://192.168.3.5:9000/gateway/wmts/tdt_img_w",
        url: this.props.mapConfig.map3d.imageryProviderUrl || "",
        layer: "img",
        style: "default",
        format: "tiles",
        maximumLevel: 18,
        tileMatrixSetID: "tdtimgw",
        show: true
      })
    };
    // wait for loaded configuration before rendering
    if (this.state.map && this.props.mapConfig) {
      return (
        <CMap
          id="cesiummap"
          onMapViewChanges={this.props.changeMap3DView}
          heading={this.props.map3d.heading}
          pitch={this.props.map3d.pitch}
          center={{
            x: this.props.map3d.longitude,
            y: this.props.map3d.latitude,
            crs: "EPSG:4326"
          }}
          draw={this.props.draw}
          drawCreated={this.drawCreated}
          zoom={this.props.map3d.zoom}
          mapOptions={mapOptions}
        >
          {this.renderLayers(this.props.mapConfig.map3d.layers)}
        </CMap>
      );
    }
    return null;
  }
}

export default connect(
  state => {
    return {
      map3d: state.map3d,
      thematics: state.thematics,
      mapConfig: state.mapConfig,
      query: state.query,
      draw:state.draw
    };
  },
  {
    changeMap3DView,
    queryThematic
  }
)(CesiumMapApp);
