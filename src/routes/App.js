
import React from 'react';
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom'
import ScrollToTop from '../utils/scrolltotop';
import mapclient from './MapClient/index';
import { Provider } from 'react-redux';
import {ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import store from '../store/createStore';


const App = () => (
    <Provider store={store}>
        <ConfigProvider locale={zh_CN}>
            <HashRouter>
                <ScrollToTop>
                    <div>
                        <Switch>
                            <Route exact path="/" component={mapclient} />
                        </Switch>
                    </div>
                </ScrollToTop>
            </HashRouter>
        </ConfigProvider>
    </Provider>


);

export default App;

