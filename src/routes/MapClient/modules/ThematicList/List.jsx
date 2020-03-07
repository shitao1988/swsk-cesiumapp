import React, { Component } from "react";
import PropTypes from "prop-types";
import { Collapse, Icon, Table, Tabs } from "antd";
import { connect } from "react-redux";
import { loadThematicsList, showThematicLayer,setSelectedQueryLayer } from "./actions";
import {
  addSourceAndLayers,
  removeSourceAndLayers
} from "../../components/MapBoxGL/actions";
import { getCookie, login } from "../../../../utils/UserInfoUtils";

const axios = require("axios");
import qs from "qs";
import "./style.less";

const { TabPane } = Tabs;
class List extends Component {
  static propTypes = {
    prop: PropTypes
  };

  state = { list: [] };

  renderList = list => {
    let rootlist = [];
    if (list) {
      list.forEach(item => {
        if (item.pid == 0) {
          let sublist = list.filter(e => e.pid == item.id);
          rootlist.push(
            <Collapse expandIconPosition="right" bordered={false}>
            {sublist.map(subitem => {
              let servicelist = this.props.thematics.themlist.filter(
                e =>
                  e.dic_code && e.dic_code.split(",").indexOf(subitem.code) > -1
              );
              let num = servicelist.length;
              return (
                <Collapse.Panel
                  header={
                    <div>
                      <Icon className="foldericon" type="folder" />
                      {subitem.name + " (" + num + ")"}
                    </div>
                  }
                  key={subitem.id}
                >
                  {servicelist.length > 0
                    ? this.renderServiceList(servicelist)
                    : null}
                </Collapse.Panel>
              );
            })}
          </Collapse>
          )
        }
      });
    }

    return rootlist;
  };

  renderServiceList = list => {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {},
      onSelect: (record, selected, selectedRows, nativeEvent) => {
        if (selected) {
          this.addThematicToStyle(record);
        } else {
          this.removeThematicfromStyle(record);
        }
        // this.addThematicsListToStyle(record)
      }
    };

    const columns = [
      {
        title: "Name",
        dataIndex: "alias",
        render: text => <a>{text}</a>
      }
    ];
    return (
      <Table
        bordered={false}
        pagination={false}
        showHeader={false}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={list}
      />
    );
  };

  getServiceList = () => {
    return axios
      .get("service.json")
      .then(response => {
        const list = response.data.result.filter(
          e =>
            e.serviceType == "map" ||
            e.serviceType == "wms" ||
            e.serviceType == "wmts"
        );
        this.getList();
        this.props.loadThematicsList(list);
      })
      .catch(e => {});
    //   if(!getCookie("userinfo")){
    //     login();
    // }else{
    //   let token =JSON.parse(getCookie("userinfo")).geokey;
    //   return axios.get(ServerUrl+'/portal/user/service',{headers:{token}}).then((response) => {
    //     const list=response.data.result.filter(e=>e.serviceType=='map'||e.serviceType=='wms'||e.serviceType=='wmts');
    //       this.getList();
    //       this.props.loadThematicsList(list);
    //   }).catch((e) => {

    //   });
    // }
  };

  addThematicToStyle = item => {
    this.props.showThematicLayer(item.id);
    this.props.setSelectedQueryLayer(item.id);
    if (item.serviceType === "wms") {
      this.props.addSourceAndLayers(
        "thematic_" + item.name,
        {
          type: "raster",
          tiles: [
            ServerIp +
              item.proxy_url +
              "?bbox={bbox-epsg-4490}&format=image/png&service=WMS&version=1.1.1&request=GetMap&styles=default&srs=EPSG:4490&transparent=true&width=256&height=256&layers=0"
          ],
          tileSize: 256
        },
        {
          id: "thematic_" + item.name,
          type: "raster",
          visibility: "none",
          source: "thematic_" + item.name
        }
      );
    } else if (item.serviceType === "map") {
      this.props.addSourceAndLayers(
        "thematic_" + item.name,
        {
          type: "raster",
          arcgisDynamic: true,
          tiles: [
            ServerIp +
              item.proxy_url +
              "/export?bbox={bbox-epsg-4490}&size=256%2C256&dpi=96&format=png24&transparent=true&bboxSR=4490&imageSR=4490&f=image&layers=show:"+item.layers
          ],
          tileSize: 256
        },
        {
          id: "thematic_" + item.name,
          type: "raster",
          visibility: "none",
          source: "thematic_" + item.name
        }
      );
    } else if (item.serviceType === "wmts") {
      this.props.addSourceAndLayers(
        "thematic_" + item.name,
        {
          type: "raster",
          tiles: [
            ServerIp +
              item.proxy_url +
              "?request=GetTile&tilematrix={z}&tilerow={y}&tilecol={x}"
          ],
          tileSize: 256
        },
        {
          id: "thematic_" + item.name,
          type: "raster",
          visibility: "none",
          source: "thematic_" + item.name
        }
      );
    }
  };

  removeThematicfromStyle = item => {
    this.props.showThematicLayer(item.id);
    this.props.removeSourceAndLayers("thematic_" + item.name);
  };

  getList = () => {
    return axios
      .get("catalog.json")
      .then(response => {
        this.setState({ list: response.data.result });
      })
      .catch(e => {});
    //   if(!getCookie("userinfo")){
    //     login();
    // }else{
    //   let token =JSON.parse(getCookie("userinfo")).geokey;
    //   return axios.get(ServerUrl+'/portal/service/catalog',{headers:{token}}).then((response) => {
    //       this.setState({list:response.data.result});
    //   }).catch((e) => {

    //   });
    // }
  };
  componentDidMount() {
    this.getServiceList();
  }

  render() {
    return (
      <div className="thematiclist">{this.renderList(this.state.list)}</div>
    );
  }
}

export default connect(
  state => {
    return { thematics: state.thematics };
  },
  {
    loadThematicsList,
    setSelectedQueryLayer,
    addSourceAndLayers,
    removeSourceAndLayers,
    showThematicLayer
  }
)(List);
