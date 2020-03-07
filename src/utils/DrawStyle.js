import {RenderStates} from 'react-map-gl-draw';

export function getEditHandleStyle({feature, state}) {
  switch (state) {
    case RenderStates.SELECTED:
    case RenderStates.HOVERED:
    case RenderStates.UNCOMMITTED:
      return {
        fill: '#188fff',
        fillOpacity: feature.geometry.type=="LineString"?0:1,
        stroke: '#188fff',
        strokeWidth: 2,
        r: 7
      };

    default:
      return {
        fill: '#188fff',
        fillOpacity: feature.geometry.type=="LineString"?0:1,
        stroke: '#188fff',
        strokeWidth: 2,
        r: 5
      };
  }
}

export function getFeatureStyle({feature, index, state}) {
  switch (state) {
    case RenderStates.SELECTED:
    case RenderStates.HOVERED:
    case RenderStates.UNCOMMITTED:
    case RenderStates.CLOSING:
      return {
        stroke: '#188fff',
        strokeWidth: 2,
        fill: '#188fff',
        fillOpacity: feature.geometry.type=="LineString"?0:feature.geometry.type=="Point"?1:0.3,
        strokeDasharray: '4,2'
      };

    default:
      return {
        stroke: '#188fff',
        strokeWidth: 2,
        fill: '#188fff',
        fillOpacity: feature.geometry.type=="LineString"?0:feature.geometry.type=="Point"?1:0.1,
      };
  }
}