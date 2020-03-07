import React, { Component } from 'react';
import { connect } from 'react-redux';
import centroid from '@turf/centroid';
import {
    setAreaLocation,
    selectAreaLocation
} from './actions';
import {addSourceAndLayers,updateSource,updateLayer,zoomToPoint3D} from '../../components/MapBoxGL/actions'

import {zoomToPoint} from '../../actions/map'

import { Card, Dropdown, Icon, Row, Col } from 'antd';
import quhuadata from './data';
import './arealocation.css'

class AreaLocation extends Component {
    UNSAFE_componentWillMount() {
        this.props.setAreaLocation(quhuadata);
        this.props.updateSource("arealocation",{
            "type": "geojson",
            "data": quhuadata
          })
    }

    handleMenuClick = (area) => {
        if(area=='全市'){
            this.props.zoomToPoint({ x: this.props.mapConfig.map.center.x, y: this.props.mapConfig.map.center.y }, this.props.mapConfig.map.zoom);
            this.props.zoomToPoint3D({ x: this.props.mapConfig.map.center.x, y: this.props.mapConfig.map.center.y }, this.props.mapConfig.map.zoom);
        }
        this.props.selectAreaLocation(area);
        this.props.updateLayer('arealocation-outline',["all", ["==", "XZQMC", area]])

        this.props.arealocation.result.features.forEach(ele => {
            if (ele.properties.XZQMC === area) {
                let center=centroid(ele.geometry)
                this.props.zoomToPoint3D({ x: center.geometry.coordinates[0], y: center.geometry.coordinates[1] },13);
            }
        });

        
       
    }
    render() {
        const quhuaarray = ['梁溪区', '滨湖区', '锡山区', '惠山区', '新吴区','经济开发区']
        const menu = (

            <div className="ant-dropdown-menu arealist customscrollbar" >
                <Row >
                    <Col span={3}><a onClick={() => this.handleMenuClick('全市')} type="dashed">全市</a></Col>
                    {quhuaarray.map(ele => {
                        return <Col key={ele} span={3}><a onClick={() => this.handleMenuClick(ele)} type="dashed">{ele}</a></Col>
                    })}
                    <Col span={4}><a onClick={() => this.handleMenuClick('宜兴市')} type="dashed">宜兴市</a></Col>
                    <Col span={3}><a onClick={() => this.handleMenuClick('江阴市')} type="dashed">江阴市</a></Col>
                </Row>
                <div className="divide"></div>
                {quhuaarray.map(qh => {
                    return <Row key={qh} >
                        <Col span={5}><a onClick={() => this.handleMenuClick(qh)} type="dashed">{qh}</a></Col>
                        <Col span={19}>{this.props.arealocation.result && this.props.arealocation.result.features.map(ele => {
                            if (ele.properties.QHMC === qh) {
                                return <a  key={ele.properties.XZQMC} className="street" onClick={() => this.handleMenuClick(ele.properties.XZQMC)} type="dashed">{ele.properties.XZQMC}</a>
                            }

                        })}</Col>
                    </Row>
                })}
            </div>
        );
        return (
            <div style={{ float: "left" }}>
                <Dropdown overlay={menu}>
                    <button type="button" className="ant-btn toolbar_btn">{this.props.arealocation.currentarea || '无锡市'}<Icon type="down" /></button>
                </Dropdown>

            </div>
        );
    }
}


export default connect((state) => {
    return { arealocation: state.arealocation,mapConfig:state.mapConfig }
}, { setAreaLocation, selectAreaLocation,zoomToPoint,addSourceAndLayers,updateSource,updateLayer,zoomToPoint3D})(AreaLocation);
