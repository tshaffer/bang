import React from 'react';
import {Component} from 'react';

import BA from '../containers/ba';

// electron only
const {remote} = require('electron');
const {Menu, MenuItem, dialog} = remote;
const fs = require('fs');
const path = require('path');

export default class App extends Component {

    render() {

        console.log("app.js render invoked");

        return (
            <div className = "container bangContainer">
                <BA />
            </div>
        );
    }
}
