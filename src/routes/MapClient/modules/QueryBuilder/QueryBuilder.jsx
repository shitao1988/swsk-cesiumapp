/*
 * @Author: 史涛 
 * @Date: 2020-03-07 12:09:38 
 * @Last Modified by: 史涛
 * @Last Modified time: 2020-03-07 13:46:09
 */
import React, { Component } from "react";
import {
  Row,
  Col,
  Divider,
  Popover,
  Tag,
  Button,
  TreeSelect,
  Select,
  Input,
  Icon,
  List,
  InputNumber
} from "antd";
import "./style.less";
const assign = require("object-assign");

export default class QueryBuilder extends Component {
  state = {
    cal_title: "基本统计",
    callistshow: true,
    sel_cal_list: [],
    sel_filter_list:[],
    sel_group_list:[],
    sel_data:null,
    sel_field: "",
    sel_cal: { title: "原始数据", value: "default" },
    filterlistshow: true,
    sel_filter_field: "",
    sel_filter_value:null,
    sel_filter_rel:{value: "equal", children: "等于"},
    sel_data_title: ""
  };
  onSelectCal = item => {
    this.setState({ sel_cal: item, callistshow: false, cal_title: item.title });
  };
  calDelete = i => {
    let oldstate = assign({}, this.state);
    let sel_cal_list = oldstate.sel_cal_list.filter(
      (e,index) =>index !== i
    );
    this.setState({
      sel_cal_list: sel_cal_list
    });
  };
  onSelectField = item => {
    let oldstate = assign({}, this.state);
    oldstate.sel_cal_list.push({
      sel_field: item.alias,
      sel_cal: oldstate.sel_cal
    });
    this.setState({
      cal_title: "基本统计",
      callistshow: true,
      sel_field: "",
      sel_cal: { title: "原始数据", value: "default" },
      sel_cal_list: oldstate.sel_cal_list
    },this.Update);
  };

  _renderFilterTags= () => {
    return this.state.sel_filter_list.map((filter, index) => {
      return (
        <>
        <Tag
          key={index}
          color="geekblue"
          closable
          onClose={() => this.filterDelete(index)}
        >
           {filter.sel_filter_field} {filter.sel_filter_rel.children} {filter.sel_filter_value}
        </Tag>
        </>
        
      );
    });
  };

  filterDelete=(i)=>{
    let oldstate = assign({}, this.state);
    let sel_filter_list = oldstate.sel_filter_list.filter(
      (e,index) =>index !== i
    );
    this.setState({
      sel_filter_list: sel_filter_list
    },this.Update);
  }
  filterValueChange=(value)=>{
    this.setState({sel_filter_value:value})
  }

  /**
   *
   *
   * @returns
   */
  _renderCalTags = () => {
    //console.log(this.state.sel_cal_list);
    return this.state.sel_cal_list.map((cal, index) => {
      return (
        <Tag
          key={index}
          color="#9cc177"
          closable
          onClose={() => this.calDelete(index)}
        >
          {cal.sel_field}的{cal.sel_cal.title}
        </Tag>
      );
    });
  };

  onSelectGroupField=(item)=>{
    let oldstate = assign({}, this.state);
    oldstate.sel_group_list.push({
      sel_group_field: item.alias
    });
    this.setState({
      sel_group_field: null,
      sel_group_list: oldstate.sel_group_list
    },this.Update);
  }

  _renderGroupTags = () => {
    return this.state.sel_group_list.map((group, index) => {
      return (
        <Tag
          key={index}
          color="#9cc177"
          closable
          onClose={() => this.groupDelete(index)}
        >
          {group.sel_group_field}
        </Tag>
      );
    });
  };

  groupDelete=(i)=>{
    let oldstate = assign({}, this.state);
    let sel_group_list = oldstate.sel_group_list.filter(
      (e,index) =>index !== i
    );
    this.setState({
      sel_group_list: sel_group_list
    },this.Update);
  }

