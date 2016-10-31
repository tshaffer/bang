import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import $ from 'jquery';

import { guid } from '../utilities/utils';

import { baGetMediaStateIdsForZone, baGetMediaStateById} from '@brightsign/badatamodel';
import { baGetZoneCount, baGetZonesForSign } from '@brightsign/badatamodel';
import { isMediaStateSelected, isLastSelectedMediaState } from '../reducers/reducerSelectedMediaStates';

import { addMediaStateToNonInteractivePlaylist, selectMediaState, deselectAllMediaStates } from '../actions/index';

import MediaObject from '../components/mediaObject';

class NonInteractivePlaylist extends Component {

    playlistDragStartHandler(ev) {

        ev.dataTransfer.setData("path", ev.target.dataset.path);
        ev.dataTransfer.setData("name", ev.target.dataset.name);
        ev.dataTransfer.setData("type", ev.target.dataset.type);
        ev.dataTransfer.setData("index", ev.target.dataset.index);

        ev.dataTransfer.dropEffect = "move";
        ev.dataTransfer.effectAllowed = 'move';
    }


// NEW CODE
    getDropIndex(event) {

        const playlistItemsUl = document.getElementById("playlistItemsUl");

        // console.log(event);
        // console.log("event.target.id = ", event.target.id);
        // console.log("event.pageX = ", event.pageX);
        // console.log("event.clientX = ", event.clientX);
        // console.log("event.screenX = ", event.screenX);

        // console.log("playlistItemsUl.offsetLeft = ", playlistItemsUl.offsetLeft);
        // console.log("getClientBoundingRect:");
        // console.log(playlistItemsUl.getBoundingClientRect());
        // console.log("getClientRects:");
        // console.log(playlistItemsUl.getClientRects());
        const left = event.pageX - playlistItemsUl.getBoundingClientRect().left;
        console.log("left=",left);

        let index = -1;
        let indexOfDropTarget = -1;

        // let numberOfMediaStates = 0;
        // const selectedZonePlaylist = this.getSelectedZonePlaylist();
        // if (selectedZonePlaylist) {
        //     numberOfMediaStates = Object.keys(this.props.mediaStates.mediaStatesById).length;
        // }
        //

        // following no longer works
        // const offset = $("#" + event.target.id).offset();
        // const left = event.pageX - offset.left;

        let targetWidth = event.target.width;
        if (targetWidth == undefined) {
            targetWidth = $("#" + event.target.id).outerWidth();
        }

        indexOfDropTarget = Number(event.target.dataset.index);
        console.log("indexOfDropTarget = ", indexOfDropTarget);

        if (left < (targetWidth / 2)) {
            index = indexOfDropTarget;
        }
        // else if (indexOfDropTarget <= (numberOfMediaStates - 1)) {
        //     index = indexOfDropTarget + 1;
        // }
        else {
            index = indexOfDropTarget + 1;
        }

        return index;
    }
// END OF NEW CODE


    handlePlaylistDragOver (event) {

        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }

    handlePlaylistDrop (event) {

        event.preventDefault();

// NEW CODE
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
// END OF NEW CODE

        // get dropped playlist item
        let stateName = event.dataTransfer.getData("name");
        const path = event.dataTransfer.getData("path");
// NEW CODE
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
// END OF NEW CODE

        this.props.addMediaStateToNonInteractivePlaylist(stateName, path);
    }

    handleNoMediaStateSelected(event) {
        this.props.deselectAllMediaStates();
    }

