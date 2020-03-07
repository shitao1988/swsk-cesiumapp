import React, { Component } from "react";
import { connect } from "react-redux";
import { Card, Radio, Button, Divider, Checkbox, InputNumber, Row } from "antd";
import { changeDrawingStatus } from "../../actions/draw";
import ResultList from "./resultlist";
import "./style.less";
import {
  queryThematicResponces,
  setSelectedQueryLayer,
  setSelectedFeature,
  showSpatialQuery,
  setBufferDistance
} from "../ThematicList/actions.js";

class ToolBar extends Component {
  onSpatialQuery = type => {
    this.props.changeDrawingStatus("start", type, "spatial", [], {});
  };
  onCheckBuffer = e => {
    this.props.setBufferDistance(e.target.checked ? 100 : 0);
  };

  onBufferChange = value => {
    this.props.setBufferDistance(value);
  };

  onLayerChange = e => {
    this.onClear();
    this.props.setSelectedQueryLayer(e.target.value);
  };

  onClear = () => {
    this.props.changeDrawingStatus("clean", "", "measure", [], {});
    this.props.queryThematicResponces(null, null);
    this.props.setSelectedFeature(null);
  };

  onClose = () => {
    this.props.showSpatialQuery();
    this.onClear();
  };

  renderLayerSelectPanel = () => {
    const { querylayerid, themlist } = this.props.thematics;
    const selthemlist = themlist.filter(e => e.visibility);
    //this.props.setSelectedQueryLayer(themlist[0]);

    return selthemlist.length ? (
      <Radio.Group
        onChange={this.onLayerChange}
        value={querylayerid}
        buttonStyle="solid"
      >
        {selthemlist.map(el => {
          return <Radio.Button value={el.id}>{el.alias}</Radio.Button>;
        })}
      </Radio.Group>
    ) : (
      "请在资源目录选择图层"
    );
  };

  render() {
    const { enable } = this.props.draw;
    return (
      this.props.thematics.spatialQueryShow &&
      enable && (
        <Card
          className="spatial_toolbar_card"
          id="toolbar_card"
          bordered={false}
        >
          <Divider orientation="left">图层选择</Divider>
          {this.renderLayerSelectPanel()}
          <Divider orientation="left">空间类型</Divider>
          <Button.Group className="toolbar">
            <Button onClick={() => this.onSpatialQuery("point")}>点</Button>
            <Button onClick={() => this.onSpatialQuery("polyline")}>线</Button>
            <Button onClick={() => this.onSpatialQuery("polygon")}>面</Button>
          </Button.Group>
          <Row className="buffercontain">
            <Checkbox onChange={e => this.onCheckBuffer(e)}> 缓冲区 </Checkbox>
            <InputNumber
              min={100}
              value={this.props.thematics.bufferdistance}
              onChange={e => this.onBufferChange(e)}
            /> 米
          </Row>
          <Button
            onClick={this.onClose}
            style={{ float: "right" }}
            type="primary"
          >
            关闭
          </Button>
          <Button
            onClick={this.onClear}
            style={{ float: "right", right: 10 }}
            type="primary"
          >
            清除
          </Button>

          <Divider orientation="left">查询结果</Divider>
          <ResultList></ResultList>
        </Card>
      )
    );
  }
}

export default connect(
  state => {
    return { draw: state.draw, map: state.map, thematics: state.thematics };
  },
  {
    changeDrawingStatus,
    showSpatialQuery,
    queryThematicResponces,
    setSelectedFeature,
    setBufferDistance,
    setSelectedQueryLayer
  }
)(ToolBar);
