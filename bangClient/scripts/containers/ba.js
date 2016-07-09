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

import { addPlaylistItemToZonePlaylist, newSign, updateSign, newZone, addZone, selectZone, newZonePlaylist, setZonePlaylist, newPlaylistItem, addPlaylistItem, updatePlaylistItem, newHtmlSite, addHtmlSiteToPresentation } from '../actions/index';

import ImagePlaylistItem from '../badm/imagePlaylistItem';
import HTML5PlaylistItem from '../badm/html5PlaylistItem';

class BA extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bsnPresentations: [],
            propertySheetOpen: true,
            selectedZone: null,
            selectedPlaylistItemId: null
        };

        this.baUI = new BAUI(this);

    }

    componentWillMount() {

        this.props.createDefaultPresentation("Project 1");

        this.props.loadAppData();
    }

    componentDidMount() {

        // console.log("ba.js::componentDidMount invoked");
        
        this.baUI.init();
    }

    handleCreatePlaylistItem(type, stateName, path, index) {

        let playlistItem = null;
        let currentZonePlaylistId = null;

        const currentZonePlaylist = this.getCurrentZonePlaylist();
        if (currentZonePlaylist) {
            currentZonePlaylistId = currentZonePlaylist.id;
        }
        else {
            return;
        }

        if (type === "image") {
            playlistItem = new ImagePlaylistItem (stateName, path, 6, 0, 2, false);
        }
        else if (type === "html5") {
            playlistItem = new HTML5PlaylistItem(
                stateName, //name,
                path, //htmlSiteName,
                true, //enableExternalData,
                true, //enableMouseEvents,
                true, //displayCursor,
                true, //hwzOn,
                false, //useUserStylesheet,
                null //userStyleSheet
            )
        }
        this.props.newPlaylistItem(playlistItem);

        this.props.addPlaylistItemToZonePlaylist(currentZonePlaylistId, playlistItem.id, index);
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

    
    handleSelectPlaylistItem(playlistItem) {
        console.log("handleSelectPlaylistItem:", playlistItem.fileName);
        this.setState({ selectedPlaylistItemId: playlistItem.id });
    }

    handleUpdateVideoMode(videoMode) {
        const sign = Object.assign({}, this.props.sign, {videoMode: videoMode });
        console.log("updateVideoMode:", videoMode);
        this.props.updateSign(sign);
    }

    getEmptyPlaylistItem(existingPlaylistItem) {

        let emptyPlaylistItem = null;
        const emptyImagePlaylistItem = new ImagePlaylistItem();
        const emptyHTML5PlaylistItem = new HTML5PlaylistItem();
        if (existingPlaylistItem instanceof ImagePlaylistItem) {
            emptyPlaylistItem = emptyImagePlaylistItem;
        }
        else if (existingPlaylistItem instanceof HTML5PlaylistItem) {
            emptyPlaylistItem = emptyHTML5PlaylistItem;
        }
        else {
            console.log("handleUpdateImageTimeOnScreen: unknown playlistItem type");
        }
        return emptyPlaylistItem;
    }

    copyExistingPlaylistItem(selectedPlaylistItemId) {
        
        const existingPlaylistItem = this.props.playlistItems.playlistItemsById[selectedPlaylistItemId];
        let emptyPlaylistItem = this.getEmptyPlaylistItem(existingPlaylistItem);
        if (!emptyPlaylistItem) return null;

        return Object.assign(emptyPlaylistItem, existingPlaylistItem);
        
    }
    handleUpdateImageTimeOnScreen(selectedPlaylistItemId, timeOnScreen) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.timeOnScreen = timeOnScreen;
        this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateImageTransition(selectedPlaylistItemId, transition) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.transition = transition;
        this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateImageTransitionDuration(selectedPlaylistItemId, transitionDuration) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.transitionDuration = transitionDuration;
        this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateHTML5StateName(selectedPlaylistItemId, html5StateName) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.fileName = html5StateName;
        this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateHTML5SiteName(selectedPlaylistItemId, html5SiteName) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.htmlSiteName = html5SiteName;
        this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateHTML5EnableExternalData(selectedPlaylistItemId, enableExternalData) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.enableExternalData = enableExternalData;
        this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateHTML5EnableMouseEvents(selectedPlaylistItemId, enableMouseEvents) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.enableMouseEvents = enableMouseEvents;
        this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }
    
    handleUpdateHTML5DisplayCursor(selectedPlaylistItemId, displayCursor) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.displayCursor = displayCursor;
        this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }
    
    handleUpdateHTML5HWZOn(selectedPlaylistItemId, hwzOn) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.hwzOn = hwzOn;
        this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
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
                    onUpdateImageTimeOnScreen = {this.handleUpdateImageTimeOnScreen.bind(this)}
                    onUpdateImageTransition = {this.handleUpdateImageTransition.bind(this)}
                    onUpdateImageTransitionDuration = {this.handleUpdateImageTransitionDuration.bind(this)}
                    getCurrentZone = {this.getCurrentZone.bind(this)}
                    getCurrentZonePlaylist = {this.getCurrentZonePlaylist.bind(this)}
                    onAddHtmlSite={this.handleAddHtmlSite.bind(this)}
                    selectedPlaylistItemId={this.state.selectedPlaylistItemId}
                    sign={this.props.sign}
                    zones= {this.props.zones}
                    zonePlaylists= {this.props.zonePlaylists}
                    playlistItems= {this.props.playlistItems}
                    htmlSites= {this.props.htmlSites}
                    onUpdateHTML5StateName = {this.handleUpdateHTML5StateName.bind(this)}
                    onUpdateHTML5SiteName = {this.handleUpdateHTML5SiteName.bind(this)}
                    onUpdateHTML5EnableExternalData = {this.handleUpdateHTML5EnableExternalData.bind(this) }
                    onUpdateHTML5EnableMouseEvents = {this.handleUpdateHTML5EnableMouseEvents.bind(this) }
                    onUpdateHTML5DisplayCursor = {this.handleUpdateHTML5DisplayCursor.bind(this) }
                    onUpdateHTML5HWZOn = {this.handleUpdateHTML5HWZOn.bind(this) }
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
                            getCurrentZone = {this.getCurrentZone.bind(this)}
                            getCurrentZonePlaylist = {this.getCurrentZonePlaylist.bind(this)}
                            onCreatePlaylistItem={this.handleCreatePlaylistItem.bind(this)}
                            sign={this.props.sign}
                            zones= {this.props.zones}
                            zonePlaylists= {this.props.zonePlaylists}
                            playlistItems= {this.props.playlistItems}
                            mediaThumbs= {this.props.mediaThumbs}
                            htmlSites= {this.props.htmlSites}
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
        htmlSites: state.htmlSites,

        mediaLibraryPlaylistItems: state.mediaLibraryPlaylistItems,
        mediaFolder: state.mediaFolder,
        mediaThumbs: state.mediaThumbs,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ addPlaylistItemToZonePlaylist, createDefaultPresentation, newSign, updateSign, newZone, addZone, selectZone, newZonePlaylist, setZonePlaylist, newPlaylistItem, addPlaylistItem, updatePlaylistItem, loadAppData, fetchSign, saveBSNPresentation, selectMediaFolder, updateMediaFolder, saveSign, newHtmlSite, addHtmlSiteToPresentation }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BA);
