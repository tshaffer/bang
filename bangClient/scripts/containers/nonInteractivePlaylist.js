import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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



    addMediaStateToNonInteractivePlaylist(operation, type, stateName, path, sourceIndex, destinationIndex) {

        // ignore type for now
        // stateName is fileName
        // hard code values for timeOnScreen, transition, transitionDuration, videoPlayerRequired
        // const playlistItem = new ImagePlaylistItem (stateName, path, 6, 0, 2, false);
        // const mediaState = new MediaState (playlistItem, 0, 0);

        // from interactivePlaylist
        //      this.props.newMediaState(mediaState);
        //      this.props.addMediaStateToZonePlaylist(selectedZonePlaylistId, mediaState.getId());

        // from master (old nonInteractivePlaylist)
        //      this.props.newPlaylistItem(playlistItem);
        //      this.props.addPlaylistItemToZonePlaylist(currentZonePlaylistId, playlistItem.getId(), destinationIndex);

        // what needs to be done
        //      create playlistItem based on what was dropped (done)
        //      create media state from playlistItem (done)
        //      is there a prior item? if yes,
        //          create transition out from prior item to this item
        //      is there a following item? if yes,
        //          create transition in from this item to following item
        //      do these last two items get done here or in redux / action land?
        //      in interactivePlaylist, what's done where?
        //          transition is created here, but it's added to the store, specifying source and destination in redux land

        // proposal
        //  react understands at a high level what needs to be done; gets all the information based on the UI and passes that information on to redux
        //  what redux would need
        //          all parameters passed to this function (type may be questionable in my opinion)
        //          what is sourceIndex used for?
        //              it's required for the 'move' operation.
        console.log(arguments);

        const selectedZonePlaylist = this.getSelectedZonePlaylist();

        this.props.addMediaStateToNonInteractivePlaylist(selectedZonePlaylist, operation, type, stateName, path, sourceIndex, destinationIndex);
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
            playlistItem = this.addMediaStateToNonInteractivePlaylist(operation, type, stateName, path, startIndex, index);
        }
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


    getMediaStatesJSX(selectedZonePlaylist) {

        const self = this;

        const initialMediaStateId = selectedZonePlaylist.initialMediaStateId;
        const mediaState = selectedZonePlaylist.mediaStatesById[initialMediaStateId];

        // only support one state - initial testing
        let mediaStates = [];
        mediaStates.push(mediaState);

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
};


function mapStateToProps(state) {
    return {
        // mediaStates: state.mediaStates,
        // transitions: state.transitions,

        sign: state.sign,
        zones: state.zones,
        zonePlaylists: state.zonePlaylists,
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
