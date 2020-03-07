

import { connect } from 'react-redux';
import mapApp from '../components/mapApp';
import { changeMapView,mouseDownOnMap,zoomToPoint} from '../actions/map';
import {zoomToPoint3D,loadStyle,changStyle,updateSource} from '../components/MapBoxGL/actions';
import {endDrawing} from '../actions/draw';
import { switchLayers }  from '../actions/layers';
import {resetQuery}  from '../actions/query';
import {configureMap} from '../actions/config';

export default connect((state) => {
  return {
    mapConfig: state.mapConfig,
    map: state.map || state.mapConfig && state.mapConfig.map,
    mapStateSource: state.map && state.map.mapStateSource,
    layers: state.layers,
    query: state.query,
    arealocation: state.arealocation,
    routing:state.routing,
    draw:state.draw,
    sidebar:state.sidebar,
    panoramic:state.panoramic,
    thematic:state.thematic,
    toolbar:state.toolbar,
    layermanager:state.layermanager,
    map3d:state.map3d
  };
}, {
  onMapViewChanges: changeMapView,
    onSwitchLayer: switchLayers,
    updateSource,
    configureMap,
    loadStyle,
    changStyle,
    endDrawing,
    resetQuery,
    mouseDownOnMap,
    zoomToPoint
  })(mapApp);








