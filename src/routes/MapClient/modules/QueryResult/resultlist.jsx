/*
 * @Author: 史涛 
 * @Date: 2019-01-05 19:29:16 
 * @Last Modified by: 史涛
 * @Last Modified time: 2019-12-23 22:53:46
 */
import React, { Component } from 'react';
import { List, Avatar, Icon } from 'antd';
import { connect } from 'react-redux';
import { changeQueryPageIndex,onHoverResult,onClickResult} from '../../actions/query';
import {zoomToPoint3D} from '../../components/MapBoxGL/actions'
const { throttle } = require('lodash');

export class ResultList extends Component {

    render() {
        const listData = [];
        if (!this.props.query.result) {
            return <div />;
        }
        this.props.query.result.docs.forEach(item => {
            listData.push({
                title: item.name,
                midbclass:item.duplicate?('('+item.midbclass+')'):'',
                id:item.id,
                x:Number(item.x),
                y:Number(item.y),
                address: item.address||'暂无',
                content: item.type,
                telephone:item.telephone||'暂无',
            });
        });
        

        return (
            <div>
            {
            	this.props.query.result.docs.length === 0 ?
            	(
            		<div className="no-data-text">
            			<p>未找到相关地点。</p>
						<p>您还可以：</p>						
						<ul>
						 	<li>检查输入是否正确或者输入其它词</li>
							<li>使用分类进行查找</li>
							<li>使用纠错功能对存在的问题进行上报</li>
						</ul>
            		</div>
            	):(
            		<div>
            		<List  ref="query_resultlist"
                    itemLayout="vertical"
                    size="large"
                    className="query_resultlist"
                    pagination={{
                        onChange: (page) => {
                            this.props.changeQueryPageIndex(page);
                            
                        },
                        total: this.props.query.result.numFound,
                        pageSize: 10, size: "small"
                    }}
                    dataSource={listData}
                    renderItem={(item,index) => (
                        <List.Item onClick={()=>{this.props.onClickResult(item.id);this.props.zoomToPoint3D({x:item.x,y:item.y},16)}} onMouseOver ={()=>this.props.onHoverResult(item.id)}  onMouseOut={()=>this.props.onHoverResult(null)} 
                            key={item.id}>
                            <List.Item.Meta
                                title={<div><a ><span className="extra-marker" >{index+1}</span>{item.title}</a><span style={{fontSize:'small'}}>{item.midbclass}</span></div>}
                                description={<div><p >{'地址:'+item.address}</p><p>{'电话:'+item.telephone}</p></div>}
                            />
                           {/*  {item.content} */}
                        </List.Item>
                    )}
                />
                <span className="resultcount_span">共找到{this.props.query.result.numFound}个结果 耗时{this.props.query.responsetime}</span>
               </div>
            	)
            }
               
            </div>
        )
    }
};

export default connect((state) => {
    return { query: state.query }
}, { changeQueryPageIndex,onHoverResult,onClickResult,zoomToPoint3D})(ResultList);


