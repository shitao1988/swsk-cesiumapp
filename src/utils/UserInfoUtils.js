/*
 * @Author: 史涛 
 * @Date: 2019-01-05 19:32:17 
 * @Last Modified by: 史涛
 * @Last Modified time: 2019-12-14 21:05:21
 */
import axios from 'axios';
import qs from 'qs';
import Cookies from 'js-cookie';


function loginout() {

    if (loginCas) {
        delCookie("userinfo");
        delCookie("userid");
        delCookie("displayname");
        // var url = "./logout.jsp";
        window.open(LOGOUT_URL, '_self');
    } else {
        let token = JSON.parse(getCookie("userinfo")).geokey;
        axios.post(ServerUrl + "/core/system/logout", qs.stringify({
            token
        }), {
            headers: { 'Content-Type': "application/x-www-form-urlencoded" },
        }).then(response => {
            if (response.data.code != 0) {
                delCookie("userinfo");
                delCookie("userid");
                delCookie("displayname");
                if (document.referrer === '') {
                    window.location.href = './';
                } else {
                    window.location.href = document.referrer;
                }
            }
        })
    }
}

function login() {
    if (loginCas) {
        var url = "./reload.jsp";
        window.open(url, '_self');
    }else{
        window.location.href = "./#/loginapp/";;
    }
}

//读取cookies
function getCookie(name) {
    if (Cookies.get(name)) {
        return Cookies.get(name)
    } else {
        return null;
    }
    // var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)"); //正则匹配
    // if (arr = document.cookie.match(reg)) {
    //   return unescape(arr[2]);
    // }
    // else {
    //   return null;
    // }
}

//删除cookies
function delCookie(name) {
    Cookies.remove(name, { path: '/' })

    // var exp = new Date();
    // exp.setTime(exp.getTime() - 1);
    // var cval = getCookie(name);
    // if (cval != null) {
    //     document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    // }
}

//设置自定义过期时间cookie
function setCookie(name, value, time) {
    var msec = getMsec(time); //获取毫秒
    var exp = new Date();
    exp.setTime(exp.getTime() + msec * 1);
    Cookies.set(name, value, { expires: exp })
    // document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
//将字符串时间转换为毫秒,1秒=1000毫秒
function getMsec(str) {
    var timeNum = str.substring(0, str.length - 1) * 1; //时间数量
    var timeStr = str.substring(str.length - 1, str.length); //时间单位前缀，如h表示小时
    if (timeStr == "s") { //20s表示20秒
        return timeNum * 1000;
    } else if (timeStr == "h") { //12h表示12小时
        return timeNum * 60 * 60 * 1000;
    } else if (timeStr == "d") {
        return timeNum * 24 * 60 * 60 * 1000;
    } //30d表示30天
}

export {
    loginout,
    login,
    getCookie,
    setCookie,
    delCookie
};