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
import { createDefaultPresentation, saveBSNPresentation } from '../actions/index';
import { openDB, loadAppData, fetchSign }  from '../actions/index';

import { newSign, updateSign, newZone, addZone, selectZone, newZonePlaylist, setZonePlaylist, newPlaylistItem, addPlaylistItem, updatePlaylistItem } from '../actions/index';
import { guid } from '../utilities/utils';

class BA extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bsnPresentations: [],
            propertySheetOpen: true,
            selectedPlaylistItemId: null
        };

        this.baUI = new BAUI(this);

    }

    componentWillMount() {

        this.props.createDefaultPresentation("Project 1");

        // TODO
        // select a zone here

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

    
    handleSelectPlaylistItem(playlistItem) {
        console.log("handleSelectPlaylistItem:", playlistItem.fileName);
        this.setState({ selectedPlaylistItemId: playlistItem.id });
    }

    handleUpdateVideoMode(videoMode) {
        const sign = Object.assign({}, this.props.sign, {videoMode: videoMode });
        console.log("updateVideoMode:", videoMode);
        this.props.updateSign(sign);
    }

    handleUpdateImageTimeOnScreen(selectedPlaylistItemId, timeOnScreen) {

        const existingPlaylistItem = this.props.playlistItems.playlistItemsById[selectedPlaylistItemId];
        let updatedPlaylistItem = Object.assign({}, existingPlaylistItem);
        updatedPlaylistItem.timeOnScreen = timeOnScreen;
        this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateImageTransition(selectedPlaylistItemId, transition) {

        const existingPlaylistItem = this.props.playlistItems.playlistItemsById[selectedPlaylistItemId];
        let updatedPlaylistItem = Object.assign({}, existingPlaylistItem);
        updatedPlaylistItem.transition = transition;
        this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateImageTransitionDuration(selectedPlaylistItemId, transitionDuration) {

        const existingPlaylistItem = this.props.playlistItems.playlistItemsById[selectedPlaylistItemId];
        let updatedPlaylistItem = Object.assign({}, existingPlaylistItem);
        updatedPlaylistItem.transitionDuration = transitionDuration;
        this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
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
                    onUpdateVideoMode = {this.handleUpdateVideoMode.bind(this)}
                    onUpdateImageTimeOnScreen = {this.handleUpdateImageTimeOnScreen.bind(this)}
                    onUpdateImageTransition = {this.handleUpdateImageTransition.bind(this)}
                    onUpdateImageTransitionDuration = {this.handleUpdateImageTransitionDuration.bind(this)}
                    selectedPlaylistItemId={this.state.selectedPlaylistItemId}
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
                            onSelectPlaylistItem={this.handleSelectPlaylistItem.bind(this)}
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
        zonePlaylists: state.zonePlaylists,
        playlistItems: state.playlistItems,

        mediaLibraryPlaylistItems: state.mediaLibraryPlaylistItems,
        mediaFolder: state.mediaFolder,
        mediaThumbs: state.mediaThumbs,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ createDefaultPresentation, newSign, updateSign, newZone, addZone, selectZone, newZonePlaylist, setZonePlaylist, newPlaylistItem, addPlaylistItem, updatePlaylistItem, loadAppData, fetchSign, saveBSNPresentation, createDefaultSign, selectMediaFolder, updateMediaFolder }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BA);
