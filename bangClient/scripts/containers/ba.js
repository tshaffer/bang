/**
 * Created by tedshaffer on 5/2/16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MediaLibrary from '../components/mediaLibrary';
import Playlist from '../containers/playlist';
import PropertySheet from '../containers/propertySheet';

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
                        <MediaLibrary
                            onBrowseForMediaLibrary={this.baUI.handleBrowseForMediaLibrary.bind(this.baUI)}
                            mediaLibraryPlaylistItems={this.props.mediaLibraryPlaylistItems}
                            mediaFolder={this.props.mediaFolder}
                            mediaThumbs={this.props.mediaThumbs}
                        />
                        <Playlist />
                        <PropertySheet />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sign: state.sign,
        mediaLibraryPlaylistItems: state.mediaLibraryPlaylistItems,
        mediaFolder: state.mediaFolder,
        mediaThumbs: state.mediaThumbs,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ openDB, loadAppData, fetchSign, saveBSNPresentation, createDefaultSign: createDefaultSign, selectMediaFolder, updateMediaFolder: updateMediaFolder }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BA);
