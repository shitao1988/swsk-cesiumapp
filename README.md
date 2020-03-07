### 目录结构

```bash
├── public                  # 公共静态资源及编译文件
└── src                     # 应用源文件
   ├── index.jsx            # 程序启动和渲染入口
   ├── components           # 全局可复用组件
   ├── routes               # 路由
   │   ├── App.js           # 主路由
   │   ├── LandingPage      # 路由页面-首页
   │   │   ├── index.js     # 首页主页面
   │   │   ├── assets       # 组件的静态文件
   │   │   ├── components   # 展示组件
   │   │   └── routes **    # 子路由
   │   └── MapClient        # 路由页面-电子地图
   │       ├── index.js     # 路由定义
   │       ├── container    # 容器组件
   │       ├── modules      # module(reducers/constants/actions)
   │       └── routes **    # 子路由
   ├── store                # Redux相关模块
   │   ├── createStore.js   # 创建和使用redux store  
   │   └── reducers.js      # Reducer的注册和注入
   ├── themes               # 主题样式表
   └── utils                # 通用工具类
``` 

### 脚本
- 更新库    npm install
- 编译      npm run dll   # 打包第三方库代码（首次运行或升级第三方库后执行）
- 编译代码  npm run build      # 打包到 ./public/dist 
- 运行代码  npm run dev        # 启动<http://localhost:8080> 
 

### 脚手架
控件
https://ant-design.gitee.io/index-cn

首页模板
https://landing.ant.design/index-cn

https://github.com/facebook/create-react-app