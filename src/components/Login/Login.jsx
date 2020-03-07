/*
 * @Author: 史涛 
 * @Date: 2019-01-05 19:28:54 
 * @Last Modified by: 史涛
 * @Last Modified time: 2019-01-15 17:14:20
 */
import React from 'react';
import axios from 'axios';
import md5 from 'js-md5';
import Vcode from 'react-vcode';
import qs from 'qs';
import { setCookie } from '../../utils/UserInfoUtils'

import { Form, Icon, Input, Button, message, Row, Col } from 'antd';


const FormItem = Form.Item;


class Login extends React.Component {
    state = {
        vcode: '',
    }
    handleLogin = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                axios.post(ServerUrl+ "/core/system/login", qs.stringify({
                    userName: values.userName,
                    password: md5(values.password)
                }), {
                    headers: { 'Content-Type': "application/x-www-form-urlencoded" },
                })
                    .then((response) => {
                        if (response.data.code != 0) {
                            message.info('登录成功');
                            setCookie("userid", response.data.result.userid, '0.5h');
                            setCookie("displayname", response.data.result.displayname, '0.5h');
                            setCookie("userinfo", JSON.stringify(response.data.result.userinfo), '0.5h')
                            if (window.sessionStorage) {

                                sessionStorage.setItem("userid", response.data.result.userid);
                                sessionStorage.setItem("username", response.data.result.username);
                                sessionStorage.setItem("userorg", response.data.result.userorg);
                                sessionStorage.setItem("userorgname", response.data.result.userorgname);
                                sessionStorage.setItem("displayname", response.data.result.displayname);
                                sessionStorage.setItem("geokey", response.data.result.geokey);
                            }
                            if (document.referrer === '') {
                                window.location.href = '/';
                            } else {
                                window.location.href = document.referrer;
                            }

                        } else {
                            message.warning(response.data.msg);
                        }

                    }).catch((e) => {
                        message.warning('登录失败,请稍后再试');
                        console.log(e)
                    });
            }
        });
    }


    validateCaptcha = (rule, value, callback) => {
        if (value && value !== this.state.vcode) {
            callback('验证码不正确');
        } else {
            callback();
        }
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="form-con">
                {/* <strong>用户登录</strong> */}
                <p className="login-title">用户登录</p>
                <div className="login-divide">
                    <div className="login-divide-light"></div>
                </div>
                <Form onSubmit={this.handleLogin} className="login-form">
                    <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: '请输入用户名!' }],
                        })(
                            <Input size="large" className='login-input' prefix={<Icon type="user" />} placeholder="用户名/手机号" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码!' }],
                        })(
                            <Input size="large" className='login-input' prefix={<Icon type="lock" />} type="password" placeholder="密码" />
                        )}
                    </FormItem>
                    <FormItem>
                        <Row gutter={8}>
                            <Col span={12}>
                                {getFieldDecorator('captcha', {
                                    rules: [{ required: true, message: '请输入验证码!' }, {
                                        validator: this.validateCaptcha,
                                    }],

                                })(
                                    <Input size="large" className='login-input' prefix={<Icon type="key" />} placeholder="验证码" />
                                )}
                            </Col>
                            <Col span={12}>
                                <Vcode onChange={(v) => { this.setState({ vcode: v }) }} />
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Button style={{ fontSize: 16 }} type="primary" htmlType="submit" className="login-form-button">
                            登录</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default Form.create()(Login)




