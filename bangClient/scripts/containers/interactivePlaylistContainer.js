import React, { Component } from 'react';

import $ from 'jquery';

import InteractivePlaylist from '../components/interactivePlaylist';

import ImagePlaylistItem from '../badm/imagePlaylistItem';
import TransitionEventIcon from '../components/TransitionEventIcon';

const mouseStateNone = "none";
const mouseStateMoveMediaState = "moveMediaState";
const mouseStateCreateTransition = "createTransition";

import MediaStateThumb from '../components/mediaStateThumb';

class InteractivePlaylistContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            zoomValue: 100,
            x1: -1,
            y1: -1,
            x2: -1,
            y2: -1
        };

        this.mouseState = mouseStateNone;

        this.mediaStateBtnWidth = 110;
        this.mediaStateBtnHeight = 90;

    }

    handleZoomValueChanged(updatedZoomValue) {
        this.setState ({ zoomValue: updatedZoomValue });
    }

    componentDidMount() {

        var self = this;

        this.playlistOffset = $("#interactiveCanvasDiv").offset();
    }

    playlistDragOverHandler (ev) {

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    }

    playlistDropHandler (ev) {

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

        const zoomScaleFactor = 100 / this.state.zoomValue;

        const pt = this.getCorrectedPoint(
            { x: ev.pageX, y: ev.pageY}
        );
        const x = pt.x;
        const y = pt.y;

        // specify playlist item to drop
        let mediaState = null;
        if (type === "image") {
            // offset image to center it around the drop point
            const mediaStateX = x - (this.mediaStateBtnWidth/2);
            const mediaStateY = y - (this.mediaStateBtnHeight/2);
            mediaState = this.props.onDropMediaState(mediaStateX, mediaStateY, operation, type, stateName, path);
        }

        if (mediaState) {
            this.onSelectMediaState(mediaState);
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

    onSelectZone(event) {
        console.log("onSelectZone invoked");
    }

    onSelectMediaState(mediaState) {

        console.log("interactivePlaylistContainer.js::onSelectMediaState");
        console.log("mediaState.FileName is: ", mediaState.getFileName());
        console.log("mediaState.Id is: ", mediaState.getId());

        this.props.onSelectMediaState(mediaState);
    }

    onSelectBSEvent(bsEvent) {
        this.props.onSelectBSEvent(bsEvent);
    }

    onSelectTimeoutEvent() {
        console.log("select timeoutEvent ");
        this.props.onSetActiveBSEventType("timeout");
    }

    onSelectMediaEndEvent() {
        console.log("select mediaEndEvent ");
        this.props.onSetActiveBSEventType("mediaEnd");
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

    onPlaylistMouseDown(event) {
        console.log("onPlaylistMouseDown");
        this.mouseState = mouseStateNone;
        event.stopPropagation();
    }

    onPlaylistMouseMove(event) {
        console.log("onPlaylistMouseMove");
        this.processMouseMove(event);
    }

    onPlaylistMouseUp(event) {
        console.log("onPlaylistMouseUp");
        this.processMouseUp(event);
    }

    onBSEventMouseDown(bsEvent) {
        this.onSelectBSEvent(bsEvent);
    }

    handleMediaStateMouseDown(event, mediaState) {

        this.onSelectMediaState(mediaState);

        console.log("handleMediaStateMouseDown");

        this.mouseState = mouseStateCreateTransition;

        const pt = this.getCorrectedPoint(
            { x: event.clientX, y: event.clientY }
        );

        console.log("setState ipc::handleMediaStateMouseDown");

        this.setState ({ x1: pt.x, y1: pt.y, x2: -1, y2: -1 });

        event.stopPropagation();
    }

    onMediaStateMouseMove(event) {
        console.log("onMediaStateMouseMove");
        this.processMouseMove(event);
    }

    onMediaStateMouseUp(event) {
        console.log("onMediaStateMouseUp");
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
                    this.props.onAddTransition(event.target.id);
                }
                break;
        }
        this.processMouseUp(event);
    }

    processMouseMove(event) {

        if (this.mouseState != mouseStateNone) {
            const pt = this.getCorrectedPoint(
                { x: event.clientX, y: event.clientY }
            );
            console.log("setState ipc::processMouseMove");
            this.setState ({ x2: pt.x });
            this.setState ({ y2: pt.y });
        }

        event.stopPropagation();
    }

    processMouseUp(event) {

        this.mouseState = mouseStateNone;

        console.log("setState ipc::processMouseUp");
        this.setState ({ x1: -1});
        this.setState ({ y1: -1});
        this.setState ({ x2: -1});
        this.setState ({ y2: -1});

        event.stopPropagation();
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



    render() {

        let self = this;

        let zoneId = "";

        let currentMediaStates = [];
        let currentMediaStateIds = [];

        const currentZonePlaylist = this.props.getCurrentZonePlaylist();
        if (currentZonePlaylist) {
            currentMediaStateIds = currentZonePlaylist.mediaStateIds;
        }

        let openCloseLabel = "=>";
        if (!this.props.propertySheetOpen) {
            openCloseLabel = "<=";
        }

        let dataIndex = -4;
        let mediaStates = null;
        let transitionLines = '';

        let svgData = '';
        let svgLines = '';
        let svgLineData = [];

        let bsEventCoordinates = [];
        let transitionCoordinates = [];

        let transitionsToRender = [];

        if (this.state.x1 >= 0 && this.state.y1 >= 0 && this.state.x2 >= 0 && this.state.y2 >= 0) {

            switch (this.mouseState) {
                case mouseStateNone:
                    break;
                case mouseStateMoveMediaState:
                    break;
                case mouseStateCreateTransition:
                    const selectedMediaState = self.props.mediaStates.mediaStatesById[self.props.selectedMediaStateId];

                    const xStart = selectedMediaState.x + this.mediaStateBtnWidth/2;
                    const yStart = selectedMediaState.y + this.mediaStateBtnHeight;

                    const xEnd = this.state.x2;
                    const yEnd = this.state.y2;

                    svgLineData.push({x1: xStart, y1: yStart, x2: xEnd, y2: yEnd});
                    break;
            }
        }

        // retrieve transition lines
        transitionsToRender.forEach(transitionToRender => {
            const transitionCoordinate = transitionToRender.coordinates;
            svgLineData.push({x1: transitionCoordinate.xStart, y1: transitionCoordinate.yStart,
                x2: transitionCoordinate.xEnd, y2: transitionCoordinate.yEnd});
        });

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

        // render transition event images
        let bsEventIconStyle = {};
        bsEventIconStyle.position = "absolute";

        let bsEventIcons = transitionsToRender.map( (transitionToRender, index) => {

            return (
                <TransitionEventIcon
                    selectedBSEventId={this.props.selectedBSEventId}
                    transitionToRender={transitionToRender}
                    onMouseDown={this.onBSEventMouseDown.bind(this)}
                    key={500 + index}
                />
            )
        });

        let zoomStyle = {};
        const zoomValueStr = (this.state.zoomValue/100).toString();
        zoomStyle.zoom = zoomValueStr;
        zoomStyle["MozTransform"] = "scale(" + zoomValueStr + ")";

        return (
          <InteractivePlaylist
              openCloseLabel={openCloseLabel}

              onSelectTimeoutEvent={this.onSelectTimeoutEvent.bind(this)}
              onSelectMediaEndEvent={this.onSelectMediaEndEvent.bind(this)}
              playlistDropHandler={this.playlistDropHandler.bind(this)}
              playlistDragOverHandler={this.playlistDragOverHandler.bind(this)}
              playlistDragStartHandler={this.playlistDragStartHandler.bind(this)}
              
              onSetActiveBSEventType={this.props.onSetActiveBSEventType}
              onSelectMediaState={this.props.onSelectMediaState}
              onToggleOpenClosePropertySheet={this.props.onToggleOpenClosePropertySheet}
              onSelectBSEvent={this.props.onSelectBSEvent}
              propertySheetOpen = {this.props.propertySheetOpen}
              getCurrentZone = {this.props.getCurrentZone}
              getCurrentZonePlaylist = {this.props.getCurrentZonePlaylist}
              onDropMediaState={this.props.onDropMediaState}
              onAddTransition={this.props.onAddTransition}
              onDeleteMediaState={this.props.onDeleteMediaState}
              mediaStates= {this.props.mediaStates}
              transitions={this.props.transitions}
              mediaThumbs={self.props.mediaThumbs}
              selectedMediaStateId={self.props.selectedMediaStateId}
              selectedBSEventId={this.props.selectedBSEventId}
              activeBSEventType={this.props.activeBSEventType}

              onPlaylistMouseDown={self.onPlaylistMouseDown.bind(this)}
              onPlaylistMouseMove={self.onPlaylistMouseMove.bind(this)}
              onPlaylistMouseUp={self.onPlaylistMouseUp.bind(this)}
              onMediaStateMouseDown={self.handleMediaStateMouseDown.bind(this)}

              onMediaStateMouseMove={self.onMediaStateMouseMove.bind(this)}
              onMediaStateMouseUp={self.onMediaStateMouseUp.bind(this)}
              processMouseMove={self.processMouseMove.bind(this)}
              processMouseUp={self.processMouseUp.bind(this)}
              
              x1={this.state.x1}
              y1={this.state.y1}
              x2={this.state.x2}
              y2={this.state.y2}
              mouseState={this.mouseState}
              
              zoomValue={this.state.zoomValue}
              onZoomValueChanged={this.handleZoomValueChanged.bind(this)}
          />
        );
    }
}

export default InteractivePlaylistContainer;