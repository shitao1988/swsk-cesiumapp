import React from "react";
import { message, Card, Icon, Tag, Input, Row, Col, List, Avatar, Spin } from "antd";
import "./less/component.less";
import axios from "axios";
const { Search } = Input;
const { CheckableTag } = Tag;



class CKTag extends React.Component {
    state = { checked: false };

    handleChange = checked => {
        this.setState({ checked });
    };

    render() {
        return (
            <CheckableTag
                {...this.props}
                checked={this.state.checked}
                onChange={this.handleChange}
            />
        );
    }
}

export class SelectTab extends React.Component {
    constructor(props) {
        super(props);
        this.sl_valueRef = ref=>{
            this.refDom = ref;
        }
        this.state = {
            hoverColor: "#e4393c",
            extend:false,
            tools:false,
            singleCheckValue:props.selectedid||"",
            name:props.name?props.name:"name",
            value:props.value?props.value:"value",
            type:props.type?props.type:"Single",
            datas:[]
        };
    }
    extMore = () => {

    }
    extMultiple = () => {

    }
    handleChange = () => {

    }
    resize=()=>{
        const {scrollHeight,clientHeight} = this.refDom;
        if(scrollHeight>clientHeight){
            this.setState({
                tools:true
            })
        }else{
            this.setState({
                tools:false
            })
        }
    }
    extend = ()=>{
        this.setState({
            extend:!this.state.extend
        })
    }

    UNSAFE_componentWillMount(){
        if(this.props.datas){
            this.setState({
                datas:this.props.datas.map(data=>{
                    data.state = false;
                    return data;
                })
            })
        }else if(this.props.url){
            this.getDatas();
        }

        if(this.props.extendTool){

        }
    }
    componentDidMount() {
        //处理列表数据
        const {scrollHeight,clientHeight} = this.refDom;
        if(scrollHeight>clientHeight){
            this.setState({
                tools:true
            })
        }else{
            this.setState({
                tools:false
            })
        }
        
        window.addEventListener('resize', this.resize);
    }
    componentWillUnmount(){
        window.removeEventListener('resize',this.resize);
    }
    getDatas = ()=>{
        let url = ServerUrl + this.props.url;
        axios.get(url).then(res => {
            if(this.props.getDatas){
                this.props.getDatas.bind(this)(res.data);
                // this.props.getDatas(res.data);
            }else{
                res = res.data;
                if (res.code == 1) {
                    this.setState({ datas:res.result },()=>{
                        this.resize()
                    });
                }
                // message.info(res.msg);
            }
            
        });
    }
    tagChange=tagnode=>{
        let { datas } = {...this.state}
        datas.forEach(item=>{
            if(item[this.state.value] == tagnode.value){
                item.state = !item.state;
            }
        })
        this.setState({
            datas
        },()=>{
            if(this.props.onChange){
                //组织已选择的tag数据
                let values = [];
                datas.forEach(item=>{
                    if(item.state){
                        values.push(item[this.state.value])
                    }
                })
                this.props.onChange(values.join(","))
            }
        })
        
    }
    tagChangeSingle = tagnode=>{
        if(this.state.singleCheckValue == tagnode[this.state.value]){
            this.setState({
                singleCheckValue:""
            },()=>{
                if(this.props.onChange){
                    this.props.onChange(this.state.singleCheckValue)
                }
            })
        }else{
            this.setState({
                singleCheckValue:tagnode[this.state.value]
            },()=>{
                if(this.props.onChange){
                    this.props.onChange(this.state.singleCheckValue)
                }
            })
        }
        
        
    }
    
    render() {
        return (
            <Row className={this.state.extend?`${this.props.className} extend selectorLine`:`${this.props.className} selectorLine`}>
                <Col className="sl-key"><span>{this.props.title}</span></Col>
                {this.props.extendTool?<Col className="sl-key sl-tools">{this.props.extendTool.component}</Col>:null}
                <div className="ant-col sl_value" ref={this.sl_valueRef} id="sl_value">
                    {this.state.datas?this.state.datas.map(item => {
                        if(this.state.type=="Multiple"){
                            return <CheckableTag checked={item.state} value={item[this.state.value]} onChange={()=>{this.tagChange(item)}}>{item[this.state.value]}</CheckableTag>
                        }else if(this.state.type=="Single"||!this.state.type){
                            return <CheckableTag checked={this.state.singleCheckValue==item[this.state.value]} value={item[this.state.value]} onChange={()=>{this.tagChangeSingle(item)}}>{item[this.state.name]}</CheckableTag>
                        }
                        
                    }):null}
                </div>
                {this.state.tools?(<Col className="sl-ext">
                    {this.state.extend?<span onClick={this.extend}>收起<Icon type="up" /></span>:<span onClick={this.extend}>更多<Icon type="down" /></span>}
                    {/* <span><Icon type="plus" />多选</span> */}
                </Col>):null}
                
            </Row>
        )
    }
}