
const Cesium=require("./cesium");

const PropTypes = require("prop-types");
const React = require("react");
const ReactDOM = require("react-dom");
const ClickUtils = require("../../../../utils/cesium/ClickUtils");
import GlobeTracker from './draw/GlobeTracker';
const assign = require("object-assign");
const { throttle } = require("lodash");
import './style.less'; 


class CesiumMap extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    zoom: PropTypes.number.isRequired,
    projection: PropTypes.string,
    onMapViewChanges: PropTypes.func,
    onCreationError: PropTypes.func,
    onClick: PropTypes.func,
    onMouseMove: PropTypes.func,
    mapOptions: PropTypes.object,
    standardWidth: PropTypes.number,
    standardHeight: PropTypes.number,
    mousePointer: PropTypes.string,
    zoomToHeight: PropTypes.number,
    viewerOptions: PropTypes.object
  };

  static defaultProps = {
    id: "map",
    onMapViewChanges: () => {},
    onClick: () => {},
    onCreationError: () => {},
    projection: "EPSG:4490",
    mapOptions: {},
    standardWidth: 512,
    standardHeight: 512,
    zoomToHeight: 80000000,
    viewerOptions: {
      orientation: {
        heading: 0,
        pitch: (-1 * Math.PI) / 2,
        roll: 0
      }
    }
  };

  state = {};

  componentWillMount() {
    document.addEventListener("gesturestart", this.gestureStartListener);
  }

  componentDidMount() {
    var extent = Cesium.Rectangle.fromDegrees(
      -180,
      -90,
      180,
      90
    );

    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;
    Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

    var map = new Cesium.Viewer(
      this.props.id,
      assign(
        {
          baseLayerPicker: false,
          animation: false,
          fullscreenButton: false,
          geocoder: false,
          homeButton: false,
          infoBox: false,
          sceneModePicker: false,
          selectionIndicator: false,
          timeline: false,
          navigationHelpButton: false,
          terrainExaggeration: 20.0,
         
          navigationInstructionsInitiallyVisible: false
        },
        this.getMapOptions(this.props.mapOptions)
      )
    );

    map.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
    map.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.PINCH, Cesium.CameraEventType.RIGHT_DRAG];

    // var r = 0;
    // map.entities.add({
    //   position: new Cesium.Cartesian3.fromDegrees(120.55493325724832,32.3858436),
    //   ellipse: {
    //     semiMinorAxis: 1e3,
    //     semiMajorAxis: 1e3,
    //     material: new CircleScanMaterialProperty({
    //       url: img,
    //       color: Cesium.Color.fromCssColorString("#5fc4ee")
    //     }),
    //     stRotation: new Cesium.CallbackProperty(function() {
    //       return (r -= 0.1);
    //     }, !1),
    //     classificationType: Cesium.ClassificationType.BOTH
    //   }
    // });

    // map.entities.add({
    //           name: "cir",
    //           position: Cesium.Cartesian3.fromDegrees(120.57022413775583,32.3858436, 0 ),
    //           ellipse: {
    //             height: 0,
    //             semiMinorAxis: 500,
    //             semiMajorAxis: 500,
    //             material: new CircleWaveMaterialProperty({
    //               duration: 2e3,
    //               gradient: 0,
    //               color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
    //               count: 3
    //             })
    //           }
    //         });


    map.camera.moveEnd.addEventListener(this.updateMapInfoState);
    this.hand = new Cesium.ScreenSpaceEventHandler(map.scene.canvas);
    this.hand.setInputAction(
      throttle(this.onMouseMove.bind(this), 500),
      Cesium.ScreenSpaceEventType.MOUSE_MOVE
    );

    // var center = Cesium.Cartesian3.fromDegrees(
    //   this.props.center.x,
    //   this.props.center.y,
    //   this.getHeightFromZoom(this.props.zoom)
    // );//camera视野的中心点坐标
    // var heading = Cesium.Math.toRadians(0);
    // var pitch = Cesium.Math.toRadians(this.props.pitch-90);
    // var range = 5000.0;
    // map.camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, range));

    map.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        this.props.center.x,
        this.props.center.y,
        this.getHeightFromZoom(this.props.zoom)
      ),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: (-1 * Math.PI) / 2,
        roll: 0
      }
    });
    // var boundingSphere = new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(119.74511861, 31.770647, 47.99243056), 802.4637017);
    // map.camera.flyToBoundingSphere(boundingSphere, {duration: 0});



    this.setMousePointer(this.props.mousePointer);

    this.map = map;
    if(this.props.draw){
      this.drawControl = new GlobeTracker(map);
    }
    this.forceUpdate();
    if (this.props.mapOptions.navigationTools) {
      this.cesiumNavigation = window.CesiumNavigation;
      if (this.cesiumNavigation) {
        this.cesiumNavigation.navigationInitialization(this.props.id, map);
      }
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.mousePointer !== this.props.mousePointer) {
      this.setMousePointer(newProps.mousePointer);
    }
    if (newProps.mapStateSource !== this.props.id) {
      this._updateMapPositionFromNewProps(newProps);
    }

    if (
      (newProps.draw &&
        this.props.draw.drawStatus !== newProps.draw.drawStatus) ||
      this.props.draw.drawMethod !== newProps.draw.drawMethod ||
      this.props.draw.features !== newProps.draw.features
    ) {
      switch (newProps.draw.drawStatus) {
        case "create":
          break;
        case "start":
          switch (newProps.draw.drawMethod) {
            case "polygon":
              this.drawControl.trackPolygon((positions,lonLats)=>{
                var coords=lonLats.map(lonlat => {
                  return [lonlat.lon,lonlat.lat]
                });
                coords.push([lonLats[0].lon,lonLats[0].lat]);
                var geom = {
                  "type": "Polygon",
                  "coordinates": [coords]
                };
                this.props.drawCreated(geom);

            });
              break;
            case "polyline":
              this.drawControl.trackPolyline( (positions,lonLats)=>{
                var coords=lonLats.map(lonlat => {
                  return [lonlat.lon,lonlat.lat]
                });
               
                var geom = {
                  type: "LineString",
                  coordinates: coords
                };
                this.props.drawCreated(geom);
            });
              break;
            case "point":
              this.drawControl.trackPoint( (position,lonLat)=>{
                var geom = {
                  type: "Point",
                  coordinates: [lonLat.lon, lonLat.lat]
                };
                this.props.drawCreated(geom);
             });
              break;
              case "measure_polyline_3d":
                this.drawControl.pickSpaceDistance(function (position) {
                  // var objId = (new Date()).getTime();
                  // shapeDic[objId] = position;
                  // showPoint(objId, position);
               });
                break
                case "measure_polygon_3d":
                  this.drawControl.pickArea(function (position) {
                    // var objId = (new Date()).getTime();
                    // shapeDic[objId] = position;
                    // showPoint(objId, position);
                 });
                  break;
            default:
              break;
          }
          break;
        case "drawOrEdit":
          break;
        case "stop":
          break;
        case "replace":
          break;
        case "clean":
          //this.drawControl&&this.drawControl.draw.deleteAll();
          this.drawControl.clear();
          break;
        case "endDrawing":
          break;
        default:
          return;
      }
    }

    return false;
  }

  componentWillUnmount() {
    this.hand.destroy();
    // see comment in componentWillMount
    document.removeEventListener("gesturestart", this.gestureStartListener);
    this.map.destroy();
  }

  onClick = (map, movement) => {
    if (this.props.onClick && movement.position !== null) {
      const cartesian = map.camera.pickEllipsoid(
        movement.position,
        map.scene.globe.ellipsoid
      );
      let cartographic =
        ClickUtils.getMouseXYZ(map, movement) ||
        (cartesian && Cesium.Cartographic.fromCartesian(cartesian));
      if (cartographic) {
        const latitude = (cartographic.latitude * 180.0) / Math.PI;
        const longitude = (cartographic.longitude * 180.0) / Math.PI;

        const y =
          ((90.0 - latitude) / 180.0) *
          this.props.standardHeight *
          (this.props.zoom + 1);
        const x =
          ((180.0 + longitude) / 360.0) *
          this.props.standardWidth *
          (this.props.zoom + 1);
        this.props.onClick({
          pixel: {
            x: x,
            y: y
          },
          height:
            this.props.mapOptions && this.props.mapOptions.terrainProvider
              ? cartographic.height
              : undefined,
          cartographic,
          latlng: {
            lat: latitude,
            lng: longitude
          },
          crs: "EPSG:4326"
        });
      }
    }
  };

  onMouseMove = movement => {
    if (this.props.onMouseMove && movement.endPosition) {
      const cartesian = this.map.camera.pickEllipsoid(
        movement.endPosition,
        this.map.scene.globe.ellipsoid
      );
      let cartographic =
        ClickUtils.getMouseXYZ(this.map, movement) ||
        (cartesian && Cesium.Cartographic.fromCartesian(cartesian));
      if (cartographic) {
        const elevation = Math.round(cartographic.height);
        this.props.onMouseMove({
          y: (cartographic.latitude * 180.0) / Math.PI,
          x: (cartographic.longitude * 180.0) / Math.PI,
          z: elevation,
          crs: "EPSG:4326"
        });
      }
    }
  };

  getMapOptions = rawOptions => {
    let overrides = {};
    if (rawOptions.terrainProvider) {
      let { type, ...tpOptions } = rawOptions.terrainProvider;
      switch (type) {
        case "cesium": {
          overrides.terrainProvider = new Cesium.CesiumTerrainProvider(
            tpOptions
          );
          break;
        }
        default:
          break;
      }
    }
    return assign({}, rawOptions, overrides);
  };

  getCenter = () => {
    // var windowPosition = new Cesium.Cartesian2(this.map.container.clientWidth / 2, this.map.container.clientHeight / 2);
    // var pickRay = this.map.scene.camera.getPickRay(windowPosition);
    // var pickPosition = this.map.scene.globe.pick(pickRay, this.map.scene);
    // var center = this.map.scene.globe.ellipsoid.cartesianToCartographic(pickPosition);
    const center = this.map.camera.positionCartographic;
    return {
      longitude: (center.longitude * 180) / Math.PI,
      latitude: (center.latitude * 180) / Math.PI,
      height: center.height
    };
  };

  getZoomFromHeight = height => {
    return Math.log2(this.props.zoomToHeight / height) + 1;
  };

  getHeightFromZoom = zoom => {
    return this.props.zoomToHeight / Math.pow(2, zoom - 1);
  };

  render() {
    const map = this.map;
    const mapProj = this.props.projection;
    const children = map
      ? React.Children.map(this.props.children, child => {
          return child
            ? React.cloneElement(child, {
                map: map,
                projection: mapProj,
                onCreationError: this.props.onCreationError
              })
            : null;
        })
      : null;
    return <div id={this.props.id}>{children}</div>;
  }

  gestureStartListener = e => {
    e.preventDefault();
  };

  setMousePointer = pointer => {
    if (this.map) {
      const mapDiv = ReactDOM.findDOMNode(this).getElementsByClassName(
        "cesium-viewer"
      )[0];
      mapDiv.style.cursor = pointer || "auto";
    }
  };

  _updateMapPositionFromNewProps = newProps => {
    // Do the change at the same time, to avoid glitches
    const currentCenter = this.getCenter();
    const currentZoom = this.getZoomFromHeight(currentCenter.height);
    // current implementation will update the map only if the movement
    // between 12 decimals in the reference system to avoid rounded value
    // changes due to float mathematic operations.
    const isNearlyEqual = function(a, b) {
      if (a === undefined || b === undefined) {
        return false;
      }
      // avoid errors like 44.40641479 !== 44.40641478999999
      return a.toFixed(12) - b.toFixed(12) <= 0.000000000001;
    };
    const centerIsUpdate =
      !isNearlyEqual(newProps.center.x, currentCenter.longitude) ||
      !isNearlyEqual(newProps.center.y, currentCenter.latitude);
    const zoomChanged = newProps.zoom !== currentZoom;

    // Do the change at the same time, to avoid glitches
    if (centerIsUpdate || zoomChanged) {
      const position = {
        destination: Cesium.Cartesian3.fromDegrees(
          newProps.center.x,
          newProps.center.y,
          this.getHeightFromZoom(newProps.zoom)
        ),
        orientation: newProps.viewerOptions.orientation
      };
      this.setView(position);
    }
  };

  setView = position => {
    if (this.props.mapOptions && this.props.mapOptions.flyTo) {
      this.map.camera.flyTo(
        position,
        this.props.mapOptions.defaultFlightOptions
      );
    } else {
      this.map.camera.setView(position);
    }
  };

  updateMapInfoState = () => {
    const center = this.getCenter();
    const zoom = this.getZoomFromHeight(center.height);
    const size = {
      height: Math.round(this.props.standardWidth * (zoom + 1)),
      width: Math.round(this.props.standardHeight * (zoom + 1))
    };
    this.props.onMapViewChanges(
      center.latitude,
      center.longitude,
      zoom,
      this.props.maxZoom,
      this.props.minZoom,
      this.map.camera.roll,
      Cesium.Math.toDegrees(this.map.camera.pitch)+90,
      this.map.camera.heading,
    );
  };
}

module.exports = CesiumMap;