  dataSelected = (value, node, extra) => {
    this.setState({
      sel_data_title: value,
      sel_data: node.props
    },this.Update);
  };

  onSelectFilterField = item => {
    this.setState({
      sel_filter_field: item.alias,
      sel_filter_field_type: item.type,
      filterlistshow: false
    });
  };

  onOrderChange=(value)=>{
    this.setState({
      sel_order_fields: value
    },this.Update);
  }

  onAddFilter = () => {
    let oldstate = assign({}, this.state);
    oldstate.sel_filter_list.push({
      sel_filter_field:oldstate.sel_filter_field,
      sel_filter_field_type:oldstate.sel_filter_field_type,
      sel_filter_rel:oldstate.sel_filter_rel,
      sel_filter_value:oldstate.sel_filter_value
    });
    this.setState({
      sel_filter_field:null,
      sel_filter_field_type:null,
      sel_filter_rel:null,
      sel_filter_value:null,
      filterlistshow:true,
      sel_filter_list: oldstate.sel_filter_list
    },this.Update);
  };


  Update() {
    const {sel_data,sel_filter_list,sel_cal_list,sel_group_list,sel_order_fields}=this.state;
    this.props.onChange({
      source: sel_data?sel_data:null,
      filterlist: sel_filter_list,
      callist: sel_cal_list,
      grouplist: sel_group_list,
      orderfields:sel_order_fields
    });
  }

