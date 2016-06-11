/**
 * Created by tedshaffer on 6/8/16.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ImagePlaylistItem from '../badm/imagePlaylistItem';

import { addPlaylistItem } from '../actions/index';

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


    playlistDragOverHandler (ev: any) {

        console.log("playlistDragOverHandler");
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    }

    playlistDropHandler (ev: any) {

        let playlistItems = this.props.currentPlaylist.playlistItems;

        console.log("drop");

        ev.preventDefault();

        // get playlist item to add to playlist
        const path = ev.dataTransfer.getData("path");
        const stateName = ev.dataTransfer.getData("name");
        const type = ev.dataTransfer.getData("type");

        // specify playlist item to drop
        const playlistItem = new ImagePlaylistItem(
            stateName,
            path);

        // TODO TODO TODO - all broken
        var index = 0;
        // figure out where to drop it
        //      get id of playlist item that was drop target
        //      get offset that indicates how far over user dropped thumb
        //      if offset > half of thumb width, add thumb after target; otherwise insert thumb before target
        // var id = ev.target.id;
        // var index = Number(id);
        // var offset = ev.offsetX;
        // var insert = false;
        // if (offset < 50) {
        //     insert = true;
        // }

        // var insert = false;
        // if (insert) {
        //     // insert prior to index
        //     playlistItems.split(index, 0, playlistItem);
        // }
        // else {
        //     // add after index
        //     playlistItems.splice(index + 1, 0, playlistItem);
        // }

        this.props.addPlaylistItem(this.props.currentPlaylist, playlistItem, -1);

        // TODO
        // renumber id's
        // playlistItems.forEach(function (playlistItem, index) {
        //     playlistItem.id = index.toString();
        // });

        // this.setState({playlistItems: playlistItems});
    }

    render () {

        let self = this;

        let currentPlaylistItems = [];
        if (typeof this.props.currentPlaylist.playlistItems != "undefined") {
            currentPlaylistItems = this.props.currentPlaylist.playlistItems;
        }

        if (currentPlaylistItems.length == 0) {
            currentPlaylistItems.push(this.fakePlaylistItem);
        }

        let playlistItems = currentPlaylistItems.map(function (playlistItem) {

            const thumbUrl = self.props.mediaItemThumbs[playlistItem.filePath];

            return (
                <li className="flex-item mediaLibraryThumbDiv" key={playlistItem.id} onDrop={self.playlistDropHandler.bind(self)} onDragOver={self.playlistDragOverHandler}>
                    <img
                        id={playlistItem.id}
                        src={thumbUrl}
                        className="mediaLibraryThumbImg"
                    />
                    <p className="mediaLibraryThumbLbl">{playlistItem.name}</p>
                </li>
            );
        });

        let signName = <p>No sign yet</p>;
        if (this.props.sign) {
            signName = this.props.sign.name;
        }

        return (
            <div className="playlistDiv">
                <p>Presentation name: {signName}</p>
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
        mediaItemThumbs: state.mediaItemThumbs,
        currentPlaylist: state.currentPlaylist,
        sign: state.sign
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ addPlaylistItem: addPlaylistItem }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
