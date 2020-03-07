/*
 * @Author: 史涛 
 * @Date: 2019-01-05 19:36:13 
 * @Last Modified by: 史涛
 * @Last Modified time: 2019-04-08 15:28:37
 */
import React from 'react';
import TweenOne from 'rc-tween-one';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';

class Footer extends React.Component {

    static defaultProps = {
        className: 'footer0'
    };

    render () {
        const props = { ...this.props };
        delete props.isMobile;

        return (<OverPack
            {...props}
            playScale={0.05}
            location={props.id}
        >
            <TweenOne
                animation={{ y: '+=30', opacity: 0, type: 'from' }}
                key="footer"
            >
                <span id={`${props.id}-content`}>
                    <div className={`${props.className}-links`}>
                        <span><font>友情链接</font></span>
                    </div>
                    <div className={`${props.className}-linkscontent`}>
                        <a href="https://www.tianditu.gov.cn/" target="_blank">国家天地图</a>&nbsp; &nbsp;&nbsp; &nbsp;
	            <a href="http://jiangsu.tianditu.gov.cn/server/index" target="_blank">江苏天地图</a>&nbsp; &nbsp;&nbsp; &nbsp;
	            <a href="http://www.ngcc.cn/ngcc/ " target="_blank">国家基础地理信息中心</a>&nbsp; &nbsp;&nbsp; &nbsp;
	            <a href="http://www.jiangsu.gov.cn/" target="_blank">江苏省人民政府网</a>
                    </div>
                    {/* <div>
                        版权所有 : <font>四维时空信息技术有限公司</font>&nbsp; &nbsp;
	        	技术支持: <font>四维时空信息技术有限公司</font>
                    </div> */}
                    <div>
                        {/* 地址: 如城镇宁海路269号 &nbsp; &nbsp;
                        电话: (0513)87514718 &nbsp; &nbsp;
                        咨询电话: (0513)87514718 &nbsp; &nbsp; */}
                    </div>
                </span>
            </TweenOne>
        </OverPack>);
    }
}

export default Footer;
