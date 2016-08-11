import React, { Component } from 'react';

class MediaImageLabel extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const self = this;

        const mediaPlaylistItem = this.props.mediaState.getMediaPlaylistItem();

        const id = mediaPlaylistItem.getId();
        const fileName = mediaPlaylistItem.getFileName();

        // lblStyle.left = "0px";
        // lblStyle.top = "0px";

        return (
            <span
                id={id}
                className="playlistLbl smallFont"
                style={ { left: "0px", top: "0px" } }
            >
                {fileName}
            </span>
        );
    }
}

export default MediaImageLabel;