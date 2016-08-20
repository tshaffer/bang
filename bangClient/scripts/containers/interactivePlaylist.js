import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import $ from 'jquery';

import ImagePlaylistItem from '../badm/imagePlaylistItem';
import MediaState from '../badm/mediaState';
import Transition from '../badm/transition';
import TransitionEventIcon from '../components/TransitionEventIcon';
import UserEvent from '../badm/userEvent';

const mouseStateNone = "none";
const mouseStateMoveMediaState = "moveMediaState";
const mouseStateCreateTransition = "createTransition";

import MediaStateThumb from '../components/mediaStateThumb';

import { newMediaState, addMediaStateToZonePlaylist, updateMediaState, deleteMediaState, addTransition }
    from '../actions/index';


class InteractivePlaylist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            zoomValue: 100,
            x1: -1,
            y1: -1,
            x2: -1,
            y2: -1,
            selectedBSEventId: null,
            activeBSEventType: "timeout",
        };

        this.mouseState = mouseStateNone;

        this.mediaStateBtnWidth = 110;
        this.mediaStateBtnHeight = 90;
    }

    componentWillMount() {
    }

    componentDidMount() {

        var self = this;

        this.playlistOffset = $("#interactiveCanvasDiv").offset();

        document.addEventListener('keydown', (event) => {
            if (event.keyCode == 8 || event.keyCode == 46) {       // delete key or backspace key
                // check to see if playlistItem has focus
                self.handleDeleteMediaState();
            }
        });

        const zoomValue = document.getElementById("zoomSlider");
        if (zoomValue != undefined) {
            zoomValue.addEventListener("input", function () {
                if (self.zoomValue != zoomValue.value) {
                    console.log("setState on zoomValue from interactivePlaylist");
                    self.handleZoomValueChanged(zoomValue.value);
                }
            }, false);
        }
    }

    getCurrentZone() {

        let selectedZone = null;
        if (this.props.sign && this.props.sign.zoneIds.length > 0 && this.props.zones && this.props.zones.zonesById) {

            if (!this.props.selectedZone) {
                selectedZone = this.props.zones.zonesById[this.props.sign.zoneIds[0]];
            }
            else {
                selectedZone = this.props.selectedZone;
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

    handleDeleteMediaState() {

        const currentZonePlaylist = this.getCurrentZonePlaylist();
        if (currentZonePlaylist) {
            const currentZonePlaylistId = currentZonePlaylist.id;
            const mediaState = this.props.mediaStates.mediaStatesById[this.props.selectedMediaStateId];

            this.props.deleteMediaState(currentZonePlaylistId, mediaState);
        }
        else {
            return;
        }
    }


    handleZoomValueChanged(updatedZoomValue) {
        this.setState ({ zoomValue: updatedZoomValue });
    }


    executeDropMediaState(x, y, operation, type, stateName, path) {

        let mediaState = null;
        let currentZonePlaylistId = null;

        const currentZonePlaylist = this.getCurrentZonePlaylist();
        if (currentZonePlaylist) {
            currentZonePlaylistId = currentZonePlaylist.id;
        }
        else {
            return;
        }

        if (operation === "copy" ) {
            if (type === "image") {
                const playlistItem = new ImagePlaylistItem (stateName, path, 6, 0, 2, false);
                mediaState = new MediaState (playlistItem, x, y);
            }

            this.props.newMediaState(mediaState);
            this.props.addMediaStateToZonePlaylist(currentZonePlaylistId, mediaState.getId());
        }
        else {

            mediaState = this.props.mediaStates.mediaStatesById[this.props.selectedMediaStateId];

            // TODO - the following loses transitionOutIds and transitionInIds
            // TODO - fix it properly
            const updatedMediaState = new MediaState(mediaState.getMediaPlaylistItem(), x, y);

            // restore them
            mediaState.transitionOutIds.forEach( transitionOutId => {
                updatedMediaState.getTransitionOutIds().push(transitionOutId);
            });
            mediaState.transitionInIds.forEach( transitionInId => {
                updatedMediaState.getTransitionInIds().push(transitionInId);
            });
            this.props.updateMediaState(this.props.selectedMediaStateId, updatedMediaState);
        }

        return mediaState;
    }


    handleDropMediaState (ev) {

        ev.preventDefault();

        // copy or move?
        let operation = "";
        let startIndex = -1;
        if (ev.dataTransfer.effectAllowed === "move") {
            operation = "move";
        }
        else {
            operation = "copy";
        }

        // get dropped playlist item
        const stateName = ev.dataTransfer.getData("name");
        const path = ev.dataTransfer.getData("path");
        const type = ev.dataTransfer.getData("type");

        // get position of drop
        const zoomScaleFactor = 100 / this.state.zoomValue;
        const pt = this.getCorrectedPoint(
            { x: ev.pageX, y: ev.pageY}
        );
        const x = pt.x;
        const y = pt.y;

        // specify playlist item to drop and perform drop
        let mediaState = null;
        if (type === "image") {
            // offset image to center it around the drop point
            const mediaStateX = x - (this.mediaStateBtnWidth/2);
            const mediaStateY = y - (this.mediaStateBtnHeight/2);
            mediaState = this.executeDropMediaState(mediaStateX, mediaStateY, operation, type, stateName, path);
        }

        if (mediaState) {
            this.handleSelectMediaState(mediaState);
        }
    }

    getCorrectedPoint(inputPoint) {

        const zoomScaleFactor = 100 / this.state.zoomValue;

        let x = inputPoint.x - this.playlistOffset.left;
        let y = inputPoint.y - this.playlistOffset.top;

        // adjust x, y locations based on zoom value
        x *= zoomScaleFactor;
        y *= zoomScaleFactor;

        const outputPoint =
        {
            x,
            y
        };
        return outputPoint;
    }

    playlistDragOverHandler (ev) {

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    }


    handleSetActiveBSEventType(bsEventType) {
        this.setState({ activeBSEventType: bsEventType });
    }

    onSelectTimeoutEvent() {
        console.log("select timeoutEvent ");
        this.handleSetActiveBSEventType("timeout");
    }

    onSelectMediaEndEvent() {
        console.log("select mediaEndEvent ");
        this.handleSetActiveBSEventType("mediaEnd");
    }

    onBSEventMouseDown(bsEvent) {
        this.props.setSelectedMediaStateId( null );
        this.setState({ selectedBSEventId: bsEvent.getId() });
    }

    getTransitionCoordinates(sourceMediaState, targetMediaState) {

        let transitionCoordinates = {};

        const xStart = sourceMediaState.x + this.mediaStateBtnWidth/2;
        const yStart = sourceMediaState.y + this.mediaStateBtnHeight;

        const xEnd = targetMediaState.x + this.mediaStateBtnWidth/2;
        const yEnd = targetMediaState.y;

        transitionCoordinates.xStart = xStart;
        transitionCoordinates.yStart = yStart;
        transitionCoordinates.xEnd = xEnd;
        transitionCoordinates.yEnd = yEnd;

        transitionCoordinates.xCenter = (xStart + xEnd) / 2;
        transitionCoordinates.yCenter = (yStart + yEnd) / 2;

        return transitionCoordinates;
    }

    getTransitionToRender(transition, sourceMediaState, targetMediaState) {

        let transitionToRender = {};
        transitionToRender.coordinates = this.getTransitionCoordinates(sourceMediaState, targetMediaState);
        transitionToRender.transition = transition;

        return transitionToRender;
    }

    playlistDragStartHandler(ev) {

        ev.dataTransfer.setData("path", ev.target.dataset.path);
        ev.dataTransfer.setData("name", ev.target.dataset.name);
        ev.dataTransfer.setData("type", ev.target.dataset.type);
        ev.dataTransfer.setData("index", ev.target.dataset.index);

        // I don't think the following statement is necessarily correct
        ev.dataTransfer.dropEffect = "move";
        ev.dataTransfer.effectAllowed = 'move';
    }


    handleSelectMediaState(mediaState) {

        console.log("interactivePlaylistContainer.js::onSelectMediaState");
        console.log("mediaState.FileName is: ", mediaState.getFileName());
        console.log("mediaState.Id is: ", mediaState.getId());

        this.setState({ selectedBSEventId: null });
        this.props.setSelectedMediaStateId(mediaState.getId());
    }


    handleMediaStateMouseDown(event, mediaState) {

        this.handleSelectMediaState(mediaState);

        console.log("handleMediaStateMouseDown");

        this.mouseState = mouseStateCreateTransition;

        const pt = this.getCorrectedPoint(
            { x: event.clientX, y: event.clientY }
        );

        console.log("setState ipc::handleMediaStateMouseDown");

        this.setState ({ x1: pt.x, y1: pt.y, x2: -1, y2: -1 });

        event.stopPropagation();
    }

    onPlaylistMouseDown(event) {
        console.log("onPlaylistMouseDown");
        this.mouseState = mouseStateNone;
        event.stopPropagation();
    }

    processMouseMove(event) {

        if (this.mouseState != mouseStateNone) {
            const pt = this.getCorrectedPoint(
                { x: event.clientX, y: event.clientY }
            );
            console.log("setState ipc::processMouseMove");
            this.setState ({ x2: pt.x, y2: pt.y });
        }

        event.stopPropagation();
    }

    onPlaylistMouseMove(event) {
        console.log("onPlaylistMouseMove");
        this.processMouseMove(event);
    }

    handleMediaStateMouseMove(event) {
        console.log("handleMediaStateMouseMove");
        this.processMouseMove(event);
    }


    processMouseUp(event) {

        this.mouseState = mouseStateNone;

        console.log("setState ipc::processMouseUp");
        this.setState ({ x1: -1, y1: -1, x2: -1, y2: -1 });

        event.stopPropagation();
    }


    onPlaylistMouseUp(event) {
        console.log("onPlaylistMouseUp");
        this.processMouseUp(event);
    }


    handleMediaStateMouseUp(event) {
        console.log("handleMediaStateMouseUp");
        switch (this.mouseState) {
            case mouseStateNone:
                break;
            case mouseStateMoveMediaState:
                break;
            case mouseStateCreateTransition:
                // don't add transition if the target media state is same as the current media state
                if (event.target.id !== this.props.selectedMediaStateId) {
                    // console.log("create transition to " + event.target.id);
                    // create event here or in ba?
                    // send current event type to ba?
                    this.handleAddTransition(event.target.id);
                }
                break;
        }
        this.processMouseUp(event);
    }

    handleAddTransition(targetMediaStateId) {

        const sourceMediaState = this.props.mediaStates.mediaStatesById[this.props.selectedMediaStateId];
        const targetMediaState = this.props.mediaStates.mediaStatesById[targetMediaStateId];

        // create userEvent based on current selected event
        // do this here or in playlist??
        // const userEvent = new UserEvent("timeout");
        const userEvent = new UserEvent(this.state.activeBSEventType);
        userEvent.setValue("5");

        const transition = new Transition(sourceMediaState, userEvent, targetMediaState); // do this here?

        this.props.addTransition(sourceMediaState, transition, targetMediaState);
    }


    parseZonePlaylist() {

        const self = this;

        let mediaStatesToRender = [];
        let transitionsToRender = [];

        let mediaStateIds = [];

        const zonePlaylist = this.getCurrentZonePlaylist();
        if (zonePlaylist) {
            mediaStateIds = zonePlaylist.mediaStateIds;
        }

        mediaStateIds.forEach(mediaStateId => {

            const mediaState = self.props.mediaStates.mediaStatesById[mediaStateId];

            let mediaStateToRender = {};

            // x, y, id, fileName, filePath

            mediaStateToRender.mediaPlaylistItem = mediaState.getMediaPlaylistItem();
            // mediaStateToRender.mediaState = mediaState;

            mediaStateToRender.mediaState = mediaState;
            mediaStateToRender.x = mediaState.x;
            mediaStateToRender.y = mediaState.y;
            mediaStateToRender.id = mediaState.getId();
            mediaStateToRender.fileName = mediaState.getFileName();
            mediaStateToRender.filePath = mediaState.getMediaPlaylistItem().getFilePath();
            if (self.props.selectedMediaStateId && self.props.selectedMediaStateId === mediaStateId) {
                mediaStateToRender.isSelected = true;
            }
            else {
                mediaStateToRender.isSelected = false;
            }
            mediaStatesToRender.push(mediaStateToRender);

            mediaState.transitionOutIds.forEach(transitionOutId => {

                const transition = self.props.transitions.transitionsById[transitionOutId];
                const targetMediaStateId = transition.targetMediaStateId;
                const targetMediaState = self.props.mediaStates.mediaStatesById[targetMediaStateId];

                transitionsToRender.push(self.getTransitionToRender(transition, mediaState, targetMediaState));
            });
        });

        return { mediaStatesToRender, transitionsToRender };
    }
    
    generateMediaStatesJSX(mediaStatesToRender) {

        var self = this;

        let dataIndex = 7;

        let mediaStates = mediaStatesToRender.map(function (mediaStateToRender, index) {

            let className = "";
            if (self.props.selectedMediaStateId && self.props.selectedMediaStateId === mediaStateToRender.id) {
                className = "selectedImage ";
            }
            else {
                className = "unSelectedImage ";
            }

            const mediaPlaylistItem = mediaStateToRender.mediaPlaylistItem;
            if (mediaPlaylistItem instanceof ImagePlaylistItem) {
                let filePath = mediaPlaylistItem.getFilePath();
                if (self.props.mediaThumbs.hasOwnProperty(filePath)) {

                    className += "mediaStateBtn";

                    dataIndex+= 4;

// onMediaStateImgMouse...: events on the image within the media state thumb
// onMouse...: events on parts of the media state thumb outside of the thumb

                    return (
                        <MediaStateThumb

                            className={className}

                            mediaState={mediaStateToRender.mediaState}
                            x={mediaStateToRender.x}
                            y={mediaStateToRender.y}
                            id={mediaStateToRender.id}
                            fileName={mediaStateToRender.fileName}
                            filePath={mediaStateToRender.filePath}
                            isSelected={mediaStateToRender.isSelected}

                            onMediaStateImgMouseDown={self.handleSelectMediaState.bind(self)}
                            onMediaStateImgMouseMove={self.processMouseMove.bind(self)}
                            onMediaStateImgMouseUp={self.handleMediaStateMouseUp.bind(self)}

                            key={dataIndex}
                            mediaThumbs={self.props.mediaThumbs}
                            dataIndex={dataIndex}
                            playlistDragStartHandler={self.playlistDragStartHandler.bind(self)}
                            playlistDragOverHandler={self.playlistDragOverHandler.bind(self)}

                            onMouseDown={event => { self.handleMediaStateMouseDown(event, mediaStateToRender.mediaState)}}
                            onMouseMove={self.handleMediaStateMouseMove.bind(self)}
                            onMouseUp={self.handleMediaStateMouseUp.bind(self)}

                        />
                    );
                }
            }
        });

        return mediaStates;
    }

    generateTransitionsSVGLineData(transitionsToRender) {

        let svgLineData = [];

        transitionsToRender.forEach(transitionToRender => {
            const transitionCoordinate = transitionToRender.coordinates;
            svgLineData.push({x1: transitionCoordinate.xStart, y1: transitionCoordinate.yStart,
                x2: transitionCoordinate.xEnd, y2: transitionCoordinate.yEnd});
        });

        return svgLineData;

    }

    generateRubberBandSVGLineData() {

        let svgLineData = [];

        if (this.state.x1 >= 0 && this.state.y1 >= 0 && this.state.x2 >= 0 && this.state.y2 >= 0) {

            switch (this.mouseState) {
                case mouseStateNone:
                    break;
                case mouseStateMoveMediaState:
                    break;
                case mouseStateCreateTransition:
                    const selectedMediaState = this.props.mediaStates.mediaStatesById[this.props.selectedMediaStateId];

                    const xStart = selectedMediaState.x + this.mediaStateBtnWidth/2;
                    const yStart = selectedMediaState.y + this.mediaStateBtnHeight;

                    const xEnd = this.state.x2;
                    const yEnd = this.state.y2;

                    svgLineData.push({x1: xStart, y1: yStart, x2: xEnd, y2: yEnd});
                    break;
            }
        }

        return svgLineData;
    }

    generateSVGJSX(svgLineData) {

        let svgData = '';
        let svgLines = '';

        // render all line segments - transitions and rubber band
        if (svgLineData.length > 0) {

            svgLines = svgLineData.map(function (svgLine, index) {

                const x1 = svgLine.x1;
                const y1 = svgLine.y1;
                const x2 = svgLine.x2;
                const y2 = svgLine.y2;

                return (
                    <line x1={x1} y1={y1} x2={x2} y2={y2} key={index + 1000} stroke="black" fill="transparent" stroke-width="10"/>
                );
            });

            // const svgWidth = 900;
            // const svgHeight = 800;
            // HACKEY
            const pt = this.getCorrectedPoint(
                { x: 900, y: 800 }
            );

            svgData =
                <svg width={pt.x} height={pt.y}> +
                    {svgLines} +
                </svg>;
        }

        return svgData;
    }

    generateBSEventIcons(transitionsToRender) {

        var self = this;

        let bsEventIcons = transitionsToRender.map( (transitionToRender, index) => {

            return (
                <TransitionEventIcon
                    selectedBSEventId={self.props.selectedBSEventId}
                    transitionToRender={transitionToRender}
                    onMouseDown={self.onBSEventMouseDown.bind(self)}
                    key={500 + index}
                />
            )
        });

        return bsEventIcons;
    }

    generateZonePlaylistJSX(mediaStatesToRender, transitionsToRender) {

        const mediaStatesJSX = this.generateMediaStatesJSX(mediaStatesToRender);
        const bsEventsJSX = this.generateBSEventIcons(transitionsToRender);

        const rubberBandSVGLineData = this.generateRubberBandSVGLineData();
        const transitionsSVGLineData = this.generateTransitionsSVGLineData(transitionsToRender);
        const allSVGLineData = rubberBandSVGLineData.concat(transitionsSVGLineData);

        const svgJSX = this.generateSVGJSX(allSVGLineData);

        return { mediaStatesJSX, bsEventsJSX, svgJSX };
    }

    generateToolbarJSX() {

        let timeoutClassName = "unSelectedBSEvent";
        let mediaEndClassName = "unSelectedBSEvent";
        switch (this.state.activeBSEventType) {
            case "timeout":
                timeoutClassName = "selectedBSEvent";
                break;
            case "mediaEnd":
                mediaEndClassName = "selectedBSEvent";
                break;
        }

        let openCloseLabel = "=>";
        if (!this.props.propertySheetOpen) {
            openCloseLabel = "<=";
        }

        return (
            <div className="playlistHeaderDiv">
                <div>
                    <img src="images/36x36_timeout.png" className={timeoutClassName} onClick={this.onSelectTimeoutEvent.bind(this)}></img>
                    <img src="images/36x36_videoend.png" className={mediaEndClassName} onClick={this.onSelectMediaEndEvent.bind(this)}></img>
                </div>
                <button id="openCloseIcon" className="plainButton" type="button" onClick={this.props.onToggleOpenClosePropertySheet.bind(this)}>{openCloseLabel}</button>
                <input step="1" id="zoomSlider" type="range" min="0" max="100" defaultValue="100"></input>
            </div>
        );
    }

    generateInteractivePlaylistJSX(mediaStatesToRender, transitionsToRender) {
        const zonePlaylistJSX = this.generateZonePlaylistJSX(mediaStatesToRender, transitionsToRender);
        return zonePlaylistJSX;
    }

    render() {
        
        const parsedZonePlaylist = this.parseZonePlaylist();
        
        const mediaStatesToRender = parsedZonePlaylist.mediaStatesToRender;
        const transitionsToRender = parsedZonePlaylist.transitionsToRender;

        const toolbarJSX = this.generateToolbarJSX();
        const interactivePlaylistJSX = this.generateInteractivePlaylistJSX(mediaStatesToRender, transitionsToRender);

        let zoomFactor = {};
        const zoomValueStr = (this.state.zoomValue/100).toString();
        zoomFactor.zoom = zoomValueStr;
        zoomFactor["MozTransform"] = "scale(" + zoomValueStr + ")";

        return (
            <div
                className="playlistDiv"
                id="playlistDiv"
            >
                {toolbarJSX}

                <div className="interactiveCanvasDiv"
                     
                     id="interactiveCanvasDiv"
                     style={zoomFactor}

                     onDrop={this.handleDropMediaState.bind(this)}
                     onDragOver={this.playlistDragOverHandler.bind(this)}

                     onMouseDown={this.onPlaylistMouseDown.bind(this)}
                     onMouseMove={this.onPlaylistMouseMove.bind(this)}
                     onMouseUp={this.onPlaylistMouseUp.bind(this)}
                >
                    {interactivePlaylistJSX.mediaStatesJSX}
                    {interactivePlaylistJSX.svgJSX}
                    {interactivePlaylistJSX.bsEventsJSX}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        mediaStates: state.mediaStates,
        transitions: state.transitions,

        sign: state.sign,
        zones: state.zones,
        zonePlaylists: state.zonePlaylists,

    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ newMediaState, addMediaStateToZonePlaylist, updateMediaState, deleteMediaState, addTransition },
        dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(InteractivePlaylist);
