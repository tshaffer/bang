import React, { Component } from 'react';

import MediaImageContainer from '../containers/mediaImageContainer';
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

        // let mediaStateBtnStyle = {};
        //
        // const leftOffset = mediaState.x.toString();
        // const topOffset = mediaState.y.toString();
        //
        // mediaStateBtnStyle.left = leftOffset+"px";
        // mediaStateBtnStyle.top = topOffset + "px";

        const dataIndex = self.props.dataIndex;

        // style={mediaStateBtnStyle}
        // https://facebook.github.io/react/tips/children-props-type.html

        // Joel says:
        //      if you don't need to use a variable, don't pull it out of props
        //      only pass down information to the child components that they really need (i.e., don't pass down the entire
        //      mediaState to the MediaImage
        //      create mediaStateThumbContainer that interfaces with redux
        //      at each level, use the on...={handle...} pattern (for now)
        //      if there are lots of props named xxx={this.props.xxx], use {...this.props}
        //      container has logic; presentational components only perform render().
        
        return (

            <btn

                id={id}
                className={self.props.className}
                onMouseDown={(event) => self.onMediaStateMouseDown(event, this.props.mediaState)}
                onMouseMove={(event) => self.onMediaStateMouseMove(event)}
                onMouseUp={(event) => self.onMediaStateMouseUp(event)}

                style={mediaStateBtnStyle}
                key={dataIndex}>

                <MediaImageContainer
                    mediaState={mediaState}
                    mediaThumbs={self.props.mediaThumbs}
                    dataIndex={dataIndex}
                    key={dataIndex+2}
                    onSelectMediaState={this.props.onSelectMediaState}


                    processMouseMove={self.props.processMouseMove}
                    processMouseUp={self.props.onMediaStateMouseUp}
                    playlistDragStartHandler={self.props.playlistDragStartHandler}
                    playlistDragOverHandler={self.props.playlistDragOverHandler} />
                
                <MediaImageLabel
                    mediaState={mediaState}
                    key={(dataIndex+3)} />

            </btn>
        );
    }
}

export default MediaStateThumb;