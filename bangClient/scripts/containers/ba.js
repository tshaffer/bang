/**
 * Created by tedshaffer on 5/2/16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MediaLibrary from '../components/mediaLibrary';
import PropertySheet from '../components/propertySheet';

import BAUI from '../platform/baUI';

import { getAllThumbs, selectMediaFolder, updateMediaFolder, saveSign } from '../actions/index';

// bangatron vs. bangwapp?
import { createDefaultPresentation, saveBSNPresentation } from '../actions/index';
import { openDB, loadAppData, fetchSign }  from '../actions/index';

import { addPlaylistItemToZonePlaylist, addMediaStateToZonePlaylist, newSign, updateSign, newZone, addZone, selectZone, newZonePlaylist, setZonePlaylist,
    newMediaState, updateMediaState, deleteMediaState,
    newPlaylistItem, addPlaylistItem, updatePlaylistItem, deletePlaylistItem, movePlaylistItemWithinZonePlaylist, newHtmlSite, addHtmlSiteToPresentation,
    addTransition }
    from '../actions/index';

// import Playlist from '../components/playlist';
import InteractivePlaylist from './interactivePlaylistContainer';

import MediaState from '../badm/mediaState';
import Transition from '../badm/transition';
import ImagePlaylistItem from '../badm/imagePlaylistItem';
import HTML5PlaylistItem from '../badm/html5PlaylistItem';
import UserEvent from '../badm/userEvent';

import EditPreferencesDlg from '../components/Dialogs/editPreferencesDlg';
// import Dialog from 'material-ui/Dialog';
// import FlatButton from 'material-ui/FlatButton';
// import RaisedButton from 'material-ui/RaisedButton';

class BA extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bsnPresentations: [],
            propertySheetOpen: true,
            selectedZone: null,
            selectedMediaStateId: null,
            selectedBSEventId: null,
            activeBSEventType: "timeout",
            open: false,
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

    handleEditPreferences() {
        console.log("handleEditPreferences in ba");
        this.refs.editPreferencesDlg.handleOpen();
    }

    handleEditPreferencesOK(preferences) {
        console.log("handleEditPreferencesOK invoked");
        console.log(preferences);
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

            mediaState = this.props.mediaStates.mediaStatesById[this.state.selectedMediaStateId];

            // TODO - the following loses transitionOutIds and transitionInIds
            // TODO - fix it properly
            const updatedMediaState = new MediaState(mediaState.getMediaPlaylistItem(), x, y);

            // restore them
            mediaState.transitionOutIds.forEach( transitionOutId => {
                updatedMediaState.getTransitionOutIds().push(transitionOutId);
            });
            mediaState.transitionInIds.forEach( transitionInId => {
               updatedMediaState.getTransitionInIds().push(transitionInId);
            });
            this.props.updateMediaState(this.state.selectedMediaStateId, updatedMediaState);
        }

        return mediaState;
    }

    handleAddTransition(targetMediaStateId) {
        
        const sourceMediaState = this.props.mediaStates.mediaStatesById[this.state.selectedMediaStateId];
        const targetMediaState = this.props.mediaStates.mediaStatesById[targetMediaStateId];

        // create userEvent based on current selected event
        // do this here or in playlist??
        // const userEvent = new UserEvent("timeout");
        const userEvent = new UserEvent(this.state.activeBSEventType);
        userEvent.setValue("5");
        
        const transition = new Transition(sourceMediaState, userEvent, targetMediaState); // do this here?

        this.props.addTransition(sourceMediaState, transition, targetMediaState);
    }

    handleDeleteMediaState() {

        const currentZonePlaylist = this.getCurrentZonePlaylist();
        if (currentZonePlaylist) {
            const currentZonePlaylistId = currentZonePlaylist.id;
            const mediaState = this.props.mediaStates.mediaStatesById[this.state.selectedMediaStateId];

            this.props.deleteMediaState(currentZonePlaylistId, mediaState);
        }
        else {
            return;
        }

        // this.props.deleteMediaState(this.state.selectedMediaStateId);
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
        console.log("setState ba.js::handleSelectMediaState");
        this.setState({ selectedBSEventId: null });
        this.setState({ selectedMediaStateId: mediaState.getId() });
    }

    handleSelectBSEvent(bsEvent) {
        this.setState({ selectedMediaStateId: null });
        this.setState({ selectedBSEventId: bsEvent.getId() });
    }

    handleSetActiveBSEventType(bsEventType) {
        this.setState({ activeBSEventType: bsEventType });
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

    handleOpen() {
        this.setState({open: true});
    };

    handleClose() {
        this.setState({open: false});
    };

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

        // <Playlist
        //     onSelectMediaState={this.handleSelectMediaState.bind(this)}
        //
        //     onToggleOpenClosePropertySheet={this.handleToggleOpenClosePropertySheet.bind(this)}
        //     onSelectBSEvent={this.handleSelectBSEvent.bind(this)}
        //     onSetActiveBSEventType={this.handleSetActiveBSEventType.bind(this)}
        //     propertySheetOpen = {this.state.propertySheetOpen}
        //     getCurrentZone = {this.getCurrentZone.bind(this)}
        //     getCurrentZonePlaylist = {this.getCurrentZonePlaylist.bind(this)}
        //     onDropMediaState={this.handleDropMediaState.bind(this)}
        //     onAddTransition={this.handleAddTransition.bind(this)}
        //     onDeleteMediaState={this.handleDeleteMediaState.bind(this)}
        //     sign={this.props.sign}
        //     zones= {this.props.zones}
        //     zonePlaylists= {this.props.zonePlaylists}
        //     mediaStates= {this.props.mediaStates}
        //     transitions={this.props.transitions}
        //     mediaThumbs= {this.props.mediaThumbs}
        //     htmlSites= {this.props.htmlSites}
        //     selectedMediaStateId={this.state.selectedMediaStateId}
        //     selectedBSEventId={this.state.selectedBSEventId}
        //     activeBSEventType={this.state.activeBSEventType}
        // />

        return (

            <div>
                <div>
                    <span>{signName}</span>
                    :
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
                    <InteractivePlaylist
                        onSetActiveBSEventType={this.handleSetActiveBSEventType.bind(this)}

                        onSelectMediaState={this.handleSelectMediaState.bind(this)}
                        onToggleOpenClosePropertySheet={this.handleToggleOpenClosePropertySheet.bind(this)}
                        onSelectBSEvent={this.handleSelectBSEvent.bind(this)}
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
                        transitions={this.props.transitions}
                        mediaThumbs= {this.props.mediaThumbs}
                        htmlSites= {this.props.htmlSites}
                        selectedMediaStateId={this.state.selectedMediaStateId}
                        selectedBSEventId={this.state.selectedBSEventId}
                        activeBSEventType={this.state.activeBSEventType}
                    />
                    {propertySheetTag}
                    <EditPreferencesDlg
                        ref="editPreferencesDlg"
                        onEditPreferencesOK={this.handleEditPreferencesOK.bind(this)}
                    />
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
        transitions: state.transitions,
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
        newMediaState, updateMediaState, deleteMediaState,
        newPlaylistItem, addPlaylistItem, updatePlaylistItem, loadAppData, fetchSign, saveBSNPresentation, selectMediaFolder,
        updateMediaFolder, saveSign, newHtmlSite, addHtmlSiteToPresentation,
        addTransition},
        dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BA);
