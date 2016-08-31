import React, { Component } from 'react';

import { guid } from '../utilities/utils';

class NonInteractivePlaylist extends Component {

    handlePlaylistDragOver (event) {

        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }


    handlePlaylistDrop (event) {

        event.preventDefault();

        // copy or move?
        let operation = "";
        let startIndex = -1;
        if (event.dataTransfer.effectAllowed === "move") {
            operation = "move";
            startIndex = Number(event.dataTransfer.getData("index"));
        }
        else {
            operation = "copy";
        }

        // get dropped playlist item
        const stateName = event.dataTransfer.getData("name");
        const path = event.dataTransfer.getData("path");
        const type = event.dataTransfer.getData("type");

        // determine where the drop occurred relative to the target element
        console.log("event.target.id=", event.target.id);
        let index = -1;
        let indexOfDropTarget = -1;

        if (event.target.id === "playlistItemsUl") {
            // drop item at end of list
        }
        else if (event.target.id === "lblDropItemHere" || event.target.id === "liDropItemHere") {
            // drop item onto 'Drop Item Here'
        }
        else if (event.target.id.startsWith("mediaThumb") || event.target.id.startsWith("mediaLbl")) {
            // drop target is in margin of media item
            index = this.getDropIndex(event);
        }
        else if (event.target.id !== "") {
            // drop target is media item
            index = this.getDropIndex(event);
        }
        else {
            console.log("don't know where to drop it");
            return;
        }

        // // specify playlist item to drop
        // let playlistItem = null;
        // if (type === "image") {
        //     playlistItem = this.props.onDropPlaylistItem(operation, type, stateName, path, startIndex, index);
        // }
        // else if (type == "html5") {
        //     // TODO - for now, set the state name and site name to the first site in the sign (if it exists)
        //     let defaultName = "";
        //     if (this.props.sign.htmlSiteIds.length > 0) {
        //         const htmlSiteId = this.props.sign.htmlSiteIds[0];
        //         const htmlSite = this.props.htmlSites.htmlSitesById[htmlSiteId];
        //         defaultName = htmlSite.name;
        //     }
        //     else {
        //         defaultName = "html5";
        //     }
        //     playlistItem = this.props.onDropPlaylistItem(operation, type, defaultName, defaultName, startIndex, index);
        // }
        // else if (type == "mediaList") {
        //     // TBD
        // }
        //
        // if (playlistItem) {
        //     this.onSelectPlaylistItem(playlistItem);
        // }
    }


    render() {

        let playlistItems = null;

        if (playlistItems) {
            playlistItems = <div>I am playlistItems</div>;
        }
        else {
            playlistItems =
                (
                <li id="liDropItemHere" className="mediaLibraryThumbDiv" key={guid()}>
                    <p id="lblDropItemHere" className="mediaLibraryThumbLbl">Drop Item Here</p>
                </li>
                );

        }

        return (
            (
            <div
                className="playlistDiv"
                id="playlistDiv"
            >
                <ul id="playlistItemsUl" className="playlist-flex-container wrap" onDrop={this.handlePlaylistDrop.bind(this)} onDragOver={this.handlePlaylistDragOver.bind(this)}>
                    {playlistItems}
                </ul>
            </div>
            )
        );
    }
}

export default NonInteractivePlaylist;