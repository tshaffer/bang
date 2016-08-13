import React, { Component } from 'react';

import { getThumb } from '../platform/actions';

import MediaImage from '../components/mediaImage';

class MediaImageContainer extends Component {

    constructor(props) {
        super(props);
    }

    handleMediaStateImgMouseDown(event) {
        console.log("handleMediaStateImgMouseDown");
        this.props.onSelectMediaState(this.props.mediaState);

        event.stopPropagation();
    }

    handleMediaStateImgMouseMove(event) {
        console.log("handleMediaStateImgMouseMove");
        this.props.onMoveSelectedMediaState(event);
    }

    handleMediaStateImgMouseUp(event) {
        console.log("handleMediaStateImgMouseUp");
        this.props.onMouseUp(event);
    }

    handleMediaImageDragStartHandler(event) {
        console.log("handleMediaImageDragStartHandler");
        this.props.playlistDragStartHandler(event);
    }

    handleMediaImageDragOverHandler (event) {
        console.log("handleMediaImageDragOverHandler");
        this.props.playlistDragOverHandler(event);
    }

    render() {

        var self = this;

        const mediaPlaylistItem = this.props.mediaState.getMediaPlaylistItem();

        const id = mediaPlaylistItem.getId();
        const filePath = mediaPlaylistItem.getFilePath();
        const fileName = mediaPlaylistItem.getFileName();

        const mediaItem = self.props.mediaThumbs[filePath];
        const thumb = getThumb(mediaItem);

        return (

            <MediaImage
                id={id}
                src={thumb}
                data-index={this.props.dataIndex+1}
                onMouseDown={this.handleMediaStateImgMouseDown.bind(this)}
                onMouseMove={this.handleMediaStateImgMouseMove.bind(this)}
                onMouseUp={this.handleMediaStateImgMouseUp.bind(this)}

                fileName={fileName}
                filePath={filePath}

                draggable={true}
                
                onDragStart={this.handleMediaImageDragStartHandler.bind(this)}
                onDragOver={this.handleMediaImageDragOverHandler.bind(this)}

            />
        );
    }
}

export default MediaImageContainer;

