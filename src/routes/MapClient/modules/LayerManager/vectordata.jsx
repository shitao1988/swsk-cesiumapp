/*
 * @Author: 史涛 
 * @Date: 2019-01-05 19:27:09 
 * @Last Modified by: 史涛
 * @Last Modified time: 2019-03-02 16:05:06
 */
import { Button, Input, Slider, Checkbox,Icon} from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ListSort from './ListSort';
import { LoadResourcesList, ShowRes, ChangeOpacity_Res, ChangeIndex_Res, addResources } from "./actions";
import './style.less';


class VectorData extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    className: 'list-sort-service',
  };

  state={
    features:[],
    filename:'',
  }

  componentDidMount() {
    this.props.LoadResourcesList();
  }

  handlefileChange = (files) => {
    this.loadMultiple(files);
  }

  load = (file, ext) => {
    let parser,
      reader;

    if (this._isParameterMissing(file, 'file')) {
      return false;
    }

    if (!this._isFileSizeOk(file.size)) {
      return false;
    }

    parser = this._getParser(file.name, ext);
    if (!parser) {
      return false;
    }

    reader = new FileReader();
    reader.onload = (e) => {
      parser.processor.call(this, e.target.result,parser.name, parser.ext)
    };

    if (!file.testing) {
      reader.readAsText(file);
    }
    return reader;
  }

  _isParameterMissing = (v, vname) => {
    if (typeof v === 'undefined') {
      return true;
    }
    return false;
  }

  _getParser = (name, ext) => {
    let parser;
    ext = ext || name.split('.').pop();
    parser = this._loadGeoJSON;
    return {
      processor: parser,
      ext: ext,
      name:name.split('.')[0]
    };
  }

  _loadGeoJSON = (content,name) => {
    if (typeof content === 'string') {
      content = JSON.parse(content);
      this.props.addResources({"type": "vector",
      "id": new Date().getTime(),
      "name": name,
      "visibility": false,
      "features":content.features})
    }
  }

  _isFileSizeOk = (size) => {
    let fileSize = (size / 1024).toFixed(4);
    if (fileSize > 1024) {
      return false;
    }
    return true;
  }

  loadMultiple = (files, ext) => {
    let readers = [];
    if (files[0]) {
      files = Array.prototype.slice.apply(files);
      while (files.length > 0) {
        readers.push(this.load(files.shift(), ext));
      }
    }
    // return first reader (or false if no file),
    // which is also used for subsequent loadings
    return readers;
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
        this.props.ChangeIndex_Res(Number(el.key), index);
      });
    }

    //  this.props.ChangeIndex_Res(0,3);

  }


  render() {
    const childrenToRender = []
    this.props.layermanager.reslist.map((item, i) => {
      const {
        id, name,
      } = item;
      if (item.type != 'vector') return;
      childrenToRender.push(
        <div key={i} className={`${this.props.className}-list`}>
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

        <span class="fileinput-button">
         <Button
            type="dashed"
            style={{ width: "100%" }}
          >
            新增
          </Button>
          <Input
            type="file"
            style={{ width: "100%"}}
            accept=".json,.geojson"
            onChange={(e) => this.handlefileChange(e.target.files)}
          >
          </Input>
        </span>
         
          <ListSort
            dragClassName="list-drag-selected"
            onChange={(e) => { this.sortChange(e) }}
            appearAnim={{ animConfig: { marginTop: [5, 30], opacity: [1, 0] } }}
          >
            {childrenToRender}
          </ListSort>
        </div>
      </div>

    );
  }
}

export default connect((state) => {
  return { layermanager: state.layermanager }
}, {
    LoadResourcesList, ShowRes, ChangeOpacity_Res, ChangeIndex_Res, addResources
  })(VectorData);
