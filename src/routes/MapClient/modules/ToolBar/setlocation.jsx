/*
 * @Author: 史涛 
 * @Date: 2019-01-05 19:30:24 
 * @Last Modified by: 史涛
 * @Last Modified time: 2019-04-16 11:45:07
 */

import { zoomToPoint } from '../../actions/map';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Row, Col, Input, Button,message } from 'antd';
var assign = require('object-assign');
const InputGroup = Input.Group;

export class SetLocation extends Component {
    static propTypes = {
        map: PropTypes.object,
    };

    state = {
        lng: null,
        lat: null,
    }
    componentDidMount() {

    }
    changeLng = e => {
        this.setState({
            lng: Number(e.target.value),
        })
    }

    changeLat = e => {
        this.setState({
            lat: Number(e.target.value),
        })
    }

    setView = ()=> {
        if(!this.state.lng){
            message.info('请输入经度');
        }else if(!this.state.lat){
            message.info('请输入维度');
        }else{
            this.props.zoomToPoint({ x: this.state.lng, y: this.state.lat }, 16);
        }
    }
    render() {
        return (
            <div>
                <InputGroup compact>
                    <Input allowClear placeholder="请输入经度" onChange={this.changeLng} />
                    <Input allowClear placeholder="请输入维度" onChange={this.changeLat} />
                    <Button type="primary" onClick={() => this.setView()}>定位</Button>
                    <Button onClick={this.props.onClose}>关闭</Button>
                </InputGroup>
            </div>
        )
    }
}

export default connect((state) => {
    return {}
}, { zoomToPoint })(SetLocation);
