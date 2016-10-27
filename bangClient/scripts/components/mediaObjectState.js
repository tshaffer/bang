/**
 * Created by tedshaffer on 10/27/16.
 */
import React, { Component } from 'react';
import { getThumbByFilePath } from '../platform/actions';

export default class MediaObjectState extends Component {

    // not clear what the unique value is
    // id={this.props.mediaStateId}

    render() {

        const fileName = this.props.fileName;
        const filePath = this.props.mediaObjectState.path;
        const mediaItem = this.props.mediaThumbs[filePath];
        const thumb = getThumbByFilePath(mediaItem.thumbPath);
        const className = "mediaLibraryThumbImg";

        return (
            <li
                className="flex-item mediaLibraryThumbDiv"
                key={this.props.dataIndex}
                data-index={this.props.dataIndex}
                id={"mediaThumb" + this.props.dataIndex.toString()}>
                <img
                    id={this.props.dataIndex}
                    src={thumb}
                    className={className}
                    data-index={this.props.dataIndex}
                    draggable={true}
                    data-name={fileName}
                    data-path={filePath}
                    data-type="image"
                />
                <p className="mediaLibraryThumbLbl" id={"mediaLbl" + this.props.dataIndex.toString()}>{fileName}</p>
            </li>
        );
    }
}

MediaObjectState.propTypes = {
    fileName: React.PropTypes.string.isRequired,
    mediaObjectState: React.PropTypes.object.isRequired,
    dataIndex: React.PropTypes.number.isRequired,
    mediaThumbs: React.PropTypes.object.isRequired,
};

