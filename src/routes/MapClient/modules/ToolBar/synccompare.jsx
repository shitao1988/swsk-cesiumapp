/*
 * @Author: 史涛 
 * @Date: 2019-01-05 19:30:24 
 * @Last Modified by: 史涛
 * @Last Modified time: 2019-10-25 16:05:21
 */
require('leaflet.sync')
var LMap = require('../../components/map/Map');
var LLayer = require('../../components/map/Layer');
import {changeCompareLayer} from '../../actions/config';
import { connect } from 'react-redux';
import HorizontalTimeline from 'react-horizontal-timeline';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Row, Col } from 'antd';
var assign = require('object-assign');


export class SyncCompare extends Component {
    static propTypes = {
        map: PropTypes.object,
    };

    state = {
        leftvalue: 0,
        rightvalue: 1,
        left_map_laiyuan:"国家天地图",
        right_map_laiyuan: "国家天地图"
    }


    renderLayers = (layers, type) => {

        if (layers) {
            if (layers.refreshing) {
                layers = layers.refreshing;
            }
            return layers.map((layer) => {
                if (this.props.mapConfig.compare[type] === layer.group) {
                    let clayer = assign({}, layer);
                    //克隆图层属性,不影响主地图的显示
                    clayer.visibility = true;
                    return <LLayer type={clayer.type} key={clayer.name} options={clayer} ></LLayer>;
                }
            });
        }
        return null;
    };

    changeLayer(name,type){
        let compare = Object.assign({}, this.props.mapConfig.compare);
        compare[type] = name;
        this.props.changeCompareLayer(compare);
    }




    componentDidMount() {
        var that = this;
        this.refs.leftmap.map.sync(this.refs.rightmap.map);
        this.refs.rightmap.map.sync(this.refs.leftmap.map);
        this.refs.rightmap.map.on('zoomend',function(){
            if (that.refs.leftmap.map.getZoom() >17){
                that.setState({ left_map_laiyuan: "无锡天地图" });
            } else {
                that.setState({ left_map_laiyuan: "国家天地图" });
            }
            if (that.refs.rightmap.map.getZoom() >17){
                that.setState({ right_map_laiyuan: "无锡天地图" });
            } else {
                that.setState({ right_map_laiyuan: "国家天地图" });
            }
        });
    }

    render() {
        const years = [{ title: '矢量地图', value: '2002' }, { title: '影像2003', value: '2003' }, { title: '影像2006', value: '2006' }, { title: '影像2009', value: '2009' },
        { title: '影像2010', value: '2010' }, { title: '影像2011', value: '2011' }, { title: '影像2012', value: '2012' }, { title: '影像2013', value: '2013' },
        { title: '影像2014', value: '2014' }, { title: '影像2015', value: '2015' }, { title: '影像2016', value: '2016' }, { title: '影像2017', value: '2017' }, { title: '影像2018', value: '2018' }];
        return (
            <div className="synccompare_panel">
                <Row gutter={16} style={{ 'height': '100%' }}>
                    <Col style={{ 'height': '99%' }} span={12} >
                        <div className="timelinediv" >
                            <HorizontalTimeline
                                styles={{
                                    background: "#f8f8f8",
                                    foreground: "#1A79AD",
                                    outline: "#fff"
                                }}
                                minEventPadding={0}
                                maxEventPadding={0}
                                labelWidth={80}
                                index={this.state.leftvalue}
                                indexClick={(index) => {
                                    this.setState({ leftvalue: index, previous: this.state.leftvalue });
                                    this.changeLayer(years[index].title,'leftgroup')
                                }}
                                values={years}
                                getLabel={(date, index) =>date} />

                        </div>

                        <LMap id="mapleft" ref="leftmap" zoom={this.props.mapConfig.map.zoom} center={this.props.mapConfig.map.center}   >
                            {this.renderLayers(this.props.mapConfig.layers, 'leftgroup')}
                        </LMap>
                        <div> &nbsp;&nbsp;地图来源:{this.state.left_map_laiyuan}</div>
                    </Col>
                    <Col style={{ 'height': '99%' }} span={12} >
                        <div className="timelinediv" >
                            <HorizontalTimeline
                                styles={{
                                    background: "#f8f8f8",
                                    foreground: "#1A79AD",
                                    outline: "#fff"
                                }}
                                minEventPadding={0}
                                maxEventPadding={0}
                                labelWidth={80}
                                index={this.state.rightvalue}
                                indexClick={(index) => {
                                    this.setState({ rightvalue: index, previous: this.state.rightvalue });
                                    this.changeLayer(years[index].title,'rightgroup')
                                }}
                                values={years}
                                getLabel={(date, index) =>date} />


                        </div>
                        <LMap id="mapright" ref="rightmap" zoom={this.props.mapConfig.map.zoom} center={this.props.mapConfig.map.center}   >
                            {this.renderLayers(this.props.mapConfig.layers, 'rightgroup')}
                        </LMap>
                        <div> &nbsp;&nbsp;地图来源:{this.state.right_map_laiyuan}</div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default connect((state) => {
    return { mapConfig: state.mapConfig }
}, {changeCompareLayer})(SyncCompare);
