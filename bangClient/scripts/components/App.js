import React from 'react';
import {Component} from 'react';

import BA from '../containers/ba';

export default class App extends Component {

    componentDidMount() {
        // console.log("app.js::componentDidMount invoked");
    }
    
    render() {

        // console.log("app.js render invoked");

        return (
            <div className = "container bangContainer">
                <BA />
            </div>
        );
    }
}
