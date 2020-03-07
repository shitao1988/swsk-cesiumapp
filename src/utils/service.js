/*
 * @Author: your name
 * @Date: 2020-01-13 10:15:17
 * @LastEditTime : 2020-01-13 20:41:53
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \portal\src\utils\service.js
 */
/* eslint-disable no-console */
import axios from 'axios';
import Cookies from 'js-cookie';
import {
    message
} from 'antd';
import {
    getCookie
} from './UserInfoUtils';

let service = {};

axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么，例如加入token
    let token = getToken();
    config.headers.token = token;
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    // 在接收响应做些什么，例如跳转到登录页
    return response;
}, function (error) {
    // 对响应错误做点什么
    if (error.response && error.response.status === 401) {
        message.error('未登录或长时间未进行操作，即将返回登录界面...');
        setTimeout(() => {
            Cookies.remove('userinfo', null);
            Cookies.remove('token', null);
            if (document.referrer === '') {
                window.location.href = '/';
            } else {
                window.location.href = document.referrer;
            }
        }, 1000);
    } else {
        message.error('服务请求失败，请稍候重试或联系管理员。');
        try {
            if (ecallback) ecallback(error);
            return new Promise((resolve, reject) => {
                reject(error)
            })
        } catch (e) {
            console.log(e);
            return new Promise((resolve, reject) => {
                reject(e)
            })
        }
    }
    return Promise.reject(error);
});

service.post = function ( url, params, callback, ecallback) {
    if (!url.startsWith('http://') && !url.startsWith('../')) {
        url = ServerUrl + url;
    }
    axios.post(url, JSON.stringify(params), {
            responseType: 'text'
        })
        .then(res => {
            let result = res.data;
            try {
                if (callback) callback(result);
                else {
                    return new Promise((resolve, reject) => {
                        resolve(res.data)
                    })
                }
            } catch (e) {
                console.log(e);
                return new Promise((resolve, reject) => {
                    reject(e)
                })
            }
        })
        .catch(function (error) {
            if (error.response && error.response.status === 403) {
                message.error('未登录或长时间未进行操作，即将返回登录界面...');
                setTimeout(() => {
                    Cookies.remove('userinfo', null);
                    Cookies.remove('token', null);
                    if (document.referrer === '') {
                        window.location.href = '/';
                    } else {
                        window.location.href = document.referrer;
                    }
                }, 1000);
            } else {
                message.error('服务请求失败，请稍候重试或连接管理员。');
                try {
                    if (ecallback) ecallback(error);
                    else {
                        return new Promise((resolve, reject) => {
                            reject(error)
                        })
                    }
                } catch (e) {
                    console.log(e);
                    return new Promise((resolve, reject) => {
                        reject(error)
                    })
                }
            }
        });
};

service.get = function ( url, params, callback, ecallback) {
    if (!url.startsWith('http://') && !url.startsWith('../')) {
        url = ServerUrl + url;
    }
    axios.get(url, {
        params: params
    }, {
        responseType: 'text',
    }).then(res => {
        let result = res.data;
        try {
            if (callback) callback(result);
        } catch (e) {
            console.log(e);
            return new Promise((resolve, reject) => {
                reject(e)
            })
        }
    }).catch(function (error) {
        
    });
};

function getToken() {
    return getCookie("userinfo") ? JSON.parse(getCookie('userinfo')).geokey : null;
}
service.getToken = getToken;
export default service;