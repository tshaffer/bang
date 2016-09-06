/**
 * Created by tedshaffer on 5/2/16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import BAUI from '../platform/baUI';
import EditPreferencesDlg from '../components/Dialogs/editPreferencesDlg';

import ImagePlaylistItem from '../badm/imagePlaylistItem';
import HTML5PlaylistItem from '../badm/html5PlaylistItem';
import MediaLibrary from '../components/mediaLibrary';
import PropertySheet from '../components/propertySheet';
import NonInteractivePlaylist from './nonInteractivePlaylist';

import { createDefaultPresentation, updateSign, loadAppData,
    newHtmlSite, addHtmlSiteToPresentation, selectMediaFolder } from '../actions/index';

class BA extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bsnPresentations: [],
            propertySheetOpen: true,
            selectedZone: null,
            selectedMediaStateId: null,
            selectedPlaylistItemId: "",
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

        this.baUI.init();

    }

    handleSelectMediaState(mediaState) {
        this.setState({ selectedMediaStateId: mediaState.getId() });
    }


// edit preferences using material ui
    handleEditPreferences() {
        console.log("handleEditPreferences in ba");
        this.refs.editPreferencesDlg.handleOpen();
    }

    handleEditPreferencesOK(preferences) {
        console.log("handleEditPreferencesOK invoked");
        console.log(preferences);
    }

// unused at the moment
    handleAddHtmlSite(name, siteSpec, type) {
        const htmlSite = {
            name,
            siteSpec,
            type
        };

        this.props.addHtmlSiteToPresentation(htmlSite);

    }

    // instead of using action creators, just dispatch the action directly?
    handleUpdateVideoMode(videoMode) {
        // in reducer?
        const sign = Object.assign({}, this.props.sign, {videoMode: videoMode });
        console.log("updateVideoMode:", videoMode);
        this.props.updateSign(sign);
    }


    handleToggleOpenClosePropertySheet() {
        this.setState({propertySheetOpen: !this.state.propertySheetOpen});
    }

    handleUpdateImageTimeOnScreen(selectedPlaylistItemId, timeOnScreen) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.timeOnScreen = timeOnScreen;
        // this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateImageTransition(selectedPlaylistItemId, transition) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.transition = transition;
        // this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateImageTransitionDuration(selectedPlaylistItemId, transitionDuration) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.transitionDuration = transitionDuration;
        // this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
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

    handleUpdateHTML5StateName(selectedPlaylistItemId, html5StateName) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.setFileName(html5StateName);
        // this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateHTML5SiteName(selectedPlaylistItemId, html5SiteName) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.htmlSiteName = html5SiteName;
        // this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateHTML5EnableExternalData(selectedPlaylistItemId, enableExternalData) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.enableExternalData = enableExternalData;
        // this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateHTML5EnableMouseEvents(selectedPlaylistItemId, enableMouseEvents) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.enableMouseEvents = enableMouseEvents;
        // this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateHTML5DisplayCursor(selectedPlaylistItemId, displayCursor) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.displayCursor = displayCursor;
        // this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
    }

    handleUpdateHTML5HWZOn(selectedPlaylistItemId, hwzOn) {

        let updatedPlaylistItem = this.copyExistingPlaylistItem(selectedPlaylistItemId);
        updatedPlaylistItem.hwzOn = hwzOn;
        // this.props.updatePlaylistItem(selectedPlaylistItemId, updatedPlaylistItem);
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
    }

    handleClose() {
        this.setState({open: false});
    }

    render () {
        
        let signName = <span>No sign yet</span>;
        let signVideoMode = <span>No videoMode yet</span>;
        if (this.props.sign) {
            signName = this.props.sign.name;
            signVideoMode = this.props.sign.videoMode;
        }
        
        const openSavePresentationJSX = this.baUI.getOpenSavePresentationJSX(this.state.bsnPresentations);

        let propertySheetTag = <div></div>;
        if (this.state.propertySheetOpen) {
            propertySheetTag =
                <PropertySheet
                    onAddHtmlSite={this.handleAddHtmlSite.bind(this)}
                    onBrowseForHTMLSite={this.baUI.handleBrowseForHTMLSite.bind(this.baUI)}
                    onUpdateVideoMode = {this.handleUpdateVideoMode.bind(this)}
                    getCurrentZone = {this.getCurrentZone.bind(this)}
                    getCurrentZonePlaylist = {this.getCurrentZonePlaylist.bind(this)}
                    selectedMediaStateId={this.state.selectedMediaStateId}
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

                    onUpdateImageTimeOnScreen = {this.handleUpdateImageTimeOnScreen.bind(this) }
                    onUpdateImageTransition = {this.handleUpdateImageTransition.bind(this) }
                    onUpdateImageTransitionDuration = {this.handleUpdateImageTransitionDuration.bind(this) }

        />;
        }

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
                    <NonInteractivePlaylist
                        sign={this.props.sign}
                        zones={this.props.zones}
                        zonePlaylists={this.props.zonePlaylists}
                        mediaThumbs={this.props.mediaThumbs}
                        transitions={this.props.transitions}
                        onSelectMediaState={this.handleSelectMediaState.bind(this)}
                        selectedMediaStateId={this.state.selectedMediaStateId}
                    />
                    {propertySheetTag}
                    <EditPreferencesDlg
                        ref="editPreferencesDlg"
                        onEditPreferencesOK={this.handleEditPreferencesOK.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        sign: state.sign,
        zones: state.zones,
        zonePlaylists: state.zonePlaylists,
        playlistItems: state.playlistItems,
        htmlSites: state.htmlSites,
        transitions: state.transitions,

        mediaLibraryPlaylistItems: state.mediaLibraryPlaylistItems,
        mediaFolder: state.mediaFolder,
        mediaThumbs: state.mediaThumbs,
    };
}

// updateMediaState
function mapDispatchToProps(dispatch) {
    return bindActionCreators({createDefaultPresentation, updateSign, loadAppData, newHtmlSite, addHtmlSiteToPresentation,
        selectMediaFolder},
        dispatch);
}

// updateMediaState
BA.propTypes = {
    createDefaultPresentation: React.PropTypes.func.isRequired,
    loadAppData: React.PropTypes.func.isRequired,
    addHtmlSiteToPresentation: React.PropTypes.func.isRequired,
    updateSign: React.PropTypes.func.isRequired,
    sign: React.PropTypes.object.isRequired,
    zones: React.PropTypes.object.isRequired,
    zonePlaylists: React.PropTypes.object.isRequired,
    playlistItems: React.PropTypes.object.isRequired,
    mediaFolder: React.PropTypes.string.isRequired,
    mediaThumbs: React.PropTypes.object.isRequired,
    mediaLibraryPlaylistItems: React.PropTypes.array.isRequired,
    htmlSites: React.PropTypes.object.isRequired,
    transitions: React.PropTypes.object.isRequired,
};


export default connect(mapStateToProps, mapDispatchToProps)(BA);
