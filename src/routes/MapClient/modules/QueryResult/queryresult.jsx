/*
 * @Author: 史涛 
 * @Date: 2019-01-05 19:29:12 
 * @Last Modified by: 史涛
 * @Last Modified time: 2019-01-27 21:46:44
 */
import React, { Component } from 'react'
var PropTypes = require('prop-types');
import { Card, Tabs, Popover, Button, Row, Col } from 'antd';
import './queryresult.less';
import ResultList from './resultlist';
import { poiclass } from '../../../../utils/data/poiclass';
import { connect } from 'react-redux';
import { collapseResult, changeQueryAreaKey, onHotQuery, changeQueryKey } from '../../actions/query'





export class QueryResult extends Component {

    static propTypes = {
        query: PropTypes.object
    };
    static defaultProps = {
        query: {}
    };
    state = {
        hide: false,
    }
    handleClickOutside = evt => {
        this.state.hide = true;
    };

    handleMenuClick = (leve, area) => {
        this.props.onHotQuery(leve, area, 'fq');
        this.props.changeQueryAreaKey(area, leve)
    }

    handleClassMenuClick = (leve, type) => {
        this.props.onHotQuery(leve, type, 'q')
        this.props.changeQueryKey(type, leve);
    }




    render() {
        const quhuaarray = ['梁溪区', '滨湖区', '锡山区', '惠山区', '新吴区']
        const areamenu = (


            <div className="searcharealist customscrollbar" >
                <Row type="flex" justify="start">
                    <Col span={3}><a onClick={() => this.handleMenuClick('district', null)} type="dashed">全部</a></Col>
                    {quhuaarray.map(ele => {
                        return <Col key={ele} span={3}><a onClick={() => this.handleMenuClick('district', ele)} type="dashed">{ele}</a></Col>
                    })}

                </Row>
                <div className="divide"></div>
                {quhuaarray.map(qh => {
                    return <Row key={qh} type="flex" justify="start">
                        <Col span={4}><a onClick={() => this.handleMenuClick('district', qh)} type="dashed">{qh}</a></Col>
                        <Col span={20}>{this.props.arealocation.result && this.props.arealocation.result.features.map(ele => {
                            if (ele.properties.QHMC === qh) {
                                return <a key={ele.properties.XZQMC} className="street" onClick={() => this.handleMenuClick('street', ele.properties.XZQMC)} type="dashed">{ele.properties.XZQMC}</a>
                            }

                        })}</Col>
                    </Row>
                })}




            </div>
        );
        let bigclass = '';

        if (this.props.query.type === 'bigclass') {
            bigclass = this.props.query.key
        } else if (this.props.query.type === 'midbclass') {
            poiclass.forEach(poi => {
                if (poi.midbclass === this.props.query.key) {
                    bigclass = poi.bigclass;
                }
            });
        }

        const classmenu = (
            <div>{
                poiclass.map(ele => {
                    if (ele.bigclass === bigclass) {
                        return <p><a className="query_class_item" onClick={() => this.handleClassMenuClick('midbclass', ele.midbclass)} type="dashed">{ele.midbclass}</a></p>
                    }
                })
            }
            </div>
        );

        const ordermenu = (
            <div>
                <p>默认排序</p>
            </div>
        );
        return (
            <div>

                <div className={this.props.query.result ? '' : 'hidden'} >
                    {this.props.query.resultcollapsed?
                        <Card className="queryresult_smallcontaintcard" onMouseEnter={() => { this.props.collapseResult(false) }} >返回结果列表</Card> :
                        <Card className="queryresult_containtcard " >
                            {
                               this.props.query.result.docs !== undefined && this.props.query.result.docs.length !== 0 ? 
                                (< Button.Group style={{ "margin": "10px 40px" }} >
                                    <Popover placement="bottomLeft" overlayClassName="areaselect" content={areamenu} trigger="click">
                                        <Button>{this.props.query.areakey || '所有区域'}</Button>
                                    </Popover>
                                    {this.props.query.type === 'name' ? <Button>{this.props.query.key || '所有分类'}</Button> : <Popover placement="bottom" content={classmenu} trigger="click">
                                        <Button>{this.props.query.key || '所有分类'}</Button>
                                    </Popover>

                                    }

                                    <Popover placement="bottomRight" content={ordermenu} trigger="click">
                                        <Button>默认排序</Button>
                                    </Popover>

                                </ Button.Group>):''
                            }
                            <ResultList />
                        </Card>}

                </div>
            </div>

        )
    }
}
export default connect((state) => {
    return { query: state.query, arealocation: state.arealocation }
}, { collapseResult, changeQueryAreaKey, onHotQuery, changeQueryKey })(QueryResult);

