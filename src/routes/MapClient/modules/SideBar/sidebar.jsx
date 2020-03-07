import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ThematicList from "../ThematicList/List";
import { Card, Tabs, Avatar,Button, Icon,Drawer} from "antd";
import StatisticsList from '../Statistics/List';
import QueryPanel from '../Statistics/QueryPanel';
import "./sidebar.less";
const { TabPane } = Tabs;

import { showSidebar } from "./actions";
//import onClickOutside from "react-onclickoutside";

export class SideBar extends Component {
  static propTypes = {
    query: PropTypes.object
  };
  static defaultProps = {
    query: {}
  };
  handleClickOutside = evt => {
    // this.props.query.inputfocus=false;
  };

  state = { drawervisible: false};

  showDrawer = () => {
    this.setState({
      drawervisible: true,
    });
  };

  onClose = () => {
    this.setState({
      drawervisible: false,
    });
  };

  onOpenAddPanel=()=>{

  }

  render() {
    const { show, module } = this.props.sidebar;
    return (
      <>
        <Card className="sidebar_menu" bordered={false}>
          <ul>
            <li
              name="layers"
              className={module === "layers" && "selected"}
              onClick={() => this.props.showSidebar(true, "layers")}
            >
              {" "}
              <i className="iconfont icon-tuceng"></i>
              资源目录
            </li>
            <li className="divider"></li>
            <li
              name="thematics"
              className={module === "thematics" && "selected"}
              onClick={() => this.props.showSidebar(true, "thematics")}
            >
              {" "}
              <i className="iconfont icon-keshihua"></i>
              资源统计
            </li>
          </ul>
        </Card>
        {show && (
          <Card
            className="sidebar_containtcard"
            title={
              module === "layers" ? (
                <>
                  <i
                    className="iconfont icon-siyecao"
                    style={{ color: "rgb(97, 87, 204)" }}
                  />
                  资源目录
                </>
              ) : (
                <>
                  <i
                    className="iconfont icon-ditudingwei"
                    style={{ color: "rgb(15, 194, 148)" }}
                  />
                  我的资源统计
                  <Avatar onClick={this.showDrawer} icon="plus" />
                </>
              )
            }
            extra={
              <a onClick={() => this.props.showSidebar(false, "")}>
                <Icon type="close" />
              </a>
            }
            style={{ width: 300 }}
          >
            <Tabs className="main_tabs" type="card" activeKey={module}>
              <TabPane key="layers">
                <ThematicList></ThematicList>
              </TabPane>
              <TabPane key="thematics">
                <StatisticsList></StatisticsList>
              </TabPane>
            </Tabs>
          </Card>
        )}
        <Drawer
          title="查询统计"
          placement='right'
          className='addstatisticpanel'
          mask={false}
          onClose={this.onClose}
          visible={this.state.drawervisible}
        >
         <QueryPanel></QueryPanel>
        </Drawer>
      </>
    );
  }
}

export default connect(
  state => {
    return { sidebar: state.sidebar, query: state.query };
  },
  { showSidebar }
)(SideBar);
