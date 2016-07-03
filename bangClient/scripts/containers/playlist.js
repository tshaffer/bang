/**
 * Created by tedshaffer on 6/8/16.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ImagePlaylistItem from '../badm/imagePlaylistItem';
import HTML5PlaylistItem from '../badm/html5PlaylistItem';

import { newPlaylistItem, addPlaylistItem, addPlaylistItemToZonePlaylist } from '../actions/index';
import { guid } from '../utilities/utils';

import $ from 'jquery';

import { getThumb } from '../platform/actions';

class Playlist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedZoneId: null,
        };
    }

    componentWillMount() {
        // console.log("playlist: componentWillMount invoked");
    }

    componentDidMount() {
        // console.log("playlist.js::componentDidMount invoked");

        if (this.props.sign.zoneIds.length > 0) {
            this.setState( { selectedZoneId: this.props.sign.zoneIds[0] });
        }
    }

    hackGetCurrentZone() {

        let selectedZone = null;
        if (this.props.sign && this.props.sign.zoneIds.length > 0) {
            selectedZone = this.props.sign.zonesById[this.props.sign.zoneIds[0]];
        }
        return selectedZone;
    }

    playlistDragOverHandler (ev) {

        console.log("playlistDragOverHandler");
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    }

    playlistDropHandler (ev) {

        // TODO - create function to get this info
        let currentZonePlaylist = null;
        let currentZonePlaylistId = null;

        // let selectedZone = this.hackGetCurrentZone();
        // if (selectedZone) {
        //     currentZonePlaylist = selectedZone.zonePlaylist;
        // }

        let selectedZone = this.hackGetCurrentZone();
        if (selectedZone) {
            currentZonePlaylist = this.props.zonePlaylists.zonePlaylistsById[selectedZone.zonePlaylistId];
            if (currentZonePlaylist) {
                currentZonePlaylistId = currentZonePlaylist.id;
            }
            // if (currentZonePlaylist) {
            //     currentPlaylistItems = currentZonePlaylist.playlistItems;
            // }
        }





        if (!currentZonePlaylist) return;

        // let playlistItemIds = currentZonePlaylist.playlistItemIds;

        ev.preventDefault();

        // get playlist item to add to playlist
        const path = ev.dataTransfer.getData("path");
        const stateName = ev.dataTransfer.getData("name");
        const type = ev.dataTransfer.getData("type");

        // specify playlist item to drop
        let playlistItem = null;
        if (type === "image") {

            // TODO - move to ba.js
            playlistItem = new ImagePlaylistItem (stateName, path, 6, 0, 2, false);

            // this.props.newPlaylistItem(playlistItem);
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
        let index = -1;
        if (ev.target.id != "lblDropItemHere" && ev.target.id != "liDropItemHere") {
            var offset = $("#" + ev.target.id).offset();
            const left = ev.pageX - offset.left;
            const targetWidth = ev.target.width;

            let indexOfDropTarget = ev.target.dataset.index;

            if (left < (targetWidth / 2)) {
                index = indexOfDropTarget;
            }
            else if (indexOfDropTarget < (currentZonePlaylist.playlistItems.length - 1)) {
                index = indexOfDropTarget + 1;
            }
        }

        // this.props.addPlaylistItemToZonePlaylist(currentZonePlaylistId, playlistItem.id, index);
        this.props.addPlaylistItemToZonePlaylist(currentZonePlaylistId, playlistItem, index);
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

        let zoneId = "";

        let zoneDropDown = <div></div>;

        // console.log("playlist.js::render()");
        let presentationZones = [];

        if (this.props.sign && this.props.sign.zoneIds) {
            let selectOptions = this.props.sign.zoneIds.map( (zoneId) => {
                const zone = this.props.sign.zonesById[zoneId];
                return (
                    <option value={zone.id} key={zone.id}>{zone.name}</option>
                );
            })

            zoneDropDown =
                <div>
                    Current zone:
                    <select className="leftSpacing" ref="zoneSelect"
                            onChange={this.onSelectZone.bind(this)}>{selectOptions}</select>
                </div>
        }

        let selectedZone = null;
        let currentPlaylistItems = [];

        // if (this.state.selectedZoneId) {
        //     selectedZone = this.props.sign.zonesById[this.state.selectedZoneId];
        // }
        // else if (this.props.sign && this.props.sign.zoneIds.length > 0) {
        //     selectedZone = this.props.sign.zonesById[this.props.sign.zoneIds[0]];
        // }

        selectedZone = this.hackGetCurrentZone();

        if (selectedZone) {
            const currentZonePlaylist = this.props.zonePlaylists.zonePlaylistsById[selectedZone.zonePlaylistId];
            if (currentZonePlaylist) {
                currentPlaylistItems = currentZonePlaylist.playlistItems;
            }
        }

        let openCloseLabel = "=>";
        if (!this.props.propertySheetOpen) {
            openCloseLabel = "<=";
        }

        let dataIndex = -1;
        let playlistItems = null;

        if (currentPlaylistItems.length > 0) {
            playlistItems = currentPlaylistItems.map(function (playlistItem) {

                if (self.props.mediaThumbs.hasOwnProperty(playlistItem.filePath)) {

                    const mediaItem = self.props.mediaThumbs[playlistItem.filePath]
                    const thumb = getThumb(mediaItem);

                    dataIndex++;

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
        }
        else {
            playlistItems =
                <li id="liDropItemHere" className="mediaLibraryThumbDiv" key={guid()} onDrop={self.playlistDropHandler.bind(self)} onDragOver={self.playlistDragOverHandler}>
                    <p id="lblDropItemHere" className="mediaLibraryThumbLbl">Drop Item Here</p>
                </li>
        }

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
        sign: state.sign,
        // zones: state.zones,
        zonePlaylists: state.zonePlaylists,
        // playlistItems: state.playlistItems,

        mediaThumbs: state.mediaThumbs
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ newPlaylistItem, addPlaylistItem, addPlaylistItemToZonePlaylist }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
