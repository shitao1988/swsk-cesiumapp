import React, { Component } from "react";
import QueryBuilder from "../QueryBuilder/QueryBuilder";
import { Button, Table } from "antd";
import axios from "axios";
import { loadStatisticData } from "./actions";
import { connect } from "react-redux";

class QueryPanel extends Component {
  state = {
    queryparams: { source: null }
  };
  onQueryChange = query => {
    this.setState({ queryparams: query });
  };

  onQuery = () => {
    return axios
      .get(
        "http://61.177.139.228:9000/gateway/wuxi_chenguan/grid_road_all/MapServer/24/query",
        {
          params: {
            where: "1=1",
            outFields: "*",
            returnGeometry: false,
            returnIdsOnly: false,
            returnCountOnly: false,
            orderByFields: "",
            groupByFieldsForStatistics: "网格管理",
            outStatistics:JSON.stringify([{
              "statisticType": "sum",
              "onStatisticField": "Shape_Area",
              "outStatisticFieldName": "Shape_Area和"
            }]),
            f: "json"
          }
        }
      )
      .then(response => {
        this.props.loadStatisticData(response.data);
      })
      .catch(e => {});
  };
  render() {
    const { statisticlist } = this.props.statistics;
    const columns = statisticlist.fields.map(field => {
      return {
        title: field.alias,
        dataIndex: field.name,
        key: field.name, //field.type  length
        render: text => <a>{text}</a>
      };
    });

    const data = statisticlist.features.map(fea => {
      return fea.attributes;
    });
    return (
      <>
        <QueryBuilder onChange={this.onQueryChange}></QueryBuilder>
        <Button
          disabled={this.state.queryparams.source ? false : true}
          className="QueryBtn"
          onClick={this.onQuery}
          type="primary"
        >
          获取数据
        </Button>
        <Table
          className="querytable"
          columns={columns}
          dataSource={data}
          scroll={{ y: "calc(100vh - 490px)" }}
        />
      </>
    );
  }
}

export default connect(
  state => {
    return { statistics: state.statistics };
  },
  {
    loadStatisticData
  }
)(QueryPanel);
