import React, { Component } from 'react';

class MediaImage extends Component {

    constructor(props) {
        super(props);
    }

    onMediaStateImgMouseDown(event, mediaState) {
        console.log("onMediaStateImgMouseDown");
        this.props.onSelectMediaState(mediaState);

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
        
        return (

            <img
                id={this.props.id}
                src={this.props.thumb}
                className="playlistThumbImg"
                data-index={this.props.dataIndex+1}
                onMouseDown={(event) => self.onMediaStateImgMouseDown(event, this.props.mediaState)}
                onMouseMove={(event) => self.onMediaStateImgMouseMove(event)}
                onMouseUp={(event) => self.onMediaStateImgMouseUp(event)}
                style={ {left: "0px", top: "0px"} }
                draggable={true}
                onDragStart={(event) => self.mediaImageDragStartHandler(event)}
                onDragOver={(event) => self.mediaImageDragOverHandler(event)}

                data-name={this.props.fileName}
                data-path={this.props.filePath}
                data-type="image"
            />
        );
    }
}

export default MediaImage;

