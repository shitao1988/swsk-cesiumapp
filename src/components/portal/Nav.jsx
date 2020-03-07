/*
 * @Author: 史涛 
 * @Date: 2019-01-05 19:36:30 
 * @Last Modified by: 史涛
 * @Last Modified time: 2019-11-29 21:19:05
 */



import React from 'react';
import PropTypes from 'prop-types';
import TweenOne from 'rc-tween-one';
import { Menu, Avatar, Icon } from 'antd';
import { NavLink, withRouter } from 'react-router-dom';
import { loginout, login } from '../../utils/UserInfoUtils';
import logopng from '../../themes/style/images/logo/logo.png';
import { getCookie } from '../../utils/UserInfoUtils';

const Item = Menu.Item;
const SubMenu = Menu.SubMenu;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneOpen: false,
      applink: '/'
    };
  }
  static propTypes = {
    className: PropTypes.string,
    isMobile: PropTypes.bool,
    id: PropTypes.string,
  };
  
  static defaultProps = {
    className: 'header1',
  };
  
  handler = function () {
    let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    if (scrollTop < 800&&this.props.location.pathname === '/') {
      this.setState({
        background: 'transparent',
        
      });
    } else {
      this.setState({
        background: 'radial-gradient(circle, #353943, #2b303b)',
      });
    }
  };

  componentDidMount() {
    if (this.props.location.pathname === '/') {
      this.setState({
        background: 'transparent',
      });
    } 
    this.regScroll(this.handler.bind(this));
    //window.addEventListener('scroll', this.handler.bind(this),false)
  }


  componentWillUnmount() {
    window.onscroll = '';
    //window.removeEventListener('scroll', this.handler.bind(this),false)
  }
  //添加事件监听
  regScroll = (myHandler) => {
    if (window.onscroll === null) {
      window.onscroll = myHandler
    } else if (typeof window.onscroll === 'function') {
      var oldHandler = window.onscroll;
      window.onscroll = function () {
        myHandler();
        oldHandler();
      }
    }
  }

  render() {
    const props = { ...this.props };
    const isMobile = props.isMobile;
    const pathname = props.location.pathname;
    delete props.staticContext;
    delete props.isMobile;
    const navData = [{
      title: '首页',
      link: '/'
    },{
      title: '电子地图',
      link: '/mapclient'
    },{
      title: '数据中心',
      link: '/datacenterapp'
    },{
      title: '服务中心',
      link: '/servicecenter'
    }, {
      title: '应用中心',
      link: '/appcenter'
    },{
      title: '开发中心',
      link: '/developcenter'
    }]
     const displayname =getCookie('userinfo')&&JSON.parse(getCookie('userinfo')).displayname;
    if(displayname){
    //   navData.push({
    //     title: '展示中心',
    //     herf: '/mapshow/map.html'
    //   })
    //   navData.push({ title: '数据服务中心',
    //   herf: '/admin-dsc'})
    //   navData.push({ title: '运维中心',
    //   herf: '/omc'})

    navData.push( {
        title: '个人中心',
        link: '/personcenter'
      })
    }

    const navChildren = navData.map((item, i) => 
       {return item.link ? <Item key={item.link + i}><NavLink to={item.link} ><span>{item.title}</span></NavLink></Item>: <Item key={item.title} onClick={()=>{window.open(item.herf,"_blank")}}>{item.title}</Item>}

    );

    displayname ? navChildren.push
      (<SubMenu className="user" title={(<div>
        <span className="img">
          <Avatar style={{ backgroundColor: '#87d068' }} icon="user" />
        </span>
        <span>{displayname}</span>
      </div>)} key="user">
        <Item key="loginout" onClick={loginout}>退出</Item>
      </SubMenu>) :(navChildren.push(<Item key="login" onClick={login}>登录</Item>)) ;

    return (
      <TweenOne
        component="header"
        style={{ background: this.state.background }}
        animation={{ opacity: 1, type: 'from' }}
        {...props}
      >
        <TweenOne
          className={`${this.props.className}-logo`}
          animation={{ x: -30, delay: 100, type: 'from', ease: 'easeOutQuad' }}
          id={`${this.props.id}-logo`}
        >
          {/* <img width="100%" src={logopng} /> */}
          <NavLink to='/'><span className='logotitle'>如皋市时空大数据平台</span></NavLink> 
        </TweenOne>

        {isMobile ? (<div
          className={`${this.props.className}-phone-nav${this.state.phoneOpen ? ' open' : ''}`}
          id={`${this.props.id}-menu`}
        >
          <div
            className={`${this.props.className}-phone-nav-bar`}
            onClick={() => {
              this.phoneClick();
            }}
          >
            <em />
            <em />
            <em />
          </div>
          <div
            className={`${this.props.className}-phone-nav-text`}
          >
            <Menu
              defaultSelectedKeys={['0']}
              mode="inline"
              theme="dark"
            >
              { navChildren }             
            </Menu>           
          </div>
        </div>) :
          <TweenOne
            animation={{ x: 30, delay: 100, opacity: 0, type: 'from', ease: 'easeOutQuad' }}
            className={`${this.props.className}-nav`}
          >
            <Menu
              mode="horizontal" defaultSelectedKeys={['/home']} selectedKeys={[pathname]} onSelect={this.onSelect}
              id={`${this.props.id}-menu`}
              className="page"
            >
             { navChildren }
            </Menu> 
          </TweenOne>
        }
      </TweenOne>
     
    );
  }
}

export default withRouter(Header);