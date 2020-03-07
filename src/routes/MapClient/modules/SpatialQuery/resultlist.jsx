import React, { Component } from "react";
import { connect } from "react-redux";
import { Card, Icon, Collapse } from "antd";
import {
  queryThematicResponces,
  setSelectedFeature
} from "../ThematicList/actions.js";
import {
  arcgisToGeoJSON
} from "@esri/arcgis-to-geojson-utils";


class ResultList extends Component {
  onSelectItem = item => {
    this.props.setSelectedFeature(arcgisToGeoJSON(item));
  };
  renderList = (list, titlefield) => {
    return list.map((el, index) => {
      return (
        <Collapse.Panel
          extra={
            <a title="定位">
              <Icon type="environment" onClick={() => this.onSelectItem(el)} />
            </a>
          }
          header={el.attributes[titlefield]}
          key={index}
        >
          {this.renderThematicContent(el.attributes)}
        </Collapse.Panel>
      );
    });
  };
  renderThematicContent(feas) {
    let list = [];
    for (const key in feas) {
      list.push(
        <p>
          {key}: {feas[key] ? feas[key] : "空"}
        </p>
      );
    }
    return list;
  }
  render() {
    const { themresult,querygeometry} = this.props.thematics;
    if (themresult&&querygeometry) {
      return (
        <Card
          size="small"
          className="spatial_result_card"
          bordered={false}
        >
          <Collapse bordered={false} defaultActiveKey={[0]}>
            {this.renderList(themresult.features, themresult.displayFieldName)}
          </Collapse>
        </Card>
      );
    }
    return null;
  }
}

export default connect(
  state => {
    return { thematics: state.thematics };
  },
  { queryThematicResponces, setSelectedFeature }
)(ResultList);
