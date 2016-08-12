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

    onMediaStateImgMouseMove(event) {
        console.log("onMediaStateImgMouseMove");
        this.props.processMouseMove(event);
    }

    onMediaStateImgMouseUp(event) {
        console.log("onMediaStateImgMouseUp");
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

        return (

            <MediaImage
                id={id}
                src={thumb}
                className="playlistThumbImg"
                data-index={this.props.dataIndex+1}
                onMouseDown={this.handleMediaStateImgMouseDown.bind(this)}

                fileName={fileName}
                filePath={filePath}


                onMouseMove={(event) => self.onMediaStateImgMouseMove(event)}
                onMouseUp={(event) => self.onMediaStateImgMouseUp(event)}
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

