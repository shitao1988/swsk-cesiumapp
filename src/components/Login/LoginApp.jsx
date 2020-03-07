/*
 * @Author: 史涛 
 * @Date: 2019-01-05 19:28:58 
 * @Last Modified by: 史涛
 * @Last Modified time: 2019-01-30 14:16:11
 */
import React from 'react';
import { Form, Tabs, Card } from 'antd';
import './Login.less';
import { enquireScreen } from 'enquire-js';
import Login from './Login';
let isMobile;
enquireScreen((b) => {
    isMobile = b;
});

class LoginApp extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        isMobile,
        show: !location.port,
        activeKey: 'login',
    }
    showPanel = (key) => {
        this.setState({
            activeKey: key,
        });

    };
    componentDidMount () {
        const ele = document.getElementById("loading");
        ele.style.display = "none";
        // 适配手机屏幕;
        enquireScreen((b) => {
            this.setState({ isMobile: !!b });
        });
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login-wrapper">
                <p className="system-title">如皋市时空大数据平台</p>
                <div className="login-logo"></div>
                <Card className="login-right">
                    <Login showPanel={this.showPanel}></Login>
                </Card>
                <p className="copyright">
                    ©2019 GEO 版权所有 <a href="#"></a>
                </p>
            </div>
        );
    }
}

export default Form.create()(LoginApp)




