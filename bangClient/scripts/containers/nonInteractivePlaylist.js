import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import $ from 'jquery';

import { guid } from '../utilities/utils';

import ImagePlaylistItem from '../badm/imagePlaylistItem';
import MediaState from '../badm/mediaState';

import { addMediaStateToNonInteractivePlaylist } from '../actions/index';
import { getThumb } from '../platform/actions';

class NonInteractivePlaylist extends Component {

    handlePlaylistDragOver (event) {

        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }

    // getSelectedZonePlaylist() {
    //
    //     if (this.props.sign && this.props.sign.zoneIds.length > 0 && this.props.zones && this.props.zones.zonesById) {
    //         const selectedZone = this.props.zones.zonesById[this.props.sign.zoneIds[0]];
    //         return this.props.zonePlaylists.zonePlaylistsById[selectedZone.zonePlaylistId];
    //     }
    //     return null;
    // }

    getSelectedZonePlaylist() {

        if (this.props.sign && this.props.sign.zoneIds.length > 0 && this.props.zones && this.props.zones.zonesById) {
            const selectedZone = this.props.zones.zonesById[this.props.sign.zoneIds[0]];
            if (selectedZone) {
                const zonePlaylistId = selectedZone.zonePlaylistId;
                const zonePlaylist = this.props.zonePlaylists.zonePlaylistsById[zonePlaylistId];
                return zonePlaylist;
            }
        }
        return null;
    }

    
    getDropIndex(event) {

        let numberOfMediaStates = 0;
        const selectedZonePlaylist = this.getSelectedZonePlaylist();
        if (selectedZonePlaylist) {
            numberOfMediaStates = Object.keys(selectedZonePlaylist.mediaStatesById).length;
        }

        let index = -1;
        let indexOfDropTarget = -1;

        const offset = $("#" + event.target.id).offset();
        const left = event.pageX - offset.left;
        let targetWidth = event.target.width;
        if (targetWidth == undefined) {
            targetWidth = $("#" + event.target.id).outerWidth();
        }

        indexOfDropTarget = Number(event.target.dataset.index);

        if (left < (targetWidth / 2)) {
            index = indexOfDropTarget;
        }
        else if (indexOfDropTarget <= (numberOfMediaStates - 1)) {
            index = indexOfDropTarget + 1;
        }

        return index;
    }



    // addMediaStateToNonInteractivePlaylist(operation, type, stateName, path, sourceIndex, destinationIndex) {
    //
    //     console.log(arguments);
    //
    //     const selectedZonePlaylist = this.getSelectedZonePlaylist();
    //
    //     this.props.addMediaStateToNonInteractivePlaylist(selectedZonePlaylist, operation, type, stateName, path, sourceIndex, destinationIndex);
    // }


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

        // index == -1 => drop item at end of list
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

        // specify playlist item to drop
        let playlistItem = null;
        if (type === "image") {
            const selectedZonePlaylist = this.getSelectedZonePlaylist();
            this.props.addMediaStateToNonInteractivePlaylist(selectedZonePlaylist, operation, type, stateName, path, startIndex, index);
            // playlistItem = this.addMediaStateToNonInteractivePlaylist(operation, type, stateName, path, startIndex, index);
        }
    }


    getMediaStatesJSX(selectedZonePlaylist) {

        const self = this;

        const transitionsById = this.props.transitions.transitionsById;

        let mediaStates = [];

        const initialMediaStateId = selectedZonePlaylist.initialMediaStateId;
        let mediaState = selectedZonePlaylist.mediaStatesById[initialMediaStateId];
        mediaStates.push(mediaState);

        while (mediaState.transitionOutIds && mediaState.transitionOutIds.length === 1) {
            const transitionOutId = mediaState.transitionOutIds[0];
            const transition = transitionsById[transitionOutId];
            const targetMediaStateId = transition.targetMediaStateId;
            mediaState = selectedZonePlaylist.mediaStatesById[targetMediaStateId];
            mediaStates.push(mediaState);
        }

        let dataIndex = -1;

        let mediaStatesJSX = mediaStates.map(function (mediaState, index) {

            dataIndex++;

            const id = mediaState.getId();
            const fileName = mediaState.getFileName();
            let filePath = "";

            let className = "";
            // if (self.props.selectedPlaylistItemId && self.props.selectedPlaylistItemId === id) {
            //     className = "selectedImage ";
            // }

            const mediaPlaylistItem = mediaState.getMediaPlaylistItem();

            if (mediaPlaylistItem instanceof ImagePlaylistItem) {
                filePath = mediaPlaylistItem.getFilePath();
                if (self.props.mediaThumbs.hasOwnProperty(filePath)) {

                    const mediaItem = self.props.mediaThumbs[filePath];
                    const thumb = getThumb(mediaItem);
                    className += "mediaLibraryThumbImg";

                    // onClick={() => self.onSelectPlaylistItem(playlistItem)}
                    // {/*draggable={true}*/}
                    // {/*onDragStart={self.playlistDragStartHandler}*/}
                    // {/*data-name={fileName}*/}
                    // {/*data-path={filePath}*/}
                    // {/*data-type="image"*/}

                    return (
                        <li className="flex-item mediaLibraryThumbDiv" key={index} data-index={dataIndex} id={"mediaThumb" + dataIndex.toString()}>
                            <img
                                id={id}
                                src={thumb}
                                className={className}
                                data-index={dataIndex}
                            />
                            <p className="mediaLibraryThumbLbl" id={"mediaLbl" + dataIndex.toString()}>{fileName}</p>
                        </li>
                    );

                }
                else {
                    return (
                        <li key={id} data-index={dataIndex} id={"mediaThumb" + dataIndex.toString()}>
                            <p className="mediaLibraryThumbLbl">{fileName}</p>
                        </li>
                    );
                }

            }
        });

        return mediaStatesJSX;
    }

    render() {

        let selectedZonePlaylist = null;
        let numberOfMediaStates = 0;
        let mediaStatesJSX = null;

        selectedZonePlaylist = this.getSelectedZonePlaylist();
        if (selectedZonePlaylist) {
            numberOfMediaStates = Object.keys(selectedZonePlaylist.mediaStatesById).length;
        }

        if (numberOfMediaStates > 0) {
            mediaStatesJSX = this.getMediaStatesJSX(selectedZonePlaylist);
        }
        else {
            mediaStatesJSX =
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
                    {mediaStatesJSX}
                </ul>
            </div>
            )
        );
    }
}


NonInteractivePlaylist.propTypes = {
    sign: React.PropTypes.object.isRequired,
    zones: React.PropTypes.object.isRequired,
    zonePlaylists: React.PropTypes.object.isRequired,
    mediaThumbs: React.PropTypes.object.isRequired,
    transitions: React.PropTypes.object.isRequired,
};


function mapStateToProps(state) {
    return {
        // mediaStates: state.mediaStates,
        // transitions: state.transitions,

        sign: state.sign,
        zones: state.zones,
        zonePlaylists: state.zonePlaylists,
        transitions: state.transitions
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ addMediaStateToNonInteractivePlaylist },
        dispatch);
}

NonInteractivePlaylist.propTypes = {
    addMediaStateToNonInteractivePlaylist: React.PropTypes.func.isRequired,
};


export default connect(null, mapDispatchToProps)(NonInteractivePlaylist);
