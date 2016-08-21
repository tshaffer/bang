import { Component } from 'react';

import { getThumb } from "../platform/actions";

class MediaImageContainer extends Component {

    handleMediaStateImgMouseDown(event) {
        console.log("handleMediaStateImgMouseDown");
        // this.props.onSelectMediaState(this.props.mediaState);
        this.props.onMediaStateImgMouseDown(this.props.mediaState);
        event.stopPropagation();
    }

    handleMediaStateImgMouseMove(event) {
        console.log("handleMediaStateImgMouseMove");
        this.props.onMediaStateImgMouseMove(event);
    }

    handleMediaStateImgMouseUp(event) {
        console.log("handleMediaStateImgMouseUp");
        this.props.onMediaStateImgMouseUp(event);
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

        // const mediaPlaylistItem = this.props.mediaState.getMediaPlaylistItem();
        //
        // const id = mediaPlaylistItem.getId();
        // const filePath = mediaPlaylistItem.getFilePath();
        // const fileName = mediaPlaylistItem.getFileName();

        const id = this.props.id;
        const fileName = this.props.fileName;
        const filePath = this.props.filePath;
        
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

