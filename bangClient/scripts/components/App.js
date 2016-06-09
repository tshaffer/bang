import React from 'react';
import {Component} from 'react';

import BA from '../containers/ba';

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
