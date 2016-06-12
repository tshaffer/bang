/**
 * Created by tedshaffer on 5/2/16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MediaLibrary from '../containers/mediaLibrary';
import Playlist from '../containers/playlist';

import axios from 'axios';

// import BAUI from '../bangatron/baUI';
import BAUI from '../bangwapp/baUI';

import { createDefaultSign, updateMediaFolder } from '../actions/index';

// these should be mutually exclusive
import { saveBSNPresentation } from '../actions/index';
import { fetchSign }  from '../actions/index';

class BA extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bsnPresentations: []
        };

        this.baUI = new BAUI(this);

    }

    componentDidMount() {

        console.log("ba.js::componentDidMount invoked");

        this.props.createDefaultSign();

        this.baUI.init();
    }

    render () {

        console.log("ba.js::render invoked");

        let signName = <p>No sign yet</p>;
        if (this.props.sign) {
            signName = this.props.sign.name;
        }

        // onBrowseForMediaLibrary={this.handleBrowseForMediaLibrary.bind(this)}

        const openSavePresentationJSX = this.baUI.getOpenSavePresentationJSX(this.state.bsnPresentations);
        
        return (

            <div>
                <div>
                    <p>{signName}</p>
                </div>

                {openSavePresentationJSX}

            <div className="bangPageContainer">
                    <div>
                        <MediaLibrary
                        />
                        <Playlist />
                    </div>

                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sign: state.sign
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchSign, saveBSNPresentation, createDefaultSign: createDefaultSign, updateMediaFolder: updateMediaFolder }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BA);
