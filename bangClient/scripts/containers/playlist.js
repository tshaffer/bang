/**
 * Created by tedshaffer on 6/8/16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import ImagePlaylistItem from '../badm';

class Playlist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playlistItems: []
        };
    }

    componentWillMount() {
        console.log("playlist: componentWillMount invoked");
    }

    componentDidMount() {
        console.log("playlist.js::componentDidMount invoked");

        const playlistItem = new ImagePlaylistItem(
            "Drop item here",
            "/Users/tedshaffer/Pictures/BangPhotos2/backend_menu_Notes.jpg",
            "69");

        this.setState({playlistItems: [playlistItem]});
    }


    playlistDragOverHandler (ev: any) {

        console.log("playlistDragOverHandler");
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    }

    playlistDropHandler (ev: any) {

        let playlistItems = this.state.playlistItems;

        console.log("drop");

        ev.preventDefault();

        // get playlist item to add to playlist
        const path = ev.dataTransfer.getData("path");
        const stateName = ev.dataTransfer.getData("name");
        const thumbUrl = ev.dataTransfer.getData("thumburl");
        const type = ev.dataTransfer.getData("type");

        // specify playlist item to drop
        const playlistItem = new ImagePlaylistItem(
            stateName,
            path,
            ev.target.id);

        // figure out where to drop it
        //      get id of playlist item that was drop target
        //      get offset that indicates how far over user dropped thumb
        //      if offset > half of thumb width, add thumb after target; otherwise insert thumb before target
        var id = ev.target.id;
        var index = Number(id);
        var offset = ev.offsetX;
        var insert = false;
        if (offset < 50) {
            insert = true;
        }

        if (insert) {
            // insert prior to index
            playlistItems.split(index, 0, playlistItem);
        }
        else {
            // add after index
            playlistItems.splice(index + 1, 0, playlistItem);
        }

        // renumber id's
        playlistItems.forEach(function (playlistItem, index) {
            playlistItem.id = index.toString();
        });

        this.setState({playlistItems: playlistItems});
    }

    render () {

        let self = this;

        let playlistItems = this.state.playlistItems.map(function (playlistItem) {

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

// export default Playlist;
function mapStateToProps(state) {
    return {
        mediaItemThumbs: state.mediaItemThumbs
    };
}

export default connect(mapStateToProps)(Playlist);
