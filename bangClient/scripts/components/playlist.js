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
            x1: -1,
            y1: -1,
            x2: -1,
            y2: -1
        };

        this.mouseState = mouseStateNone;
    }

    componentWillMount() {
    }

    componentDidMount() {
        
        var self = this;
        
        document.addEventListener('keydown', (event) => {
            if (event.keyCode == 8 || event.keyCode == 46) {       // delete key or backspace key
                // check to see if playlistItem has focus
                self.props.onDeleteMediaState();        
            }
        });
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

        // determine where the drop occurred on the playlist 'canvas' component
        let playlistOffset = $("#playlistDiv").offset();
        const x = ev.pageX - playlistOffset.left;
        const y = ev.pageY - playlistOffset.top;

        // specify playlist item to drop
        let mediaState = null;
        if (type === "image") {
            // offset image to center it around the drop point
            const mediaStateX = x - 54;
            const mediaStateY = y - 54;
            mediaState = this.props.onDropMediaState(mediaStateX, mediaStateY, operation, type, stateName, path);
        }

        if (mediaState) {
            this.onSelectMediaState(mediaState);
        }
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

    onMediaStateMouseDown(event) {

        // console.log("onMediaStateMouseDown");

        this.mouseState = mouseStateCreateTransition;

        var playlistOffset = $("#playlistDiv").offset();
        this.setState ({ x1: event.clientX - playlistOffset.left});
        this.setState ({ y1: event.clientY - playlistOffset.top});

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
                console.log("create transition to " + event.target.id);
                this.props.onAddTransition(event.target.id);
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

        var playlistOffset = $("#playlistDiv").offset();
        this.setState ({ x2: event.clientX - playlistOffset.left});
        this.setState ({ y2: event.clientY - playlistOffset.top});
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
                    const tms = self.props.mediaStates.mediaStatesById[transitionOutId];
                    return (
                        <line x1={mediaState.x} y1={mediaState.y} x2={tms.x} y2={tms.y} stroke="black" fill="transparent" stroke-width="10"/>
                    );
                });

                // <svg width="400" height="400">
                //     <line x1="0" y1="0" x2="50" y2="50" stroke="black" fill="transparent" stroke-width="10"/>
                //     <line x1="0" y1="50" x2="50" y2="0" stroke="black" fill="transparent" stroke-width="10"/>
                // </svg>

                if (transitionLineSpecs != '') {
                    transitionLines =
                        <svg width="900" height="800"> +
                            {transitionLineSpecs} +
                        </svg>;
                }

                console.log("pizza rocks");

                const mediaPlaylistItem = mediaState.getMediaPlaylistItem();
                if (mediaPlaylistItem instanceof ImagePlaylistItem) {
                    // filePath = mediaState.getFilePath();
                    filePath = mediaPlaylistItem.getFilePath();
                    if (self.props.mediaThumbs.hasOwnProperty(filePath)) {

                        console.log("pizzadoodle4");

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

                        imgStyle.left = "6px";
                        imgStyle.top = "0px";

                        lblStyle.left = "0px";
                        lblStyle.top = "116px";

                        const id = mediaPlaylistItem.getId();
                        const fileName = mediaPlaylistItem.getFileName();

                        dataIndex+= 4;

                        // {/*onMouseEnter={() => console.log("btn onMouseEnter " + fileName)}*/}
                        // {/*onMouseLeave={() => console.log("btn onMouseLeave " + fileName)}*/}

                        return (
                            <btn
                                id={id}
                                className={className}
                                onClick={() => console.log("btn onClick " + fileName)}
                                onMouseDown={(event) => self.onMediaStateMouseDown(event)}
                                onMouseMove={(event) => self.onMediaStateMouseMove(event)}
                                onMouseUp={(event) => self.onMediaStateMouseUp(event)}
                                style={mediaStateBtnStyle}
                                key={dataIndex}>
                                    <img
                                        id={id}
                                        src={thumb}
                                        className="playlistThumbImg"
                                        data-index={dataIndex}
                                        onClick={() => self.onSelectMediaState(mediaState)}
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

        let svgLine = '';
        if (this.state.x1 >= 0 && this.state.y1 >= 0 && this.state.x2 >= 0 && this.state.y2 >= 0) {

            switch (this.mouseState) {
                case mouseStateNone:
                    break;
                case mouseStateMoveMediaState:
                    break;
                case mouseStateCreateTransition:
                    svgLine = <svg width="400" height="400">
                                <line x1={this.state.x1} x2={this.state.x2} y1={this.state.y1} y2={this.state.y2} stroke="black" fill="transparent" stroke-width="10"/>
                              </svg>;
                    break;
            }
        }

        // {/*onMouseEnter={() => console.log("btn onMouseEnter playlistDiv")}*/}
        // {/*onMouseLeave={() => console.log("btn onMouseLeave playlistDiv")}*/}

        // <svg width="400" height="400">
        //     <line x1="0" y1="0" x2="50" y2="50" stroke="black" fill="transparent" stroke-width="10"/>
        //     <line x1="0" y1="50" x2="50" y2="0" stroke="black" fill="transparent" stroke-width="10"/>
        // </svg>


        return (
            <div 
                className="playlistDiv" 
                id="playlistDiv"
                onClick={() => console.log("btn onClick playlistDiv")}
                onMouseDown={(event) => self.onPlaylistMouseDown(event)}
                onMouseMove={(event) => self.onPlaylistMouseMove(event)}
                onMouseUp={() => self.onPlaylistMouseUp(event)}
                onDrop={self.playlistDropHandler.bind(self)}
                onDragOver={self.playlistDragOverHandler} >
                {mediaStates}
                {svgLine}
                {transitionLines}
            </div>
        );
    }
}

export default Playlist;
