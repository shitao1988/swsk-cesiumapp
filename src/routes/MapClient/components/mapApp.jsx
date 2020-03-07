/*
 * @Author: 史涛
 * @Date: 2019-01-05 17:40:59
 * @Last Modified by: 史涛
 * @Last Modified time: 2020-03-07 17:09:13
 */

import "../../../themes/iconfont/iconfont.css";
import { Layout } from "antd";
const { Header, Content } = Layout;
import PropTypes from "prop-types";
import React from "react";
//import MapBoxMap from "./MapBoxGL/map";
import CesiumMap from "./cesium/cesiummap";
import SearchBar from "../modules/SearchBar/searchbar";
import SideBar from "../modules/SideBar/sidebar";
import ToolBar from "../modules/ToolBar/toolbar";
import SpatialQuery from '../modules/SpatialQuery/toolbar';
import QueryResult from "../modules/QueryResult/queryresult";
import LayerSwitch from "../modules/LayerSwitch/layerswitch";
import { defaultMapStyle, ROADMapStyle } from "./MapBoxGL/mapstyle";

import "../components/MapBoxGL/assest/mapiconfont/iconfont.css";

class mapApp extends React.Component {
  static propTypes = {
    // redux store slice with map configuration (bound through connect to store at the end of the file)
    mapConfig: PropTypes.object,
    map: PropTypes.object,
    layers: PropTypes.object,
    step: PropTypes.number,
    mapStateSource: PropTypes.string,
    currentZoom: PropTypes.number,
    changeZoomLevel: PropTypes.func,
    mapOnClick: PropTypes.func,
    showsidebar: PropTypes.bool,
    drawStatus: PropTypes.string,
    drawOwner: PropTypes.string,
    drawMethod: PropTypes.string,
    features: PropTypes.array,
    query: PropTypes.object
  };

  static defaultProps = {
    step: 1,
    currentZoom: 3,
    showsidebar: false,
    drawStatus: null,
    drawOwner: null,
    drawMethod: null,
    features: [],
    changeZoomLevel: () => {},
    style: {
      radius: 5,
      color: "blue",
      weight: 1,
      opacity: 1,
      fillOpacity: 0
    },
    arealocationstyle: {
      dashArray: "6",
      radius: 5,
      color: "red",
      weight: 2,
      opacity: 0.4,
      fillOpacity: 0.2,
      fillColor: "#1890ff"
    }
  };

  state = {
    model3d: "mapbox",
    StreetViewVisible: false,
    resize: 0
  };

  componentDidMount() {
    this.props.loadStyle(ROADMapStyle);
    this.props.configureMap(mapConfigJson);
    const ele = document.getElementById("loading");
    ele.style.display = "none";
  }

  render() {
    const { model3d } = this.state;
    const { mapConfig, map, map3d } = this.props;
    // wait for loaded configuration before rendering
    if (mapConfig && map3d) {
      return (
        <Layout>
          <Header className="mapheader">
            <SearchBar />
            <div className="logo-bk"></div>
            <div className="logo-label"></div>
            <ToolBar  model3d={model3d} />
          </Header>
          <Content>

            <SideBar />
            <QueryResult />
            <SpatialQuery></SpatialQuery>
            <CesiumMap ></CesiumMap>
            <LayerSwitch></LayerSwitch>
          </Content>
        </Layout>
      );
    }
    return null;
  }
}

export default mapApp;
