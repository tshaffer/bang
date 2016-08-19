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

import { addPlaylistItemToZonePlaylist, newSign, updateSign, newZone, addZone, selectZone, newZonePlaylist, setZonePlaylist,
    newPlaylistItem, addPlaylistItem, updatePlaylistItem, deletePlaylistItem, movePlaylistItemWithinZonePlaylist, newHtmlSite, addHtmlSiteToPresentation}
    from '../actions/index';

// import Playlist from '../components/playlist';
import InteractivePlaylist from './interactivePlaylist';

import MediaState from '../badm/mediaState';
import ImagePlaylistItem from '../badm/imagePlaylistItem';
import HTML5PlaylistItem from '../badm/html5PlaylistItem';

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

    // temporary, until I put this in redux or figure out the right way to do this
    setSelectedMediaStateId(selectedMediaStateId) {
        this.setState( { selectedMediaStateId: selectedMediaStateId })
    }

    handleEditPreferences() {
        console.log("handleEditPreferences in ba");
        this.refs.editPreferencesDlg.handleOpen();
    }

    handleEditPreferencesOK(preferences) {
        console.log("handleEditPreferencesOK invoked");
        console.log(preferences);
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
                        selectedMediaStateId={this.state.selectedMediaStateId}
                        selectedZone={this.state.selectedZone}
                        
                        setSelectedMediaStateId={this.setSelectedMediaStateId.bind(this)}

                        onToggleOpenClosePropertySheet={this.handleToggleOpenClosePropertySheet.bind(this)}
                        propertySheetOpen = {this.state.propertySheetOpen}

                        // getCurrentZone = {this.getCurrentZone.bind(this)}
                        // getCurrentZonePlaylist = {this.getCurrentZonePlaylist.bind(this)}
                        mediaThumbs= {this.props.mediaThumbs}
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
        playlistItems: state.playlistItems,
        htmlSites: state.htmlSites,

        mediaLibraryPlaylistItems: state.mediaLibraryPlaylistItems,
        mediaFolder: state.mediaFolder,
        mediaThumbs: state.mediaThumbs,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ addPlaylistItemToZonePlaylist, deletePlaylistItem, movePlaylistItemWithinZonePlaylist,
        createDefaultPresentation, newSign, updateSign, newZone, addZone, selectZone, newZonePlaylist, setZonePlaylist,
        newPlaylistItem, addPlaylistItem, updatePlaylistItem, loadAppData, fetchSign, saveBSNPresentation, selectMediaFolder,
        updateMediaFolder, saveSign, newHtmlSite, addHtmlSiteToPresentation
        },
        dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BA);
