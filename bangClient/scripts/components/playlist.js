/**
 * Created by tedshaffer on 6/8/16.
 */
import React, { Component } from 'react';

import HTML5PlaylistItem from '../badm/html5PlaylistItem';

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

    playlistDragOverHandler (ev) {

        // console.log("playlistDragOverHandler");
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    }

    playlistDropHandler (ev) {

        let currentZonePlaylistId = null;

        const currentZonePlaylist = this.props.getCurrentZonePlaylist();
        if (currentZonePlaylist) {
            currentZonePlaylistId = currentZonePlaylist.id;
        }
        else {
            return;
        }

        ev.preventDefault();

        // get playlist item to add to playlist
        const path = ev.dataTransfer.getData("path");
        const stateName = ev.dataTransfer.getData("name");
        const type = ev.dataTransfer.getData("type");

        // determine where the drop occurred relative to the target element
        console.log("event.target.id=", ev.target.id);
        let index = -1;
        let indexOfDropTarget = -1;
        if (ev.target.id === "playlistItemsUl") {
            // console.log("drop event onto ul");
        }
        else if (ev.target.id != "lblDropItemHere" && ev.target.id != "liDropItemHere") {
            // console.log("drop event not onto dropItemHere");
            var offset = $("#" + ev.target.id).offset();
            const left = ev.pageX - offset.left;
            const targetWidth = ev.target.width;

            indexOfDropTarget = Number(ev.target.dataset.index);

            if (left < (targetWidth / 2)) {
                index = indexOfDropTarget;
            }
            else if (indexOfDropTarget < (currentZonePlaylist.playlistItemIds).length - 1) {
                index = indexOfDropTarget + 1;
            }
        }
        else {
            // console.log("drop event onto dropItemHere");
        }

        // specify playlist item to drop
        let playlistItem = null;
        if (type === "image") {
            this.props.onCreatePlaylistItem(type, stateName, path, index);
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

        // this.props.addPlaylistItemToZonePlaylist(currentZonePlaylistId, playlistItem.id, index);
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

        let presentationZones = [];

        if (this.props.sign && this.props.sign.zoneIds && this.props.zones && this.props.zones.zonesById) {
            let selectOptions = this.props.sign.zoneIds.map( (zoneId) => {
                const zone = self.props.zones.zonesById[zoneId]
                if (zone) {
                    return (
                        <option value={zone.id} key={zone.id}>{zone.name}</option>
                    );
                }
            })

            zoneDropDown =
                <div>
                    Current zone:
                    <select className="leftSpacing" ref="zoneSelect"
                            onChange={this.onSelectZone.bind(this)}>{selectOptions}</select>
                </div>
        }

        let currentPlaylistItems = [];
        let currentPlaylistItemIds = [];

        const currentZonePlaylist = this.props.getCurrentZonePlaylist();
        if (currentZonePlaylist) {
            currentPlaylistItemIds = currentZonePlaylist.playlistItemIds;
        }

        let openCloseLabel = "=>";
        if (!this.props.propertySheetOpen) {
            openCloseLabel = "<=";
        }

        let dataIndex = -1;
        let playlistItems = null;

        if (currentPlaylistItemIds.length > 0) {

            currentPlaylistItemIds.forEach( currentPlaylistItemId => {
                currentPlaylistItems.push(self.props.playlistItems.playlistItemsById[currentPlaylistItemId]);
            });

            playlistItems = currentPlaylistItems.map(function (playlistItem) {

                if (self.props.mediaThumbs.hasOwnProperty(playlistItem.filePath)) {

                    const mediaItem = self.props.mediaThumbs[playlistItem.filePath]
                    const thumb = getThumb(mediaItem);

                    dataIndex++;
                    
                    return (
                        <li className="flex-item mediaLibraryThumbDiv" key={playlistItem.id}>
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
                <li id="liDropItemHere" className="mediaLibraryThumbDiv" key={guid()}>
                    <p id="lblDropItemHere" className="mediaLibraryThumbLbl">Drop Item Here</p>
                </li>
        }

        return (
            <div className="playlistDiv" >
                {zoneDropDown}
                <button id="openCloseIcon" className="plainButton" type="button" onClick={this.props.onToggleOpenClosePropertySheet.bind(this)}>{openCloseLabel}</button>
                <ul id="playlistItemsUl" className="playlist-flex-container wrap" onDrop={self.playlistDropHandler.bind(self)} onDragOver={self.playlistDragOverHandler}>
                    {playlistItems}
                </ul>
            </div>
        );
    }
}

export default Playlist;