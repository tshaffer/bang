import React, { Component } from 'react';

import $ from 'jquery';

import { getThumb } from '../platform/actions';

import MediaState from '../badm/mediaState';
import ImagePlaylistItem from '../badm/imagePlaylistItem';
import HTML5PlaylistItem from '../badm/html5PlaylistItem';

const mouseStateNone = "none";
const mouseStateMoveMediaState = "moveMediaState";
const mouseStateCreateTransition = "createTransition";

class Playlist extends Component {

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

    componentWillMount() {
    }

    componentDidMount() {
        
        var self = this;

        this.playlistOffset = $("#playlistDiv").offset();
        console.log("playlistOffset in componentDidMount");
        console.log(this.playlistOffset);

        document.addEventListener('keydown', (event) => {
            if (event.keyCode == 8 || event.keyCode == 46) {       // delete key or backspace key
                // check to see if playlistItem has focus
                self.props.onDeleteMediaState();        
            }
        });

        const zoomValue = document.getElementById("zoomSlider");
        if (zoomValue != undefined) {
            zoomValue.addEventListener("input", function () {
                console.log("zValue=" + zoomValue.value);
                if (self.state.zoomValue != zoomValue.value) {
                    console.log("old zoomValue=", self.state.zoomValue, " new zoomValue=", zoomValue.value);
                    self.setState ({ zoomValue: zoomValue.value });
                }
            }, false);
        }
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

        // adjust playlistOffset by zoomValue
        // let playlistOffset = $("#playlistDiv").offset();
        // const playlistOffsetX = playlistOffset.left;
        // const adjustedPlaylistOffsetX = playlistOffsetX / zoomScaleFactor;
        // let playlistOffsetY = playlistOffset.top;
        // const adjustedPlaylistOffsetY = playlistOffsetY / zoomScaleFactor;
        // let x = ev.pageX - adjustedPlaylistOffsetX;
        // let y = ev.pageY - adjustedPlaylistOffsetY;

        const pt = this.getCorrectedPoint(
            { x: ev.pageX, y: ev.pageY}
        );
        const x = pt.x;
        const y = pt.y;

        // get x, y locations relative to the origin of the playlist div
        // let x = ev.pageX - this.playlistOffset.left;
        // let y = ev.pageY - this.playlistOffset.top;
        //
        // // adjust x, y locations based on zoom value
        // x *= zoomScaleFactor;
        // y *= zoomScaleFactor;

        // specify playlist item to drop
        let mediaState = null;
        if (type === "image") {
            // offset image to center it around the drop point
            const mediaStateX = x - (this.mediaStateBtnWidth/2);
            const mediaStateY = y - (this.mediaStateBtnHeight/2);
            mediaState = this.props.onDropMediaState(mediaStateX, mediaStateY, operation, type, stateName, path);
            console.log("mediaState: x="+mediaState.x+",mediaState.y="+mediaState.y)
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
        this.props.onSelectMediaState(mediaState);
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
        // console.log("onPlaylistMouseDown");
        this.mouseState = mouseStateNone;
        event.stopPropagation();
    }

    onPlaylistMouseMove(event) {
        // console.log("onPlaylistMouseMove");
        this.processMouseMove(event);
    }

    onPlaylistMouseUp(event) {
        // console.log("onPlaylistMouseUp");
        this.processMouseUp(event);
    }

    onMediaStateMouseDown(event, mediaState) {

        this.onSelectMediaState(mediaState);

        console.log("onMediaStateMouseDown");

        this.mouseState = mouseStateCreateTransition;

        const pt = this.getCorrectedPoint(
            { x: event.clientX, y: event.clientY }
        );

        this.setState ({ x1: pt.x });
        this.setState ({ y1: pt.y });
        this.setState ({ x2: -1});
        this.setState ({ y2: -1});

        // var playlistOffset = $("#playlistDiv").offset();
        // this.setState ({ x1: event.clientX - playlistOffset.left});
        // this.setState ({ y1: event.clientY - playlistOffset.top});
        // this.setState ({ x2: -1});
        // this.setState ({ y2: -1});

        // console.log(event.clientX, playlistOffset.left, event.clientY, playlistOffset.top);

        event.stopPropagation();
    }

    onMediaStateMouseMove(event) {
        // console.log("onMediaStateMouseMove");
        this.processMouseMove(event);
    }

    onMediaStateMouseUp(event) {
        // console.log("onMediaStateMouseUp");
        switch (this.mouseState) {
            case mouseStateNone:
                break;
            case mouseStateMoveMediaState:
                break;
            case mouseStateCreateTransition:
                // don't add transition if the target media state is same as the current media state
                if (event.target.id !== this.props.selectedMediaStateId) {
                    console.log("create transition to " + event.target.id);
                    this.props.onAddTransition(event.target.id);
                }
                break;
        }
        this.processMouseUp(event);
    }

    onMediaStateImgMouseDown(event, mediaState) {

        this.onSelectMediaState(mediaState);

        // console.log("onMediaStateImgMouseDown");
        event.stopPropagation();
    }

    onMediaStateImgMouseMove(event) {
        // console.log("onMediaStateImgMouseMove");
        this.processMouseMove(event);
    }

    onMediaStateImgMouseUp(event) {
        // console.log("onMediaStateImgMouseUp");
        // this.processMouseUp(event);
    }

    processMouseMove(event) {

        // var playlistOffset = $("#playlistDiv").offset();
        // this.setState ({ x2: event.clientX - playlistOffset.left});
        // this.setState ({ y2: event.clientY - playlistOffset.top});

        const pt = this.getCorrectedPoint(
            { x: event.clientX, y: event.clientY }
        );
        this.setState ({ x2: pt.x });
        this.setState ({ y2: pt.y });

        event.stopPropagation();
    }

    processMouseUp(event) {

        this.mouseState = mouseStateNone;

        this.setState ({ x1: -1});
        this.setState ({ y1: -1});
        this.setState ({ x2: -1});
        this.setState ({ y2: -1});

        event.stopPropagation();
    }

    render () {

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

        let eventIcons = '';
        let eventIconData = [];

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

                let transitionLineSpecs = '';
                transitionLineSpecs = mediaState.transitionOutIds.map(function (transitionOutId, index) {

                    const xStart = mediaState.x + self.mediaStateBtnWidth/2;
                    const yStart = mediaState.y + self.mediaStateBtnHeight;

                    const targetMediaState = self.props.mediaStates.mediaStatesById[transitionOutId];
                    const xEnd = targetMediaState.x + self.mediaStateBtnWidth/2;
                    const yEnd = targetMediaState.y;

                    svgLineData.push({x1: xStart, y1: yStart, x2: xEnd, y2: yEnd});

                    eventIconData.push({ xCenter: (xStart + xEnd)/2, yCenter: (yStart + yEnd)/2 });

                });

                const mediaPlaylistItem = mediaState.getMediaPlaylistItem();
                if (mediaPlaylistItem instanceof ImagePlaylistItem) {
                    // filePath = mediaState.getFilePath();
                    filePath = mediaPlaylistItem.getFilePath();
                    if (self.props.mediaThumbs.hasOwnProperty(filePath)) {

                        const mediaItem = self.props.mediaThumbs[filePath];
                        const thumb = getThumb(mediaItem);

                        className += "mediaStateBtn";

                        let mediaStateBtnStyle = {};
                        let imgStyle = {};
                        let lblStyle = {};

                        const leftOffset = mediaState.x.toString();
                        const topOffset = mediaState.y.toString();

                        mediaStateBtnStyle.left = leftOffset+"px";
                        mediaStateBtnStyle.top = topOffset + "px";

                        imgStyle.left = "0px";
                        imgStyle.top = "0px";

                        lblStyle.left = "0px";
                        // lblStyle.top = "70px";
                        lblStyle.top = "0px";

                        const id = mediaPlaylistItem.getId();
                        const fileName = mediaPlaylistItem.getFileName();

                        dataIndex+= 4;

                        return (
                            <btn
                                id={id}
                                className={className}
                                onMouseDown={(event) => self.onMediaStateMouseDown(event, mediaState)}
                                onMouseMove={(event) => self.onMediaStateMouseMove(event)}
                                onMouseUp={(event) => self.onMediaStateMouseUp(event)}
                                style={mediaStateBtnStyle}
                                key={dataIndex}>
                                <img
                                    id={id}
                                    src={thumb}
                                    className="playlistThumbImg"
                                    data-index={dataIndex+1}
                                    onMouseDown={(event) => self.onMediaStateImgMouseDown(event, mediaState)}
                                    onMouseMove={(event) => self.onMediaStateImgMouseMove(event)}
                                    onMouseUp={(event) => self.onMediaStateImgMouseUp(event)}
                                    key={dataIndex+2}
                                    style={imgStyle}
                                    draggable={true}
                                    onDragStart={self.playlistDragStartHandler}
                                    data-name={fileName}
                                    data-path={filePath}
                                    data-type="image"
                                />
                                <span
                                    id={id}
                                    className="playlistLbl smallFont"
                                    style={lblStyle}
                                    key={(dataIndex+3)}
                                >
                                    {fileName}
                                </span>
                            </btn>
                        );
                    }
                }

            });
        }
        else {
            mediaStates = <div></div>
        }

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

        // <input type="image" src="images/24x24_sync.png" onClick={this.onRefreshMediaLibrary.bind(this)}/>

        let eventIconStyle = {};
        eventIconStyle.position = "absolute";
        eventIconStyle.left = "0px";
        eventIconStyle.top = "0px";

        eventIcons = eventIconData.map(function (eventIconCoordinates, index) {

            const eventIconXCenter = eventIconCoordinates.xCenter - 18; // center it around icon (width=36)
            const eventIconYCenter = eventIconCoordinates.yCenter - 18; // center it around icon (height=36)

            let eventIconStyle = {};
            eventIconStyle.position = "absolute";
            // eventIconStyle.left = "0px";
            // eventIconStyle.top = "0px";

            eventIconStyle.left = eventIconXCenter.toString() + "px";
            eventIconStyle.top = eventIconYCenter.toString() + "px";

            return (
                <img
                    src="images/36x36_timeout.png"
                    key={500 + index}
                    style={eventIconStyle}
                />

            );
        })

            // <input step="1" onInput={this.showVal("onInput")} onChange={this.showVal("onChange")} id="zoomSlider" type="range" name="points" min="0" max="100" defaultValue="100" onChange={self.onZoomChange(event)}></input>


        let zoomStyle = {};
        const zoomValueStr = (this.state.zoomValue/100).toString();
        zoomStyle.zoom = zoomValueStr;
        zoomStyle["MozTransform"] = "scale(" + zoomValueStr + ")";

        return (
            <div
                className="playlistDiv"
                id="playlistDiv"
                onMouseDown={(event) => self.onPlaylistMouseDown(event)}
                onMouseMove={(event) => self.onPlaylistMouseMove(event)}
                onMouseUp={() => self.onPlaylistMouseUp(event)}
                onDrop={self.playlistDropHandler.bind(self)}
                onDragOver={self.playlistDragOverHandler}
                style={zoomStyle}
            >
                {mediaStates}
                {svgData}
                {eventIcons}
                <input step="1" id="zoomSlider" type="range" min="0" max="100" defaultValue="100"></input>
                <button id="openCloseIcon" className="plainButton" type="button" onClick={this.props.onToggleOpenClosePropertySheet.bind(this)}>{openCloseLabel}</button>
            </div>
        );
    }
}

export default Playlist;
