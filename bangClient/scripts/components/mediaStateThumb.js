import React, { Component } from 'react';

import MediaImageContainer from '../containers/mediaImageContainer';
import MediaImageLabel from './mediaImageLabel';

class MediaStateThumb extends Component {

    render() {

        const self = this;

        const mediaState = this.props.mediaState;
        const mediaPlaylistItem = this.props.mediaState.getMediaPlaylistItem();

        const id = mediaPlaylistItem.getId();

        const leftOffset = mediaState.x.toString();
        const topOffset = mediaState.y.toString();

        const dataIndex = self.props.dataIndex;

        // Joel says:
        //      if you don't need to use a variable, don't pull it out of props
        //      only pass down information to the child components that they really need (i.e., don't pass down the entire
        //      mediaState to the MediaImage)
        //      create mediaStateThumbContainer that interfaces with redux
        //      at each level, use the on...={handle...} pattern (for now)
        //      if there are lots of props named xxx={this.props.xxx], use {...this.props}
        //      container has logic; presentational components only perform render().
        // Ask Joel:
        //      When using {...this.props}, do you document and/or indicate anywhere what props are actually being used?
        //      in playlist.js, changing all the self's to this didn't work.
        //      in playlist.js, needed to use syntax like:
        //          onMoveSelectedMediaState={(event) => self.processMouseMove(event)}
        //      clicking on <img> vs. rest of thumb - different syntax - resolve that with reusable component?
        //      container vs. component - naming convention?

        return (

            <btn

                id={id}
                className={self.props.className}

                {...this.props}

                onMouseDown={this.props.onMediaStateMouseDown}
                
                style={ { left: leftOffset+"px", top: topOffset+"px" } }
                key={dataIndex}>

                <MediaImageContainer
                    mediaState={mediaState}
                    mediaThumbs={self.props.mediaThumbs}
                    dataIndex={dataIndex}
                    key={dataIndex+2}

                    onSelectMediaState={this.props.onSelectMediaState}
                    onMoveSelectedMediaState={this.props.onMoveSelectedMediaState}
                    onMouseUp={this.props.onMediaStateMouseUp}

                    playlistDragStartHandler={self.props.playlistDragStartHandler}
                    playlistDragOverHandler={self.props.playlistDragOverHandler} />
                
                <MediaImageLabel
                    fileName={mediaPlaylistItem.getFileName()}
                    id={mediaPlaylistItem.getId()}
                    key={(dataIndex+3)} />

            </btn>
        );
    }
}

export default MediaStateThumb;