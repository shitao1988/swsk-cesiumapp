/*
 * @Author: 史涛
 * @Date: 2019-01-05 19:29:54
 * @Last Modified by: 史涛
 * @Last Modified time: 2020-03-03 11:27:15
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Card, Input, AutoComplete, Divider, Icon } from "antd";
import {
  query,
  resetQuery,
  queryOnFocus,
  changeQueryKey,
  clearSimpleResult,
  simpleQuery
} from "../../actions/query";
import { showSidebar } from "../SideBar/actions";
import PropTypes from "prop-types";
import "./searchbar.less";

const Option = AutoComplete.Option;

class SearchBar extends Component {
  static propTypes = {
    onQuery: PropTypes.func,
    resetQuery: PropTypes.func,
    queryOnFocus: PropTypes.func,
    changeQueryKey: PropTypes.func,
    showSidebar: PropTypes.func,
    query: PropTypes.object
  };
  static defaultProps = {
    onQuery: () => {},
    resetQuery: () => {},
    queryOnFocus: () => {}
  };

  state = {
    result: [],
    text: this.props.query.key || ""
  };

  /**
   *
   *
   * @param {*} value
   */
  handleSearch = value => {
    this.props.simpleQuery(value);
  };

  InputOnBlur = e => {
    //this.props.queryOnFocus(false)
  };

  /**
   *
   *
   * @param {*} e
   */
  handleSubmit = e => {
    const text = e.trim();
    if (text.length > 0 && e.which === 13) {
      this.props.onQuery();
    }
  };

  /**
   *
   *
   * @param {*} e
   */
  handleSelect = e => {
    const text = e.trim().split(",")[0];
    this.props.onQuery(text);
  };

  /**
   *
   *
   * @param {*} e
   */
  handleChange = e => {
    let text = e ? e.trim().split(",")[0] : "";
    this.props.changeQueryKey(text, "name");
  };

  clearKeys = () => {
    this.props.clearSimpleResult();
  };

  onThematicBtn = () => {
    if (this.props.sidebar.module == 3 && this.props.sidebar.show) {
      this.props.showSidebar(false, "3");
    } else {
      this.props.showSidebar(true, "3");
    }
  };

  onRoutingBtn = () => {
    if (this.props.sidebar.module == 2 && this.props.sidebar.show) {
      this.props.showSidebar(false, "2");
    } else {
      this.props.showSidebar(true, "2");
    }
  };

  render() {
    const simpleresult = this.props.query.simpleresult;

    function renderOption(item) {
      return (
        <Option key={item.id} value={item.name + "," + item.id}>
          <Icon type="search" /> {item.name}
          {item.duplicate && (
            <span className="search-item-class">
              {item.midbclass + " " + item.district}
            </span>
          )}
        </Option>
      );
    }
    // const children = simpleresult&&simpleresult.length>0 && simpleresult.map((item,index) => {

    // }).concat([
    //     <Option disabled key="clear" className="show-all">
    //       <a style={{float:'right'}} onClick={()=>this.clearKeys()}>
    //         清除结果
    //       </a>
    //     </Option>]);

    return (
      <Card className="searchbar_card" bordered={false}>
        <AutoComplete
          className=""
          style={{ width: 460 }}
          onFocus={() => this.props.queryOnFocus(true)}
          onSearch={this.handleSearch}
          onKeyDown={this.handleSubmit}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          value={this.props.query.key}
          options={simpleresult.map(renderOption)}
        >
          <Input.Search  addonBefore={<Icon type="more" />} size="large" placeholder="请输入关键字" enterButton />
        </AutoComplete>
      </Card>
    );
  }
}

export default connect(
  state => {
    return { query: state.query, sidebar: state.sidebar };
  },
  {
    onQuery: query,
    simpleQuery,
    resetQuery,
    queryOnFocus,
    changeQueryKey,
    clearSimpleResult,
    showSidebar
  }
)(SearchBar);
