/*
 * @Author: 史涛 
 * @Date: 2019-01-05 19:30:19 
 * @Last Modified by: 史涛
 * @Last Modified time: 2019-03-04 10:09:20
 */
require('leaflet.sync')
const LMap = require('../../components/map/Map');
const LLayer = require('../../components/map/Layer');
import {changeCompareLayer} from '../../actions/config';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
const assign = require('object-assign');
import { Radio,Select} from 'antd';
const Option = Select.Option;
const SwipeControl = require('../../utils/map/SwipeControl');
const { GeoWMTS,
    GeoTDTWMTS } = require('../../utils/map/WMTS.TDT');



export class ScreemCompare extends Component {
    static propTypes = {
        map: PropTypes.object,
    };

    state = {
        model: 'screem',
        leftgroup: "矢量地图",
        rightgroup: "影像2003"
    };

    handleModelChange = (e) => {
        this.setState({ model: e.target.value });
        if(e.target.value==="screem"){
            this.refs.screemmap.map.addControl(this.control);
        }else{
            this.refs.screemmap.map.removeControl(this.control);
        }
    }

    changeLayer(name,type){
        // let compare = Object.assign({}, this.props.mapConfig.compare);
        // compare[type] = name==='矢量地图'?name:'影像'+name;
        // this.props.changeCompareLayer(compare);

        if(type=='leftgroup'){
            this.setState({leftgroup: name==='矢量地图'?name:'影像'+name},()=>{this.addCompareLayers()})
        }else{
            this.setState({rightgroup: name==='矢量地图'?name:'影像'+name},()=>{this.addCompareLayers()})
        }
    }

    addCompareLayers=()=>{
        let slayers = this.props.mapConfig.layers;
        if(this.control){
            this.refs.screemmap.map.removeLayer(this.upgroup);
            this.refs.screemmap.map.removeLayer(this.downgroup);
            this.refs.screemmap.map.removeControl(this.control);
        }
        this.upgroup = L.layerGroup();
        this.downgroup = L.layerGroup();
        slayers.map((layer) => {
            let clayer = assign({}, layer);
            //克隆图层属性,不影响主地图的显示
            clayer.visibility = true;

            if (this.state.leftgroup=== clayer.group) {
                this.upgroup.addLayer(L.geoTDTWMTSLayer(clayer.url, clayer));
            }
            if(this.state.rightgroup== clayer.group) {
                this.downgroup.addLayer(L.geoTDTWMTSLayer(clayer.url, clayer));
            }

        });
        this.control = new SwipeControl(this.downgroup, this.upgroup);
        this.refs.screemmap.map.addLayer(this.upgroup);
        this.refs.screemmap.map.addLayer(this.downgroup);
        this.control.addTo(this.refs.screemmap.map);

        //修复年份点击后会有卷帘效果
        if(this.state.model === "screem"){
            this.refs.screemmap.map.addControl(this.control);
        }else{
            this.refs.screemmap.map.removeControl(this.control);
        }
    }


    componentDidMount() {
        this.addCompareLayers();
    }

    render() {
        const  years=['矢量地图','2003', '2006', '2009','2010','2011', '2012', '2013', '2014', '2015', '2016','2017','2018'];
        return (
            <div className="ScreemCompare_panel">
               
                <div className="toolbar">
                <Radio.Group  value={this.state.model} onChange={this.handleModelChange}>
                    <Radio.Button value="pan">平移</Radio.Button>
                    <Radio.Button value="screem">对比</Radio.Button>
                </Radio.Group>
                <Select defaultValue="矢量地图" dropdownClassName="compare_dropdown" onChange={(value)=>this.changeLayer(value,'leftgroup')}>
                {years.map(year => year==='矢量地图'?<Option key={year}>{year}</Option>:<Option key={year}>影像{year}</Option>)}

                </Select>
                <Select defaultValue="2003"  dropdownClassName="compare_dropdown" onChange={(value)=>this.changeLayer(value,'rightgroup')}>
                {years.map(year => year==='矢量地图'?<Option key={year}>{year}</Option>:<Option key={year}>影像{year}</Option>)}
                </Select>
                </div>
                
                <LMap id="screemmap" ref="screemmap" zoom={this.props.mapConfig.map.zoom} center={this.props.mapConfig.map.center}   >
                </LMap>
            </div>
        )
    }
}

export default connect((state) => {
    return { mapConfig: state.mapConfig }
}, {changeCompareLayer})(ScreemCompare);
