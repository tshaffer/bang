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

// bangatron vs. bangwapp?
import { saveBSNPresentation } from '../actions/index';
import { openDB, loadAppData, fetchSign }  from '../actions/index';

import { newSign, newZone, addZone, selectZone, newZonePlaylist, setZonePlaylist, newPlaylistItem, addPlaylistItem } from '../actions/index';
import { guid } from '../utilities/utils';

class BA extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bsnPresentations: [],
            propertySheetOpen: true
        };

        this.baUI = new BAUI(this);

    }

    componentWillMount() {

        this.props.newSign(guid(), "Project 1");
        
        const zoneId = guid();
        this.props.newZone(zoneId, "images", "imageZone");
        this.props.addZone(zoneId);

        // this.props.zones.zonesById was not updated by the time that the following statement was executed
        // const zone = this.props.zones.zonesById[zoneId];
        // this.props.selectZone(zone);

        const zonePlaylistId = guid();
        this.props.newZonePlaylist(zonePlaylistId);
        this.props.setZonePlaylist(zoneId, zonePlaylistId);

        const fakePlaylistItemId = guid();
        const fakePlaylistItem = {
            id: fakePlaylistItemId,
            fileName: "Drop item here",
            filePath: "/Users/tedshaffer/Pictures/BangPhotos2/backend_menu_Notes.jpg",
            timeOnScreen: -1,
            transition: 0,
            transitionDuration: -1
        };
        this.props.newPlaylistItem(fakePlaylistItem);
        this.props.addPlaylistItem(zonePlaylistId, fakePlaylistItemId);
        
        this.props.loadAppData();
    }

    componentDidMount() {

        console.log("ba.js::componentDidMount invoked");

        // this.props.createDefaultSign();

        this.baUI.init();
    }

    handleToggleOpenClosePropertySheet() {
        this.setState({propertySheetOpen: !this.state.propertySheetOpen});
    }

    render () {

        console.log("ba.js::render invoked");

        let signName = <span>No sign yet</span>;
        let signVideoMode = <span>No videoMode yet</span>;
        if (this.props.sign) {
            signName = this.props.sign.name;
            signVideoMode = this.props.sign.videoMode;
        }
        
        const openSavePresentationJSX = this.baUI.getOpenSavePresentationJSX(this.state.bsnPresentations);

        let propertySheetTag = <div></div>
        if (this.state.propertySheetOpen) {
            propertySheetTag =
                <PropertySheet
                    onBrowseForHTMLSite={this.baUI.handleBrowseForHTMLSite.bind(this.baUI)}
                />
        }

        return (

            <div>
                <div>
                    <span>{signName}</span>
                    <span>{signVideoMode}</span>
                </div>

                {openSavePresentationJSX}

            <div className="bangPageContainer">
                        <MediaLibrary
                            onBrowseForMediaLibrary={this.baUI.handleBrowseForMediaLibrary.bind(this.baUI)}
                            mediaLibraryPlaylistItems={this.props.mediaLibraryPlaylistItems}
                            mediaFolder={this.props.mediaFolder}
                            mediaThumbs={this.props.mediaThumbs}
                        />
                        <Playlist
                            onToggleOpenClosePropertySheet={this.handleToggleOpenClosePropertySheet.bind(this)}
                            propertySheetOpen = {this.state.propertySheetOpen}
                        />
                        {propertySheetTag}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sign: state.sign,
        zones: state.zones,
        mediaLibraryPlaylistItems: state.mediaLibraryPlaylistItems,
        mediaFolder: state.mediaFolder,
        mediaThumbs: state.mediaThumbs,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ newSign, newZone, addZone, selectZone, newZonePlaylist, setZonePlaylist, newPlaylistItem, addPlaylistItem, loadAppData, fetchSign, saveBSNPresentation, createDefaultSign: createDefaultSign, selectMediaFolder, updateMediaFolder: updateMediaFolder }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BA);