    handleSelectMediaStateRange(mediaStateId) {
        console.log("handleSelectMediaStateRange:", mediaStateId);

        // select all media states between the last selected media state and the specific media state
        if (this.props.lastSelectedMediaStateId == "") {
            // if no prior selected media state, just select this one
            this.props.selectMediaState(mediaStateId);
        }
        else {
            let indexOfAnchor = -1;
            let indexOfSelected = -1;
            this.props.allMediaStates.forEach( (mediaState, index) => {
                if ( mediaState.id == this.props.lastSelectedMediaStateId ) {
                    indexOfAnchor = index;
                }
                else if ( mediaState.id == mediaStateId ) {
                    indexOfSelected = index;
                }
            });

            if (indexOfAnchor < indexOfSelected) {
                for (let i = indexOfAnchor; i <= indexOfSelected; i++ ) {
                    this.props.selectMediaState(this.props.allMediaStateIds[i]);
                }
            }
            else {
                for (let i = indexOfAnchor; i >= indexOfSelected; i-- ) {
                    this.props.selectMediaState(this.props.allMediaStateIds[i]);
                }
            }
        }
    }

    getMediaStatesJSX() {

        const self = this;

        if (self.props && self.props.allMediaStateIds && self.props.allMediaStateIds.length > 0) {

            let dataIndex = -1;

            let mediaStatesJSX = self.props.allMediaStateIds.map( (mediaStateId, index) => {

                dataIndex++;

                return (
                    <MediaObject
                        mediaStateId={mediaStateId}
                        key={dataIndex}
                        dataIndex={dataIndex}
                        mediaThumbs={this.props.mediaThumbs}
                        onSelectMediaStateRange={this.handleSelectMediaStateRange.bind(this)}
                    />
                );
            });

            return mediaStatesJSX;

        }

        return null;
    }


    render() {

        let mediaStatesJSX = null;

        let numberOfMediaStates = this.props.allMediaStateIds.length;

        if (numberOfMediaStates > 0) {
            mediaStatesJSX = this.getMediaStatesJSX();
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
                onClick={(ev) => this.handleNoMediaStateSelected(ev)}
            >
                <div className="playlistHeaderDiv" id="playlistHeaderDiv"/>
                <ul
                    id="playlistItemsUl"
                    className="playlist-flex-container wrap"
                    onDrop={this.handlePlaylistDrop.bind(this)}
                    onDragOver={this.handlePlaylistDragOver.bind(this)}>
                    {mediaStatesJSX}
                </ul>
            </div>
            )
        );
    }
}

function mapStateToProps(reduxState) {

    const { app, badm } = reduxState;

    let mediaStateIds = [];
    let mediaStates = [];
    let lastSelectedMediaStateId = "";

    const zoneCount = baGetZoneCount(badm);
    if (zoneCount === 1) {
        const zoneIds = baGetZonesForSign(badm);
        // assert zoneIds.length === 1
        const zoneId = zoneIds[0];
        mediaStateIds = baGetMediaStateIdsForZone(badm, {id: zoneId});

        mediaStateIds.forEach( (mediaStateId) => {

            let mediaState = baGetMediaStateById(badm, { id: mediaStateId} );

            mediaState.isSelected = isMediaStateSelected(app, mediaStateId);

            const isLastSelected = isLastSelectedMediaState(app, mediaStateId);
            if (isLastSelected) {
                lastSelectedMediaStateId = mediaStateId;    // used this one, so the others are unnecessary
                mediaState.isLastSelected = true;           // unnecessary I think
            }
            else {
                mediaState.isLastSelected = false;          // unnecessary I think
            }
            mediaStates.push(mediaState);

        });
    }

    return {
        allMediaStateIds: mediaStateIds,
        allMediaStates: mediaStates,
        lastSelectedMediaStateId
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return bindActionCreators(
        { addMediaStateToNonInteractivePlaylist, selectMediaState, deselectAllMediaStates },
        dispatch);
}

NonInteractivePlaylist.propTypes = {
    mediaThumbs: React.PropTypes.object.isRequired,
    addMediaStateToNonInteractivePlaylist: React.PropTypes.func.isRequired,
    selectMediaState: React.PropTypes.func.isRequired,
    deselectAllMediaStates: React.PropTypes.func.isRequired,
    allMediaStateIds: React.PropTypes.array.isRequired,
    allMediaStates: React.PropTypes.array.isRequired,
    lastSelectedMediaStateId: React.PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(NonInteractivePlaylist);
