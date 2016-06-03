/**
 * Created by tedshaffer on 6/3/16.
 */
require('../less/main.less');

'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';
import { Router, browserHistory, hashHistory } from 'react-router';
import reducers from './reducers';
// import routes from './routes';
import { Route } from 'react-router';

const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);

import App from './components/app';

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <Router history={hashHistory}>
            <Route path="/" component={App} />
        </Router>
    </Provider>
    , document.getElementById('content'));
