/**
 * Created by tedshaffer on 10/27/16.
 */
import React, { Component } from 'react';

import { getThumbByFilePath } from '../platform/actions';

export default class MediaObjectState extends Component {

    // not clear what the unique value is
    // id={this.props.mediaStateId}

    // TODO - only applicable to mediaLibrary items at the moment
    handleMediaLibraryDragStart(ev) {

        console.log("handleMediaLibraryDragStart");

        ev.dataTransfer.setData("path", ev.target.dataset.path);
        ev.dataTransfer.setData("name", ev.target.dataset.name);
        ev.dataTransfer.setData("type", ev.target.dataset.type);
        ev.dataTransfer.dropEffect = "copy";
        // ev.dataTransfer.effectAllowed = 'copy';
    }

    handleSelectMediaState(ev, mediaStateId) {
        console.log("MediaState ", mediaStateId, " selected");
        if (this.props.onSelectMediaState) {
            console.log("invoke this.props.onSelectMediaState");
            this.props.onSelectMediaState(ev, mediaStateId);
        }
    }

    render() {

        const fileName = this.props.fileName;
        const filePath = this.props.mediaObjectState.path;
        const mediaItem = this.props.mediaThumbs[filePath];
        const thumb = getThumbByFilePath(mediaItem.thumbPath);
        let className = "mediaLibraryThumbImg";

        if (this.props.selected) {
            className += " selectedImage ";
        }

        return (
            <li
                className="flex-item mediaLibraryThumbDiv"
                key={this.props.dataIndex}
                draggable={true}
                data-index={this.props.dataIndex}
                onClick={(ev) => this.handleSelectMediaState(ev, this.props.mediaStateId)}
                onDragStart={this.handleMediaLibraryDragStart}
                data-name={fileName}
                data-path={filePath}
                data-type="image"
                id={"mediaThumb" + this.props.dataIndex.toString()}>
                <img
                    id={this.props.dataIndex}
                    src={thumb}
                    className={className}
                    draggable={false}
                />
                <p className="mediaLibraryThumbLbl" id={"mediaLbl" + this.props.dataIndex.toString()}>{fileName}</p>
            </li>
        );
    }
}

MediaObjectState.defaultProps = {
    mediaStateId: ''
};

MediaObjectState.propTypes = {
    fileName: React.PropTypes.string.isRequired,
    mediaObjectState: React.PropTypes.object.isRequired,
    dataIndex: React.PropTypes.number.isRequired,
    mediaThumbs: React.PropTypes.object.isRequired,
    selected: React.PropTypes.bool.isRequired,
    mediaStateId: React.PropTypes.string.isRequired,
    onSelectMediaState: React.PropTypes.func,
};

