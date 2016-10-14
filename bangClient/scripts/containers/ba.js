/**
 * Created by tedshaffer on 5/2/16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import BAUI from '../platform/baUI';
import ImagePlaylistItem from '../badm/imagePlaylistItem';
import HTML5PlaylistItem from '../badm/html5PlaylistItem';
import MediaLibrary from '../components/mediaLibrary';
import NonInteractivePlaylist from './nonInteractivePlaylist';


import { createDefaultPresentation, loadAppData, selectMediaFolder } from '../actions/index';

class BA extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bsnPresentations: [],
            propertySheetOpen: false,
            selectedZone: null,
            selectedMediaStateId: "",
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
            console.log("existingPlaylistItem: unknown playlistItem type");
        }
        return emptyPlaylistItem;
    }


    copyExistingPlaylistItem(selectedPlaylistItemId) {

        const existingPlaylistItem = this.props.playlistItems.playlistItemsById[selectedPlaylistItemId];
        let emptyPlaylistItem = this.getEmptyPlaylistItem(existingPlaylistItem);
        if (!emptyPlaylistItem) return null;

        return Object.assign(emptyPlaylistItem, existingPlaylistItem);

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

        const openSavePresentationJSX = <div>pizza!!!</div>;

        return (

            <div>

                <div>
                    <span>{signName}</span>
                    :
                    <span>{signVideoMode}</span>
                </div>

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
                        selectedMediaStateId={this.state.selectedMediaStateId}
                        bangSign={this.props.sign}
                        bangZones={this.props.zones}
                    />
                </div>
            </div>
        );
    }
}

function mapStateToProps(baState) {

    const state = baState.reducers;

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

        bsnAuthData: state.bsnAuthData,

        firmwareSpecs: state.firmwareSpecs
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({createDefaultPresentation, loadAppData, selectMediaFolder
        },
        dispatch);
}


BA.propTypes = {
    createDefaultPresentation: React.PropTypes.func.isRequired,
    loadAppData: React.PropTypes.func.isRequired,
    sign: React.PropTypes.object.isRequired,
    zones: React.PropTypes.object.isRequired,
    zonePlaylists: React.PropTypes.object.isRequired,
    mediaStates: React.PropTypes.object.isRequired,
    playlistItems: React.PropTypes.object.isRequired,
    mediaFolder: React.PropTypes.string.isRequired,
    mediaThumbs: React.PropTypes.object.isRequired,
    mediaLibraryPlaylistItems: React.PropTypes.array.isRequired,
    htmlSites: React.PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(BA);
