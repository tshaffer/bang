/**
 * Created by tedshaffer on 6/8/16.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ImagePlaylistItem from '../badm/imagePlaylistItem';

import { addPlaylistItem } from '../actions/index';

import $ from 'jquery';

class Playlist extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        console.log("playlist: componentWillMount invoked");

        this.fakePlaylistItem = new ImagePlaylistItem(
            "Drop item here",
            "/Users/tedshaffer/Pictures/BangPhotos2/backend_menu_Notes.jpg");
    }

    componentDidMount() {
        console.log("playlist.js::componentDidMount invoked");
    }


    playlistDragOverHandler (ev) {

        console.log("playlistDragOverHandler");
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    }

    playlistDropHandler (ev) {

        let playlistItems = this.props.currentPlaylist.playlistItems;

        ev.preventDefault();

        // get playlist item to add to playlist
        const path = ev.dataTransfer.getData("path");
        const stateName = ev.dataTransfer.getData("name");
        const type = ev.dataTransfer.getData("type");

        // specify playlist item to drop
        const playlistItem = new ImagePlaylistItem(
            stateName,
            path);

        // determine where the drop occurred relative to the target element
        var offset = $("#" + ev.target.id).offset();
        const left = ev.pageX - offset.left;
        const targetWidth = ev.target.width;

        let indexOfDropTarget = ev.target.dataset.index;

        let index = -1;
        if (left < (targetWidth / 2)) {
            index = indexOfDropTarget;
        }
        else if (indexOfDropTarget < (this.props.currentPlaylist.playlistItems.length - 1)) {
            index = indexOfDropTarget + 1;
        }

        this.props.addPlaylistItem(this.props.currentPlaylist, playlistItem, index);
    }

    render () {

        let self = this;

        let currentPlaylistItems = [];
        if (typeof this.props.currentPlaylist.playlistItems != "undefined") {
            currentPlaylistItems = Object.assign([], this.props.currentPlaylist.playlistItems);
        }

        if (currentPlaylistItems.length == 0) {
            currentPlaylistItems.push(this.fakePlaylistItem);
        }

        let dataIndex = -1;
        let playlistItems = currentPlaylistItems.map(function (playlistItem) {

            if (self.props.mediaThumbs.hasOwnProperty(playlistItem.filePath)) {
                
                const thumbUrl = self.props.mediaThumbs[playlistItem.filePath].thumbFileName;
                dataIndex++;

                return (
                    <li className="flex-item mediaLibraryThumbDiv" key={playlistItem.id} onDrop={self.playlistDropHandler.bind(self)} onDragOver={self.playlistDragOverHandler}>
                        <img
                            id={playlistItem.id}
                            src={thumbUrl}
                            className="mediaLibraryThumbImg"
                            data-index={dataIndex}
                        />
                        <p className="mediaLibraryThumbLbl">{playlistItem.name}</p>
                    </li>
                );
            }
            else {
                return (
                    <li key={playlistItem.id} >
                        <p className="mediaLibraryThumbLbl">{playlistItem.name}</p>
                    </li>
                )
            }

        });

        return (
            <div className="playlistDiv">
                Zone 1: Video or Images: Playlist
                <ul className="playlist-flex-container wrap">
                    {playlistItems}
                </ul>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        mediaThumbs: state.mediaThumbs,
        currentPlaylist: state.currentPlaylist
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ addPlaylistItem: addPlaylistItem }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
