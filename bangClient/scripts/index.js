/**
 * Created by tedshaffer on 6/3/16.
 */
'use strict';

import thunkMiddleware from 'redux-thunk';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {combineReducers} from 'redux';
import ReduxPromise from 'redux-promise';
import { Router, browserHistory, hashHistory } from 'react-router';
import { Route } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { baDmReducer, DmState} from '@brightsign/badatamodel';
import appReducer from './reducers';

import App from './components/app';

export const rootReducer = combineReducers({
    badm : baDmReducer,
    app : appReducer
});

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
        ReduxPromise
    )
);

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={App} />
        </Router>
    </Provider>
    , document.getElementById('content'));
