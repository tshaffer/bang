/**
 * Created by tedshaffer on 6/8/16.
 */
import React, { Component } from 'react';

import { guid } from '../utilities/utils';

import $ from 'jquery';

import { getThumb } from '../platform/actions';

import ImagePlaylistItem from '../badm/imagePlaylistItem';
import HTML5PlaylistItem from '../badm/html5PlaylistItem';

class Playlist extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    playlistDragOverHandler (ev) {

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    }

    getDropIndex(ev) {

        let currentZonePlaylistId = null;

        const currentZonePlaylist = this.props.getCurrentZonePlaylist();
        if (currentZonePlaylist) {
            currentZonePlaylistId = currentZonePlaylist.id;
        }
        else {
            return;
        }

        let index = -1;
        let indexOfDropTarget = -1;

        var offset = $("#" + ev.target.id).offset();
        const left = ev.pageX - offset.left;
        let targetWidth = ev.target.width;
        if (targetWidth == undefined) {
            targetWidth = $("#" + ev.target.id).outerWidth();
        }

        indexOfDropTarget = Number(ev.target.dataset.index);

        if (left < (targetWidth / 2)) {
            index = indexOfDropTarget;
        }
        else if (indexOfDropTarget < (currentZonePlaylist.playlistItemIds).length - 1) {
            index = indexOfDropTarget + 1;
        }

        return index;
    }

    playlistDropHandler (ev) {

        ev.preventDefault();

        // get dropped playlist item
        const stateName = ev.dataTransfer.getData("name");
        const path = ev.dataTransfer.getData("path");
        const type = ev.dataTransfer.getData("type");

        // determine where the drop occurred relative to the target element
        console.log("event.target.id=", ev.target.id);
        let index = -1;
        let indexOfDropTarget = -1;

        if (ev.target.id === "playlistItemsUl") {
            // drop item at end of list
        }
        else if (ev.target.id === "lblDropItemHere" && ev.target.id === "liDropItemHere") {
            // drop item onto 'Drop Item Here'
        }
        else if (ev.target.id.startsWith("mediaThumb") || ev.target.id.startsWith("mediaLbl")) {
            // drop target is in margin of media item
            index = this.getDropIndex(ev);
        }
        else if (ev.target.id !== "") {
            // drop target is media item
            index = this.getDropIndex(ev);
        }
        else {
            console.log("don't know where to drop it");
            return;
        }

        // specify playlist item to drop
        if (type === "image") {
            this.props.onCreatePlaylistItem(type, stateName, path, index);
        }
        else if (type == "html5") {
            // TODO - for now, set the state name and site name to the first site in the sign (if it exists)
            let defaultName = "";
            if (this.props.sign.htmlSiteIds.length > 0) {
                const htmlSiteId = this.props.sign.htmlSiteIds[0];
                const htmlSite = this.props.htmlSites.htmlSitesById[htmlSiteId];
                defaultName = htmlSite.name;
            }
            else {
                defaultName = "html5";
            }
            this.props.onCreatePlaylistItem(type, defaultName, defaultName, index);
        }
        else if (type == "mediaList") {
            // TBD
        }
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

            playlistItems = currentPlaylistItems.map(function (playlistItem, index) {
                
                dataIndex++;

                if (playlistItem instanceof ImagePlaylistItem) {
                    if (self.props.mediaThumbs.hasOwnProperty(playlistItem.filePath)) {

                        const mediaItem = self.props.mediaThumbs[playlistItem.filePath]
                        const thumb = getThumb(mediaItem);
                        
                        return (
                            <li className="flex-item mediaLibraryThumbDiv" key={index} data-index={dataIndex} id={"mediaThumb" + dataIndex.toString()}>
                                <img
                                    id={playlistItem.id}
                                    src={thumb}
                                    className="mediaLibraryThumbImg"
                                    data-index={dataIndex}
                                    onClick={() => self.onSelectPlaylistItem(playlistItem)}
                                />
                                <p className="mediaLibraryThumbLbl" id={"mediaLbl" + dataIndex.toString()}>{playlistItem.fileName}</p>
                            </li>
                        );
                    }
                    else {
                        return (
                            <li key={playlistItem.id} data-index={dataIndex} id={"mediaThumb" + dataIndex.toString()}>
                                <p className="mediaLibraryThumbLbl">{playlistItem.fileName}</p>
                            </li>
                        )
                    }
                }
                if (playlistItem instanceof HTML5PlaylistItem) {
                    return (
                        <li className="flex-item mediaLibraryThumbDiv" key={playlistItem.id} data-index={index} id={"mediaThumb" + dataIndex.toString()}>
                            <img
                                id={playlistItem.id}
                                src="images/html.png"
                                className="otherThumbImg"
                                data-index={dataIndex}
                                onClick={() => self.onSelectPlaylistItem(playlistItem)}
                            />
                            <p className="mediaLibraryThumbLbl" id={"mediaLbl" + dataIndex.toString()}>HTML5</p>
                        </li>
                    );
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
