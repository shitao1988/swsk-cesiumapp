/*
 * @Author: 史涛 
 * @Date: 2019-01-05 19:27:09 
 * @Last Modified by: 史涛
 * @Last Modified time: 2019-03-02 15:53:39
 */
import { Button, Modal, Slider, Checkbox, Tabs, Alert, Input, Row, Col, message } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ListSort from './ListSort';
import { LoadResourcesList, ShowRes, ChangeOpacity_Res, addResources, ChangeIndex_Res } from "./actions";
import './style.less';
const TabPane = Tabs.TabPane;


class ServiceData extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    className: 'list-sort-service',
  };


  state = {
    visible: false,
    tabkey: 'arcgis',
    AgsLayerID: '',
    WMTSUrl: '',
    WMTSLayerName: '',
    AgsUrl: '',
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    if (this.state.AgsUrl.trim() === ""&&this.state.tabkey === 'arcgis') {
      message.warning('请输入url地址');
      return;
    }
    if (this.state.WMTSUrl.trim() === ""&&this.state.tabkey === 'wmts') {
      message.warning('请输入url地址');
      return;
    }
    if (this.state.LayerTitle.trim() === "") {
      message.warning('请输入标题');
      return;
    }
    this.props.addResources(this.state.tabkey === 'arcgis' ? {
      "url": this.state.AgsUrl,
      "type": "ersidylayer",
      "id": new Date().getTime(),
      "name": this.state.LayerTitle,
      "visibility": false,
      "layerindex": 1,
      "opacity": 0.8,
      "f": "image"
    } : {
      "url": this.state.WMTSUrl,
        "type": "geowmts",
        "id": new Date().getTime(),
        "name": this.state.LayerTitle,
        "visibility": false,
        "layer": this.state.WMTSLayerName,
        "style": "default",
        "format": "image/png",
        "tilematrixSet": "default028mm"
      })
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }


  componentDidMount() {
    this.props.LoadResourcesList();
  }

  onVisiableChange = (id) => {
    this.props.ShowRes(id);
  }

  onOpacityChange = (id, value) => {
    this.props.ChangeOpacity_Res(id, value / 100);
  }
  sortChange = (children) => {
    if (children.length) {
      children.forEach((el, index) => {
        this.props.ChangeIndex_Res(el.key, index + 1);
      });
    }

    //  this.props.ChangeIndex_Res(0,3);

  }

  onChangeTitle = (e) => {
    this.setState({ LayerTitle: e.target.value });
  }

  onChangeAgsLayerID = (e) => {
    this.setState({ AgsLayerID: e.target.value });
  }

  onChangeAgsUrl = (e) => {
    this.setState({ AgsUrl: e.target.value });
  }

  onChangeWMTSLayerName = (e) => {
    this.setState({ WMTSLayerName: e.target.value });
  }

  onChangeWMTSUrl = (e) => {
    this.setState({ WMTSUrl: e.target.value });
  }

  onChangeTab = (key) => {
    this.setState({ tabkey: key });
  }


  render() {
    const childrenToRender = []
    this.props.layermanager.reslist.map((item, i) => {
      const {
        id, name,
      } = item;
      if (item.type != 'ersidylayer') return;
      childrenToRender.push(
        <div key={id} className={`${this.props.className}-list`}>
          <div className={`${this.props.className}-icon`}>
            <Checkbox onChange={() => { this.onVisiableChange(id) }} ></Checkbox>
          </div>
          <div className={`${this.props.className}-text`}>
            <h1>{name}</h1>
          </div>
          <div className={`${this.props.className}-silder`} >  <Slider defaultValue={80} onChange={(e) => { this.onOpacityChange(id, e) }} /></div>
        </div>
      );
    });

    return (
      <div className={`${this.props.className}-wrapper`}>
        <div className={this.props.className}>
          <Button
            type="dashed"
            style={{ width: "100%" }}
            onClick={this.showModal}
          >
            新增
          </Button>
          <ListSort
            dragClassName="list-drag-selected"
            onChange={(e) => { this.sortChange(e) }}
            appearAnim={{ animConfig: { marginTop: [5, 30], opacity: [1, 0] } }}
          >
            {childrenToRender}
          </ListSort>

          <Modal
            title="添加服务"
            width={600}
            wrapClassName="addservice_modal"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Tabs defaultActiveKey="arcgis" >
              <TabPane tab="ArcGIS MapServer" key="arcgis" onChange={this.onChangeTab}>
                <Row>
                  <Alert message="示例地址:  http://58.216.48.11:6080/arcgis/rest/services/SQCK/MapServer" type="info" showIcon />
                </Row>

                <Row>
                  <Col span={3} >服务地址:</Col>
                  <Col span={20}> <Input placeholder="请输入服务地址" allowClear onChange={this.onChangeAgsUrl} /></Col>
                </Row>
                <Row>
                  <Col span={3} >标题:</Col>
                  <Col span={20} > <Input placeholder="请输入标题" onChange={this.onChangeTitle} /></Col>
                </Row>
                <Row>
                  <Col span={3} >图层序号:</Col>
                  <Col span={20} > <Input placeholder="请输入图层序号" onChange={this.onChangeAgsLayerID} /></Col>
                </Row>

              </TabPane>
              <TabPane tab="WMTS" key="wmts">
                <Row>
                  <Alert message="示例地址:  http://58.216.48.11:6080/arcgis/rest/services/Image_2015_2K/MapServer/WMTS" type="info" showIcon />
                </Row>

                <Row>
                  <Col span={3} >服务地址:</Col>
                  <Col span={20}> <Input placeholder="请输入服务地址" allowClear onChange={this.onChangeWMTSUrl} /></Col>
                </Row>
                <Row>
                  <Col span={3} >标题:</Col>
                  <Col span={20} > <Input placeholder="请输入标题" onChange={this.onChangeTitle} /></Col>
                </Row>
                <Row>
                  <Col span={3} >图层名:</Col>
                  <Col span={20} > <Input placeholder="请输入图层名" onChange={this.onChangeWMTSLayerName} /></Col>
                </Row>
              </TabPane>
            </Tabs>
          </Modal>
        </div>
      </div>

    );
  }
}

export default connect((state) => {
  return { layermanager: state.layermanager }
}, {
    LoadResourcesList, ShowRes, ChangeOpacity_Res, ChangeIndex_Res, addResources
  })(ServiceData);
