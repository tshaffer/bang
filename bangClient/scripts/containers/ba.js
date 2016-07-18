/**
 * Created by tedshaffer on 5/2/16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MediaLibrary from '../components/mediaLibrary';
import Playlist from '../components/playlist';
import PropertySheet from '../components/propertySheet';

import BAUI from '../platform/baUI';

import { getAllThumbs, selectMediaFolder, updateMediaFolder, saveSign } from '../actions/index';

// bangatron vs. bangwapp?
import { createDefaultPresentation, saveBSNPresentation } from '../actions/index';
import { openDB, loadAppData, fetchSign }  from '../actions/index';

import { addPlaylistItemToZonePlaylist, addMediaStateToZonePlaylist, newSign, updateSign, newZone, addZone, selectZone, newZonePlaylist, setZonePlaylist,
    newMediaState, updateMediaState,
    newPlaylistItem, addPlaylistItem, updatePlaylistItem, deletePlaylistItem, movePlaylistItemWithinZonePlaylist, newHtmlSite, addHtmlSiteToPresentation } from '../actions/index';

import MediaState from '../badm/mediaState';
import ImagePlaylistItem from '../badm/imagePlaylistItem';
import HTML5PlaylistItem from '../badm/html5PlaylistItem';

class BA extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bsnPresentations: [],
            propertySheetOpen: true,
            selectedZone: null,
            selectedMediaStateId: null
        };

        this.baUI = new BAUI(this);

    }

    componentWillMount() {

        this.props.createDefaultPresentation("Project 1");

        this.props.loadAppData();
    }

    componentDidMount() {

        var self = this;

        // console.log("ba.js::componentDidMount invoked");
        
        this.baUI.init();

    }

    handleDropMediaState(x, y, operation, type, stateName, path) {

        let mediaState = null;
        let currentZonePlaylistId = null;

        const currentZonePlaylist = this.getCurrentZonePlaylist();
        if (currentZonePlaylist) {
            currentZonePlaylistId = currentZonePlaylist.id;
        }
        else {
            return;
        }
        
        if (operation === "copy" ) {
            if (type === "image") {
                const playlistItem = new ImagePlaylistItem (stateName, path, 6, 0, 2, false);
                mediaState = new MediaState (playlistItem, x, y);
            }

            this.props.newMediaState(mediaState);
            this.props.addMediaStateToZonePlaylist(currentZonePlaylistId, mediaState.getId());
        }
        else {

            const currentMediaState = this.props.mediaStates.mediaStatesById[this.state.selectedMediaStateId];

            // TODO - the following loses transitionOutIds
            const updatedMediaState = new MediaState(currentMediaState.getMediaPlaylistItem(), x, y);
            currentMediaState.transitionOutIds.forEach( transitionOutId => {
                updatedMediaState.getTransitionOutIds().push(transitionOutId);
            });
            this.props.updateMediaState(this.state.selectedMediaStateId, updatedMediaState);
        }

        return mediaState;
    }

    handleAddTransition(targetMediaStateId) {
        const currentMediaState = this.props.mediaStates.mediaStatesById[this.state.selectedMediaStateId];

        // is this really immutable? id doesn't change, but contents do. I think it's okay but I'm not sure
        // requires deeper thinking
        let updatedMediaState = new MediaState(currentMediaState.getMediaPlaylistItem(), currentMediaState.x, currentMediaState.y);
        currentMediaState.transitionOutIds.forEach( transitionOutId => {
            updatedMediaState.getTransitionOutIds().push(transitionOutId);
        });
        updatedMediaState.getTransitionOutIds().push(targetMediaStateId);
        this.props.updateMediaState(this.state.selectedMediaStateId, updatedMediaState);
    }

    handleDeleteMediaState() {

        const currentZonePlaylist = this.getCurrentZonePlaylist();
        if (currentZonePlaylist) {
            const currentZonePlaylistId = currentZonePlaylist.id;
            this.props.deleteMediaState(currentZonePlaylistId, this.state.selectedMediaStateId);
        }
        else {
            return;
        }
    }

    handleAddHtmlSite(name, siteSpec, type) {
        const htmlSite = {
            name,
            siteSpec,
            type
        };

        // this.props.newHtmlSite(htmlSite);
        this.props.addHtmlSiteToPresentation(htmlSite);

    }
    
    handleToggleOpenClosePropertySheet() {
        this.setState({propertySheetOpen: !this.state.propertySheetOpen});
    }

    
    handleSelectMediaState(mediaState) {
        this.setState({ selectedMediaStateId: mediaState.getId() });
    }

    // instead of using action creators, just dispatch the action directly?
    handleUpdateVideoMode(videoMode) {
        // in reducer?
        const sign = Object.assign({}, this.props.sign, {videoMode: videoMode });
        console.log("updateVideoMode:", videoMode);
        this.props.updateSign(sign);
    }

    getCurrentZone() {

        let selectedZone = null;
        if (this.props.sign && this.props.sign.zoneIds.length > 0 && this.props.zones && this.props.zones.zonesById) {

            if (!this.state.selectedZone) {
                selectedZone = this.props.zones.zonesById[this.props.sign.zoneIds[0]];
            }
            else {
                selectedZone = this.state.selectedZone;
            }

            if (!selectedZone) {
                selectedZone = null;
            }
        }
        return selectedZone;
    }

    getCurrentZonePlaylist() {

        let currentZonePlaylist = null;

        let selectedZone = this.getCurrentZone();
        if (selectedZone) {
            currentZonePlaylist = this.props.zonePlaylists.zonePlaylistsById[selectedZone.zonePlaylistId];
        }
        return currentZonePlaylist;
    }

    render () {
        
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
                    getCurrentZone = {this.getCurrentZone.bind(this)}
                    getCurrentZonePlaylist = {this.getCurrentZonePlaylist.bind(this)}
                    selectedMediaStateId={this.state.selectedMediaStateId}
                    sign={this.props.sign}
                    zones= {this.props.zones}
                    zonePlaylists= {this.props.zonePlaylists}
                    playlistItems= {this.props.playlistItems}
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
                            onSelectMediaState={this.handleSelectMediaState.bind(this)}
                            propertySheetOpen = {this.state.propertySheetOpen}
                            getCurrentZone = {this.getCurrentZone.bind(this)}
                            getCurrentZonePlaylist = {this.getCurrentZonePlaylist.bind(this)}
                            onDropMediaState={this.handleDropMediaState.bind(this)}
                            onAddTransition={this.handleAddTransition.bind(this)}
                            onDeleteMediaState={this.handleDeleteMediaState.bind(this)}
                            sign={this.props.sign}
                            zones= {this.props.zones}
                            zonePlaylists= {this.props.zonePlaylists}
                            mediaStates= {this.props.mediaStates}
                            mediaThumbs= {this.props.mediaThumbs}
                            htmlSites= {this.props.htmlSites}
                            selectedMediaStateId={this.state.selectedMediaStateId}
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
        mediaStates: state.mediaStates,
        playlistItems: state.playlistItems,
        htmlSites: state.htmlSites,

        mediaLibraryPlaylistItems: state.mediaLibraryPlaylistItems,
        mediaFolder: state.mediaFolder,
        mediaThumbs: state.mediaThumbs,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ addMediaStateToZonePlaylist, addPlaylistItemToZonePlaylist, deletePlaylistItem, movePlaylistItemWithinZonePlaylist,
        createDefaultPresentation, newSign, updateSign, newZone, addZone, selectZone, newZonePlaylist, setZonePlaylist,
        newMediaState, updateMediaState,
        newPlaylistItem, addPlaylistItem, updatePlaylistItem, loadAppData, fetchSign, saveBSNPresentation, selectMediaFolder, updateMediaFolder, saveSign, newHtmlSite, addHtmlSiteToPresentation }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BA);