  render() {
    const text = <span>Title</span>;
    const content = (
      <div>
        <p>Content</p>
        <p>Content</p>
      </div>
    );

    const treeData = [
      {
        title: "兴趣点",
        value: "poi",
        key: "poi",
        children: [
          {
            title: "学校",
            value: "学校",
            key: "17"
          },
          {
            title: "小区",
            value: "小区",
            key: "18"
          }
        ]
      },
      {
        title: "管理单元",
        value: "grid",
        key: "grid",
        children: [
          {
            title: "管理单元A类",
            value: "管理单元A类",
            key: "1"
          },
          {
            title: "管理单元B类",
            value: "管理单元B类",
            key: "6"
          }
        ]
      }
    ];
    const calculatedatas = [
      {
        title: "数量",
        value: "count"
      },
      {
        title: "求和",
        value: "sum"
      },
      {
        title: "最小值",
        value: "min"
      },
      {
        title: "最大值",
        value: "max"
      },
      {
        title: "平均值",
        value: "avg"
      },
      {
        title: "标准差",
        value: "stddev"
      }
    ];

    const fielddatas = [
      {
        "name": "OBJECTID",
        "type": "esriFieldTypeOID",
        "alias": "OBJECTID"
        },
        {
        "name": "名称",
        "type": "esriFieldTypeString",
        "alias": "名称",
        "length": 50
        },
        {
        "name": "小区类型",
        "type": "esriFieldTypeString",
        "alias": "小区类型",
        "length": 10
        },
        {
        "name": "网格管理",
        "type": "esriFieldTypeString",
        "alias": "网格管理",
        "length": 50
        },
        {
        "name": "类型编码",
        "type": "esriFieldTypeString",
        "alias": "类型编码",
        "length": 10
        },
        {
        "name": "网格编码",
        "type": "esriFieldTypeString",
        "alias": "网格编码",
        "length": 60
        },
        {
        "name": "Shape_Length",
        "type": "esriFieldTypeDouble",
        "alias": "Shape_Length"
        },
        {
        "name": "Shape_Area",
        "type": "esriFieldTypeDouble",
        "alias": "Shape_Area"
        }
    ];

    const {
      filterlistshow,
      sel_data_title,
      sel_cal_list,
      cal_title,
      callistshow,
      sel_filter_list,
      sel_filter_field,
      sel_filter_field_type,
      sel_filter_rel,
      sel_group_list
    } = this.state;

    return (
      <>
        <Row className="querybuilder">
          <Col>
            <Divider orientation="left">资源</Divider>
            <div className="item">
              <TreeSelect
                showSearch
                allowClear
                style={{ minWidth: "150px" }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                treeData={treeData}
                onSelect={this.dataSelected}
                placeholder="选择数据"
                treeDefaultExpandAll
              />
            </div>
          </Col>
          <Col>
            <Divider orientation="left">筛选条件</Divider>

            <div className="item">
            {this._renderFilterTags()}
              {sel_filter_list.length === 0 && (
                <span className="itemlabel" style={{ color: "#9cc177" }}>
                  添加筛选条件
                </span>
              )}
              <Popover
                placement="bottom"
                overlayClassName="querybuilder_popover"
                title={
                  filterlistshow ? (
                    sel_data_title
                  ) : (
                    <>
                      <a
                        style={{ margin: "0 2px 0 -10px" }}
                        onClick={() => {
                          this.setState({
                            filterlistshow: true
                          });
                        }}
                      >
                        <Icon type="left" />
                      </a>
                      {sel_data_title} - {sel_filter_field}
                      {sel_filter_field_type === "esriFieldTypeString" ? (
                        <Select defaultValue="equal" 
                          onChange={(value,option) => {
                            this.setState({ sel_filter_rel: option.props });
                          }}
                          style={{ width: 100 }}>
                          <Select.Option value="equal">等于</Select.Option>
                          <Select.Option value="notequal">不等于</Select.Option>
                          <Select.Option value="contain">包含</Select.Option>
                          <Select.Option value="notcontain">
                            不包含
                          </Select.Option>
                          <Select.Option value="null">为空</Select.Option>
                          <Select.Option value="notnull">不为空</Select.Option>
                        </Select>
                      ) : (
                        <Select
                          defaultValue="equal"
                          onChange={(value,option) => {
                            this.setState({ sel_filter_rel: option.props });
                          }}
                          style={{ width: 100 }}
                        >
                          <Select.Option value="equal">等于</Select.Option>
                          <Select.Option value="notequal">不等于</Select.Option>
                          <Select.Option value="bigger">大于</Select.Option>
                          <Select.Option value="smaller">小于</Select.Option>
                          <Select.Option value="between">
                            介于之间
                          </Select.Option>
                          <Select.Option value="null">为空</Select.Option>
                          <Select.Option value="notnull">不为空</Select.Option>
                        </Select>
                      )}
                    </>
                  )
                }
                content={
                  filterlistshow ? (
                    <List
                      className="field_listitem"
                      itemLayout="horizontal"
                      split={false}
                      dataSource={fielddatas.filter(
                        e =>
                          e.type === "esriFieldTypeString" ||
                          e.type === "esriFieldTypeDouble"
                      )}
                      renderItem={item => (
                        <List.Item
                          onClick={() => this.onSelectFilterField(item)}
                        >
                          <List.Item.Meta
                            avatar={
                              <Tag color="rgb(156, 193, 119)">
                                <i
                                  className={`iconfont ${
                                    item.type === "esriFieldTypeString"
                                      ? "icon-Abc1"
                                      : "icon-number"
                                  }`}
                                />
                              </Tag>
                            }
                            title={<a>{item.alias}</a>}
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <>
                      {sel_filter_field_type ===
                      "esriFieldTypeString" ? (
                        <Input
                          style={{ width: "100%" }}
                          size="large"
                          onChange={(e)=>this.filterValueChange(e.target.value)}
                          placeholder="输入值"
                        />
                      ) : sel_filter_rel.value === "between" ? (
                        <Input.Group compact>
                          <InputNumber
                            style={{ width: "auto", textAlign: "center" }}
                            placeholder="最小值"
                          />
                          <Input
                            style={{
                              width: 30,
                              borderLeft: 0,
                              pointerEvents: "none",
                              backgroundColor: "#fff"
                            }}
                            placeholder="~"
                            disabled
                          />
                          <InputNumber
                            style={{
                              width: "auto",
                              textAlign: "center",
                              borderLeft: 0
                            }}
                            placeholder="最大值"
                          />
                        </Input.Group>
                      ) : (sel_filter_rel.value  === "null"||sel_filter_rel.value  === "notnull")?null:(
                        <InputNumber style={{ width: "100%" }} onChange={this.filterValueChange}/>
                      )}

                      <Button onClick={this.onAddFilter} type="primary">
                        添加筛选
                      </Button>
                    </>
                  )
                }
                trigger="click"
              >
                <Button icon="plus" />
              </Popover>
            </div>
          </Col>
          <Col>
            <Divider orientation="left">查看</Divider>
            <div className="item">
              {this._renderCalTags()}
              {sel_cal_list.length === 0 && (
                <span className="itemlabel" style={{ color: "#9cc177" }}>
                  原始数据
                </span>
              )}

              <Popover
                overlayClassName="querybuilder_popover"
                placement="bottom"
                title={
                  cal_title === "基本统计" ? (
                    "基本统计"
                  ) : (
                    <>
                      <a
                        style={{ margin: "0 2px 0 -10px" }}
                        onClick={() => {
                          this.setState({
                            sel_cal: "default",
                            callistshow: true,
                            cal_title: "基本统计"
                          });
                        }}
                      >
                        <Icon type="left" />
                      </a>
                      {cal_title}
                    </>
                  )
                }
                content={
                  callistshow ? (
                    <List
                      className="cal_listitem"
                      itemLayout="horizontal"
                      split={false}
                      dataSource={calculatedatas}
                      renderItem={item => (
                        <List.Item onClick={() => this.onSelectCal(item)}>
                          <List.Item.Meta title={<a>{item.title}</a>} />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <List
                      className="field_listitem"
                      itemLayout="horizontal"
                      split={false}
                      dataSource={fielddatas.filter(
                        e => e.type === "esriFieldTypeDouble"
                      )}
                      renderItem={item => (
                        <List.Item onClick={() => this.onSelectField(item)}>
                          <List.Item.Meta
                            avatar={<i className="iconfont icon-number" />}
                            title={<a>{item.alias}</a>}
                          />
                        </List.Item>
                      )}
                    />
                  )
                }
                trigger="click"
              >
                <Button icon="plus" />
              </Popover>
            </div>
          </Col>
          <Col>
            <Divider orientation="left">分组条件</Divider>
            <div className="item">
              {this._renderGroupTags()}
              {sel_group_list.length === 0 && (
                <span className="itemlabel" style={{ color: "#9cc177" }}>
                  添加一个分组
                </span>
              )}
              <Popover
                placement="bottom"
                overlayClassName="querybuilder_popover"
                title={sel_data_title}
                content={
                  <List
                    className="field_listitem"
                    itemLayout="horizontal"
                    split={false}
                    dataSource={fielddatas.filter(
                      e => e.type === "esriFieldTypeString"
                    )}
                    renderItem={item => (
                      <List.Item onClick={() => this.onSelectGroupField(item)}>
                        <List.Item.Meta
                          avatar={
                            <Tag color="rgb(156, 193, 119)">
                              <i className="iconfont icon-Abc1" />
                            </Tag>
                          }
                          title={<a>{item.alias}</a>}
                        />
                      </List.Item>
                    )}
                  />
                }
                trigger="click"
              >
                <Button icon="plus" />
              </Popover>
            </div>
          </Col>
          <Col>
             <Popover
                placement="bottom"
                overlayStyle={{width: 200}}
                overlayClassName="querybuilder_popover"
                title={sel_data_title}
                content={<><Divider style={{marginTop:0}} orientation="left">排序</Divider>
                <Select
                mode="multiple"
                style={{ width: '100%',padding:'0 10px' }}
                placeholder="选择排序字段"
                onChange={this.onOrderChange}
              >
                {
                  fielddatas.map(field => {
                    return <Option key={field.name}>{field.alias}</Option>
                  })
                }
              </Select></>
                  
                }
                trigger="click"
              >
              <Button className="otherbtn" icon="ellipsis" />
              </Popover>
           
          </Col>
        </Row>
      </>
    );
  }
}
