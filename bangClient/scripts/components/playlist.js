import React, { Component } from 'react';

import $ from 'jquery';

import { getThumb } from '../platform/actions';

import ImagePlaylistItem from '../badm/imagePlaylistItem';
import HTML5PlaylistItem from '../badm/html5PlaylistItem';

class Playlist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            x1: -1,
            y1: -1,
            x2: -1,
            y2: -1
        };
        this.xImage = null;
        this.yImage = null;
    }

    componentWillMount() {
    }

    componentDidMount() {
        
        var self = this;
        
        document.addEventListener('keydown', (event) => {
            if (event.keyCode == 8 || event.keyCode == 46) {       // delete key or backspace key
                // check to see if playlistItem has focus
                self.props.onDeletePlaylistItem();        
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
            startIndex = Number(ev.dataTransfer.getData("index"));
        }
        else {
            operation = "copy";
        }
        
        // get dropped playlist item
        const stateName = ev.dataTransfer.getData("name");
        const path = ev.dataTransfer.getData("path");
        const type = ev.dataTransfer.getData("type");

        // determine where the drop occurred on the playlist 'canvas' component
        var playlistOffset = $("#playlistDiv").offset();
        this.xImage = ev.pageX - playlistOffset.left;
        this.yImage = ev.pageY - playlistOffset.top;

        // specify playlist item to drop
        let playlistItem = null;
        if (type === "image") {
            playlistItem = this.props.onDropPlaylistItem(operation, type, stateName, path, -1, -1);

            // offset image to center it around the drop point
            playlistItem.xImage = this.xImage - 54;
            playlistItem.yImage = this.yImage - 54;
        }

        if (playlistItem) {
            this.onSelectPlaylistItem(playlistItem);
        }
    }

    onSelectZone(event) {
        console.log("onSelectZone invoked");
    }

    onSelectPlaylistItem(playlistItem) {
        this.props.onSelectPlaylistItem(playlistItem);
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

    onMouseDown(event) {
        var playlistOffset = $("#playlistDiv").offset();

        console.log("onMouseDown");
        console.log("x=" + (event.clientX - playlistOffset.left));
        console.log("y=" + (event.clientY - playlistOffset.top));

        this.setState ({ x1: event.clientX - playlistOffset.left});
        this.setState ({ y1: event.clientY - playlistOffset.top});
    }

    onMouseUp(event) {

        this.setState ({ x1: -1});
        this.setState ({ y1: -1});
        this.setState ({ x2: -1});
        this.setState ({ y2: -1});
    }

    onMouseMove(event) {
        var playlistOffset = $("#playlistDiv").offset();

        console.log("onMouseMove");
        console.log("x=" + (event.clientX - playlistOffset.left));
        console.log("y=" + (event.clientY - playlistOffset.top));

        this.setState ({ x2: event.clientX - playlistOffset.left});
        this.setState ({ y2: event.clientY - playlistOffset.top});
    }

    render () {

        let self = this;

        let zoneId = "";

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

        let dataIndex = -4;
        let playlistItems = null;

        if (currentPlaylistItemIds.length > 0) {

            currentPlaylistItemIds.forEach( currentPlaylistItemId => {
                currentPlaylistItems.push(self.props.playlistItems.playlistItemsById[currentPlaylistItemId]);
            });

            playlistItems = currentPlaylistItems.map(function (playlistItem, index) {
                const id = playlistItem.getId();
                const fileName = playlistItem.getFileName();
                let filePath = "";

                let className = "";
                if (self.props.selectedPlaylistItemId && self.props.selectedPlaylistItemId === id) {
                    className = "selectedImage ";
                }
                else {
                    className = "unSelectedImage ";
                }

                if (playlistItem instanceof ImagePlaylistItem) {
                    filePath = playlistItem.getFilePath();
                    if (self.props.mediaThumbs.hasOwnProperty(filePath)) {

                        console.log("pizzadoodle4");

                        const mediaItem = self.props.mediaThumbs[playlistItem.getFilePath()];
                        const thumb = getThumb(mediaItem);

                        className += "playlistItemBtn";

                        let playlistItemBtnStyle = {};
                        let playlistItemDivStyle = {};
                        let imgStyle = {};
                        let lblStyle = {};
                        if (playlistItem.xImage) {

                            const leftOffset = playlistItem.xImage.toString();
                            const topOffset = playlistItem.yImage.toString();

                            playlistItemBtnStyle.left = leftOffset+"px";
                            playlistItemBtnStyle.top = topOffset + "px";


                            imgStyle.left = "6px";
                            imgStyle.top = "0px";

                            lblStyle.left = "0px";
                            lblStyle.top = "116px";
                        }

                        dataIndex+= 4;

                        return (
                            <btn
                                className={className}
                                onClick={() => console.log("btn onClick " + playlistItem.fileName)}
                                onMouseDown={() => console.log("btn onMouseDown " + playlistItem.fileName)}
                                onMouseMove={() => console.log("btn onMouseMove " + playlistItem.fileName)}
                                onMouseUp={() => console.log("btn onMouseUp " + playlistItem.fileName)}
                                onMouseEnter={() => console.log("btn onMouseEnter " + playlistItem.fileName)}
                                onMouseLeave={() => console.log("btn onMouseLeave " + playlistItem.fileName)}
                                style={playlistItemBtnStyle}
                                key={dataIndex}>
                                    <img
                                        id={playlistItem.id}
                                        src={thumb}
                                        className="playlistThumbImg"
                                        data-index={dataIndex}
                                        onClick={() => self.onSelectPlaylistItem(playlistItem)}
                                        key={dataIndex+2}
                                        style={imgStyle}
                                        draggable={true}
                                        onDragStart={self.playlistDragStartHandler}
                                        data-name={playlistItem.fileName}
                                        data-path={playlistItem.filePath}
                                        data-type="image"
                                    />
                                    <span
                                        className="playlistLbl smallFont"
                                        style={lblStyle}
                                        key={(dataIndex+3)}
                                    >
                                        {playlistItem.getFileName()}
                                    </span>
                            </btn>
                        );
                    }
                }
            });
        }
        else {
            playlistItems = <div></div>
        }

        let svgLine = '';
        if (this.state.x1 >= 0 && this.state.y1 >= 0 && this.state.x2 >= 0 && this.state.y2 >= 0) {
            svgLine =   <svg width="400" height="400">
                            <line x1={this.state.x1} x2={this.state.x2} y1={this.state.y1} y2={this.state.y2} stroke="black" fill="transparent" stroke-width="10"/>
                        </svg>;
        }

        return (
            <div 
                className="playlistDiv" 
                id="playlistDiv"
                onClick={() => console.log("btn onClick playlistDiv")}
                onMouseDown={(event) => self.onMouseDown(event)}
                onMouseMove={(event) => self.onMouseMove(event)}
                onMouseUp={() => console.log("btn onMouseUp playlistDiv")}
                onMouseEnter={() => console.log("btn onMouseEnter playlistDiv")}
                onMouseLeave={() => console.log("btn onMouseLeave playlistDiv")}
                onDrop={self.playlistDropHandler.bind(self)} 
                onDragOver={self.playlistDragOverHandler} >
                {playlistItems}
                {svgLine}
            </div>
        );
    }
}

export default Playlist;
