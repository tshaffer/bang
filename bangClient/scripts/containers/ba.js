/**
 * Created by tedshaffer on 5/2/16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MediaLibrary from '../containers/mediaLibrary';
import Playlist from '../containers/playlist';

import axios from 'axios';

import BAUI from '../platform/baUI';

import { getAllThumbs, createDefaultSign, selectMediaFolder, updateMediaFolder } from '../actions/index';

// these should be mutually exclusive
import { saveBSNPresentation } from '../actions/index';
import { openDB, loadAppData, fetchSign }  from '../actions/index';

class BA extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bsnPresentations: []
        };

        this.baUI = new BAUI(this);

    }

    componentWillMount() {

        this.props.loadAppData();
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
                            onBrowseForMediaLibrary={this.baUI.handleBrowseForMediaLibrary.bind(this.baUI)}
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
    return bindActionCreators({ openDB, loadAppData, fetchSign, saveBSNPresentation, createDefaultSign: createDefaultSign, selectMediaFolder, updateMediaFolder: updateMediaFolder }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BA);
