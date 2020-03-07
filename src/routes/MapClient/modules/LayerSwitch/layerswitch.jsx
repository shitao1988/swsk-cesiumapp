import React, { Component } from "react";
import {
  defaultMapStyle,
  MapBlueStyle,
  MapDarkStyle,
  IMAGEMapStyle,
  ROADMapStyle
} from "../../components/MapBoxGL/mapstyle";
import { loadStyle, changStyle,zoomToPoint3D} from "../../components/MapBoxGL/actions";
import { changeMapModule } from "../../actions/map";
import {switchLayerVisiable} from '../../actions/config'
import { connect } from "react-redux";
import { Avatar, Radio, Popover } from "antd";

// import SpeedDial from "@material-ui/lab/SpeedDial";
// import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import "./style.less";

class layerswitch extends Component {
  state = { open: false, model: "2.5D", layerchangevisiable: false };


  onSliderChange = e => {
    const index = e.target.value;
    if (index == 0) {
      this.props.changStyle(defaultMapStyle);
      this.props.changeMapModule("vector");
    } else if (index == 1) {
      this.props.changStyle(MapBlueStyle);
      this.props.changeMapModule("vector");
    } else if (index == 2) {
      this.props.changStyle(MapDarkStyle);
      this.props.changeMapModule("vector");
    } else if (index == 3) {
      this.props.changStyle(IMAGEMapStyle);
      this.props.changeMapModule("image");
    } else if (index == 4) {
      this.props.changStyle(ROADMapStyle);
      this.props.changeMapModule("road");
    }
  };



  render() {
    const content = (
      <div className="layer-switch-slider">
        <Radio.Group
          defaultValue="4"
          buttonStyle="solid"
          onChange={this.onSliderChange}
        >
          <Radio.Button value="0">
            <div className="slide-item">
              <div className="item mapboxstyle" />
              <div className="text">标准</div>
            </div>
          </Radio.Button>
          <Radio.Button value="1">
            {" "}
            <div className="slide-item">
              <div className="item mapboxstyle1" />
              <div className="text">夜黛蓝</div>
            </div>
          </Radio.Button>
          <Radio.Button value="2">
            <div className="slide-item">
              <div className="item mapboxstyle2" />
              <div className="text">夜魅黑</div>
            </div>
          </Radio.Button>
          <Radio.Button value="3">
            <div className="slide-item">
              <div className="item mapboxstyle3" />
              <div className="text">天地图影像</div>
            </div>
          </Radio.Button>
          <Radio.Button value="4">
            <div className="slide-item">
              <div className="item mapboxstyle4" />
              <div className="text">天地图矢量</div>
            </div>
          </Radio.Button>
        </Radio.Group>
      </div>
    );

    return (
      <div className="mapandlayer_change">
         <Popover placement="leftBottom" content={content} trigger="hover">
          <Avatar size="large" shape="square" className={"mapboxstyle3"}  />
        </Popover>
        
      </div>
    );
  }
}

export default connect(
  state => {
    return { map: state.map,mapConfig:state.mapConfig};
  },
  {
    loadStyle,
    changeMapModule,
    switchLayerVisiable,
    zoomToPoint3D,
    changStyle
  }
)(layerswitch);
