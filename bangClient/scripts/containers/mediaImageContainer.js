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
        this.props.processMouseUp(event);
    }

    mediaImageDragStartHandler(ev) {
        console.log("mediaImageDragStartHandler");
        this.props.playlistDragStartHandler(ev);
    }

    mediaImageDragOverHandler (ev) {
        console.log("mediaImageDragOverHandler");
        this.props.playlistDragOverHandler(ev);
    }

    render() {

        var self = this;

        const mediaPlaylistItem = this.props.mediaState.getMediaPlaylistItem();

        const id = mediaPlaylistItem.getId();
        const filePath = mediaPlaylistItem.getFilePath();
        const fileName = mediaPlaylistItem.getFileName();

        const mediaItem = self.props.mediaThumbs[filePath];
        const thumb = getThumb(mediaItem);

        // onMouseMove={(event) => self.onMediaStateImgMouseMove(event)}
        // className="playlistThumbImg"

        // onMouseUp={(event) => self.onMediaStateImgMouseUp(event)}

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


                style={ {left: "0px", top: "0px"} }
                draggable={true}
                onDragStart={(event) => self.mediaImageDragStartHandler(event)}
                onDragOver={(event) => self.mediaImageDragOverHandler(event)}

                data-name={fileName}
                data-path={filePath}
                data-type="image"
            />
        );
    }
}

export default MediaImageContainer;

