/**
 * Created by tedshaffer on 6/3/16.
 */
require('../less/main.less');

'use strict';

import thunkMiddleware from 'redux-thunk';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';
import { Router, browserHistory, hashHistory } from 'react-router';
import reducers from './reducers';
// import routes from './routes';
import { Route } from 'react-router';

// const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);

import App from './components/app';


// const store = createStore(
//     rootReducer,
//     applyMiddleware(
//         thunkMiddleware, // lets us dispatch() functions
//         loggerMiddleware // neat middleware that logs actions
//     )
// )
//
// store.dispatch(selectSubreddit('reactjs'))
// store.dispatch(fetchPosts('reactjs')).then(() =>
//     console.log(store.getState())
// )

const store = createStore(
    reducers,
    applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
        ReduxPromise
    )
)


    // <Provider store={createStoreWithMiddleware(reducers)}>

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={App} />
        </Router>
    </Provider>
    , document.getElementById('content'));
