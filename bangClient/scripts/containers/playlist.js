/**
 * Created by tedshaffer on 6/8/16.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ImagePlaylistItem from '../badm/imagePlaylistItem';
import HTML5PlaylistItem from '../badm/html5PlaylistItem';

import { newPlaylistItem, addPlaylistItem, selectPlaylistItem, addPlaylistItem0 } from '../actions/index';
import { guid } from '../utilities/utils';

import $ from 'jquery';

import { getThumb } from '../platform/actions';

class Playlist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentZoneId: null,
        };
    }

    componentWillMount() {
        console.log("playlist: componentWillMount invoked");

        this.fakePlaylistItem = new ImagePlaylistItem(
            "Drop item here",
            "/Users/tedshaffer/Pictures/BangPhotos2/backend_menu_Notes.jpg",
            -1,
            -1,
            -1,
            false);
    }

    componentDidMount() {
        console.log("playlist.js::componentDidMount invoked");

        this.setState( { currentZoneId: this.props.zones.zones[0].id });
    }


    playlistDragOverHandler (ev) {

        console.log("playlistDragOverHandler");
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    }

    playlistDropHandler (ev) {

        // TODO - create function to get this info
        let currentZone = null;
        let currentZonePlaylist = null;
        let currentZonePlaylistId = null;
        if (this.state.currentZoneId) {
            currentZone = this.props.zones.zonesById[this.state.currentZoneId];
            currentZonePlaylistId = currentZone.zonePlaylistId;
            if (currentZonePlaylistId) {
                currentZonePlaylist = this.props.zonePlaylists.zonePlaylistsById[currentZonePlaylistId];
            }
        }

        if (!currentZonePlaylist) return;

        let playlistItemIds = currentZonePlaylist.playlistItemIds;

        ev.preventDefault();

        // get playlist item to add to playlist
        const path = ev.dataTransfer.getData("path");
        const stateName = ev.dataTransfer.getData("name");
        const type = ev.dataTransfer.getData("type");

        // specify playlist item to drop
        let playlistItem = null;
        const playlistItemId = guid();
        if (type === "image") {

            playlistItem = {
                id: playlistItemId,
                fileName: stateName,
                filePath: path,
                timeOnScreen: 6,
                transition: 0,
                transitionDuration: 2
            };
            this.props.newPlaylistItem(playlistItem);
            // this.props.addPlaylistItem(currentZonePlaylistId, playlistItemId);
        }
        else if (type == "html5") {
            playlistItem = new HTML5PlaylistItem(
                "html5Name", //name,
                "html5SiteName", //htmlSiteName,
                true, //enableExternalData,
                true, //enableMouseEvents,
                true, //displayCursor,
                true, //hwzOn,
                false, //useUserStylesheet,
                null //userStyleSheet
            )
        }
        else if (type == "mediaList") {
            
        }

        // determine where the drop occurred relative to the target element
        var offset = $("#" + ev.target.id).offset();
        const left = ev.pageX - offset.left;
        const targetWidth = ev.target.width;

        let indexOfDropTarget = ev.target.dataset.index;

        let index = -1;
        if (left < (targetWidth / 2)) {
            index = indexOfDropTarget;
        }
        else if (indexOfDropTarget < (playlistItemIds.length - 1)) {
            index = indexOfDropTarget + 1;
        }

        this.props.addPlaylistItem0(currentZonePlaylistId, playlistItemId, index);
    }

    onSelectZone(event) {
        console.log("onSelectZone invoked");
    }

    onSelectPlaylistItem(playlistItem) {
        console.log("onSelectPlaylistItem");
        this.props.onSelectPlaylistItem(playlistItem);
    }

    render () {

        let self = this;

        let zoneDropDown = <div></div>

        let selectOptions = this.props.zones.zones.map(function (zone, index) {
            return (
                <option value={zone.id} key={zone.id}>{zone.name}</option>
            );
        });

        // TODO - create function to get this info
        let currentZone = null;
        let currentZonePlaylist = null;
        let currentZonePlaylistItemIds = [];
        if (this.state.currentZoneId) {
            currentZone = this.props.zones.zonesById[this.state.currentZoneId];
            const zonePlaylistId = currentZone.zonePlaylistId;

            // TODO - this approach needs to be thought through more
            if (zonePlaylistId) {
                currentZonePlaylist = this.props.zonePlaylists.zonePlaylistsById[zonePlaylistId];
                currentZonePlaylistItemIds = currentZonePlaylist.playlistItemIds;
            }
        }

        zoneDropDown =
            <div>
                Current zone:
                <select className="leftSpacing" ref="zoneSelect" defaultValue={currentZone}
                        onChange={this.onSelectZone.bind(this)}>{selectOptions}</select>
            </div>


        let currentPlaylistItems = [];

        // for now, resolve currentZonePlaylistIds => currentPlaylistItems
        currentZonePlaylistItemIds.forEach(function(currentZonePlaylistItemId, index) {
            const playlistItem = self.props.playlistItems.playlistItemsById[currentZonePlaylistItemId];
            currentPlaylistItems.push(playlistItem);
        });

        let openCloseLabel = "=>";
        if (!this.props.propertySheetOpen) {
            openCloseLabel = "<=";
        }

        let dataIndex = -1;
        let playlistItems = currentPlaylistItems.map(function (playlistItem) {

            if (self.props.mediaThumbs.hasOwnProperty(playlistItem.filePath)) {

                const mediaItem = self.props.mediaThumbs[playlistItem.filePath]
                const thumb = getThumb(mediaItem);

                dataIndex++;

                // onClick={() => self.props.selectPlaylistItem(playlistItem)}
                // onClick={self.props.onSelectPlaylistItem(playlistItem)}
                // onClick={() => self.onSelectPlaylistItem(playlistItem)}

                return (
                    <li className="flex-item mediaLibraryThumbDiv" key={playlistItem.id} onDrop={self.playlistDropHandler.bind(self)} onDragOver={self.playlistDragOverHandler}>
                        <img
                            id={playlistItem.id}
                            src={thumb}
                            className="mediaLibraryThumbImg"
                            data-index={dataIndex}
                            onClick={() => self.onSelectPlaylistItem(playlistItem)}
                        />
                        <p className="mediaLibraryThumbLbl">{playlistItem.name}</p>
                    </li>
                );
            }
            else {
                return (
                    <li key={playlistItem.id} >
                        <p className="mediaLibraryThumbLbl">{playlistItem.name}</p>
                    </li>
                )
            }

        });

        return (
            <div className="playlistDiv">
                {zoneDropDown}
                <button id="openCloseIcon" className="plainButton" type="button" onClick={this.props.onToggleOpenClosePropertySheet.bind(this)}>{openCloseLabel}</button>
                <ul className="playlist-flex-container wrap">
                    {playlistItems}
                </ul>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        zones: state.zones,
        zonePlaylists: state.zonePlaylists,
        playlistItems: state.playlistItems,

        mediaThumbs: state.mediaThumbs
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ newPlaylistItem, addPlaylistItem, selectPlaylistItem, addPlaylistItem0 }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
