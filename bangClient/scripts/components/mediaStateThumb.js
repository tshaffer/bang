import React, { Component } from 'react';

import MediaImage from './mediaImage';
import MediaImageLabel from './mediaImageLabel';

class MediaStateThumb extends Component {

    constructor(props) {
        super(props);
    }

    onMediaStateMouseDown(event, mediaState) {
        console.log("onMediaStateMouseDown");
        this.props.onMediaStateMouseDown(event, mediaState);
    }

    onMediaStateMouseMove(event) {
        console.log("onMediaStateMouseMove");
        this.props.onMediaStateMouseMove(event);
    }

    onMediaStateMouseUp(event) {
        console.log("onMediaStateMouseUp");
        this.props.onMediaStateMouseUp(event);
    }

    render() {

        const self = this;

        const mediaState = this.props.mediaState;
        const mediaPlaylistItem = this.props.mediaState.getMediaPlaylistItem();

        const id = mediaPlaylistItem.getId();


        const leftOffset = mediaState.x.toString();
        const topOffset = mediaState.y.toString();

        let mediaStateBtnStyle = {};
        mediaStateBtnStyle.left = leftOffset+"px";
        mediaStateBtnStyle.top = topOffset + "px";

        const dataIndex = self.props.dataIndex;

        // style={mediaStateBtnStyle}
        // https://facebook.github.io/react/tips/children-props-type.html
        
        return (

            <btn>
                id={id}
                className={self.props.className}
                onMouseDown={(event) => self.onMediaStateMouseDown(event, this.props.mediaState)}
                onMouseMove={(event) => self.onMediaStateMouseMove(event)}
                onMouseUp={(event) => self.onMediaStateMouseUp(event)}

                <MediaImage>
                    mediaState={mediaState}
                    mediaThumbs={self.props.mediaThumbs}
                    dataIndex={dataIndex}
                    key={dataIndex+2}
                    onSelectMediaState={self.props.onSelectMediaState}
                    processMouseMove={self.props.processMouseMove}
                    processMouseUp={self.props.onMediaStateMouseUp}
                    playlistDragStartHandler={self.props.playlistDragStartHandler}
                    playlistDragOverHandler={self.props.playlistDragOverHandler}
                </MediaImage>
                
                <MediaImageLabel>
                    mediaState={mediaState}
                    key={(dataIndex+3)}
                </MediaImageLabel>
            </btn>
        );
    }
}

export default MediaStateThumb;