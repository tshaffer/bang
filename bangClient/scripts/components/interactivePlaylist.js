import React, { Component } from 'react';

import $ from 'jquery';

import { getThumb } from '../platform/actions';

import MediaState from '../badm/mediaState';
import ImagePlaylistItem from '../badm/imagePlaylistItem';
import HTML5PlaylistItem from '../badm/html5PlaylistItem';

import MediaStateThumb from './mediaStateThumb';
// import MediaImage from './mediaImage';
// import MediaImageLabel from './mediaImageLabel';
import TransitionEventIcon from './TransitionEventIcon';

class InteractivePlaylist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            zoomValue: 100,
            x1: -1,
            y1: -1,
            x2: -1,
            y2: -1
        };

        // this.mouseState = mouseStateNone;

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
                self.props.onDeleteMediaState();
            }
        });

        const zoomValue = document.getElementById("zoomSlider");
        if (zoomValue != undefined) {
            zoomValue.addEventListener("input", function () {
                if (self.state.zoomValue != zoomValue.value) {
                    console.log("setState on zoomValue from interactivePlaylist");
                    self.setState ({ zoomValue: zoomValue.value });
                }
            }, false);
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

        console.log("playlist.js::onSelectMediaState");
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

    onBSEventMouseDown(bsEvent) {
        this.onSelectBSEvent(bsEvent);
    }

    handleMediaStateMouseDown(event, mediaState) {
        // this.props.onMediaStateMouseDown(event, mediaState);
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

        // if (this.state.x1 >= 0 && this.state.y1 >= 0 && this.state.x2 >= 0 && this.state.y2 >= 0) {
        //
        //     switch (this.mouseState) {
        //         case mouseStateNone:
        //             break;
        //         case mouseStateMoveMediaState:
        //             break;
        //         case mouseStateCreateTransition:
        //             const selectedMediaState = self.props.mediaStates.mediaStatesById[self.props.selectedMediaStateId];
        //
        //             const xStart = selectedMediaState.x + this.mediaStateBtnWidth/2;
        //             const yStart = selectedMediaState.y + this.mediaStateBtnHeight;
        //
        //             const xEnd = this.state.x2;
        //             const yEnd = this.state.y2;
        //
        //             svgLineData.push({x1: xStart, y1: yStart, x2: xEnd, y2: yEnd});
        //             break;
        //     }
        // }

        if (currentMediaStateIds.length > 0) {

            currentMediaStateIds.forEach( currentMediaStateId => {
                currentMediaStates.push(self.props.mediaStates.mediaStatesById[currentMediaStateId]);
            });

            mediaStates = currentMediaStates.map(function (mediaState, index) {
                const id = mediaState.getId();
                const fileName = mediaState.getFileName();
                let filePath = "";

                let className = "";
                if (self.props.selectedMediaStateId && self.props.selectedMediaStateId === id) {
                    className = "selectedImage ";
                }
                else {
                    className = "unSelectedImage ";
                }

                mediaState.transitionOutIds.forEach(transitionOutId => {

                    const transition = self.props.transitions.transitionsById[transitionOutId];
                    const targetMediaStateId = transition.targetMediaStateId;
                    const targetMediaState = self.props.mediaStates.mediaStatesById[targetMediaStateId];

                    transitionsToRender.push(self.getTransitionToRender(transition, mediaState, targetMediaState));
                });

                const mediaPlaylistItem = mediaState.getMediaPlaylistItem();
                if (mediaPlaylistItem instanceof ImagePlaylistItem) {
                    filePath = mediaPlaylistItem.getFilePath();
                    if (self.props.mediaThumbs.hasOwnProperty(filePath)) {

                        className += "mediaStateBtn";

                        let mediaStateBtnStyle = {};

                        const leftOffset = mediaState.x.toString();
                        const topOffset = mediaState.y.toString();

                        mediaStateBtnStyle.left = leftOffset+"px";
                        mediaStateBtnStyle.top = topOffset + "px";

                        const id = mediaPlaylistItem.getId();

                        dataIndex+= 4;

                        return (
                            <MediaStateThumb

                                mediaState={mediaState}
                                className={className}

                                onSelectMediaState={self.onSelectMediaState.bind(self)}
                                onMediaStateMouseUp={self.props.onMediaStateMouseUp}


                                key={dataIndex}
                                mediaThumbs={self.props.mediaThumbs}
                                dataIndex={dataIndex}
                                playlistDragStartHandler={self.props.playlistDragStartHandler}
                                playlistDragOverHandler={self.props.playlistDragOverHandler}
                                onMouseDown={event => { self.handleMediaStateMouseDown(event, mediaState)}}
                                onMouseMove={self.props.onMediaStateMouseMove}
                                onMouseUp={self.props.onMediaStateMouseUp}

                                onMoveSelectedMediaState={self.props.processMouseMove}
                                processMouseUp={self.props.processMouseUp}

                                onMediaStateMouseDown={event => {
                                    self.props.onMediaStateMouseDown(event, mediaState);
                                }}
                            />
                        );
                    }
                }

            });
        }
        else {
            mediaStates = <div></div>
        }

        // messed up because setState is called from render??
        // onMediaStateMouseDown={self.props.onMediaStateMouseDown(event, mediaState)}

        // onMediaStateMouseDown={self.props.onMediaStateMouseDown}
        // onMediaStateMouseDown={self.handleMediaStateMouseDown(event, mediaState)}

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

        let timeoutClassName = "unSelectedBSEvent";
        let mediaEndClassName = "unSelectedBSEvent";
        switch (this.props.activeBSEventType) {
            case "timeout":
                timeoutClassName = "selectedBSEvent";
                break;
            case "mediaEnd":
                mediaEndClassName = "selectedBSEvent";
                break;
        }

        return (
            <div
                className="playlistDiv"
                id="playlistDiv"
            >
                <div className="playlistHeaderDiv">
                    <div>
                        <img src="images/36x36_timeout.png" className={timeoutClassName} onClick={this.onSelectTimeoutEvent.bind(this)}></img>
                        <img src="images/36x36_videoend.png" className={mediaEndClassName} onClick={this.onSelectMediaEndEvent.bind(this)}></img>
                    </div>
                    <button id="openCloseIcon" className="plainButton" type="button" onClick={this.props.onToggleOpenClosePropertySheet.bind(this)}>{openCloseLabel}</button>
                    <input step="1" id="zoomSlider" type="range" min="0" max="100" defaultValue="100"></input>
                </div>

                <div className="interactiveCanvasDiv"
                     id="interactiveCanvasDiv"
                     onDrop={self.props.playlistDropHandler}
                     onDragOver={self.props.playlistDragOverHandler}
                     style={zoomStyle}
                     
                     onMouseDown={self.props.onPlaylistMouseDown}
                     onMouseMove={self.props.onPlaylistMouseMove}
                     onMouseUp={self.props.onPlaylistMouseUp}

                     onMediaStateMouseDown={self.props.onMediaStateMouseDown}

                >
                    {mediaStates}
                    {svgData}
                    {bsEventIcons}
                </div>
            </div>
        );
    }
}

export default InteractivePlaylist;
