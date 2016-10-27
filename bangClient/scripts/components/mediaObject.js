/**
 * Created by tedshaffer on 10/27/16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { baGetMediaStateById} from '@brightsign/badatamodel';

import { getThumbByFilePath } from '../platform/actions';

export default class MediaObject extends Component {

    render() {

        if (!this.props.mediaState) {
            return (
                <div/>
            );
        }
        const mediaState = this.props.mediaState;
        const filePath = mediaState.contentItem.media.path;
        const fileName = mediaState.name;
        let className = "";

        // const contentItem = mediaState.contentItem;
        if (this.props.mediaThumbs.hasOwnProperty(filePath)) {
            const mediaItem = this.props.mediaThumbs[filePath];
            const thumb = getThumbByFilePath(mediaItem.thumbPath);
            className += "mediaLibraryThumbImg";

//                     onClick={() => self.onSelectMediaState(mediaState)}
//                     draggable={true}
//                     onDragStart={self.playlistDragStartHandler}

            return (
                <li
                    className="flex-item mediaLibraryThumbDiv"
                    key={this.props.dataIndex}
                    data-index={this.props.dataIndex}
                    id={"mediaThumb" + this.props.dataIndex.toString()}>
                    <img
                        id={this.props.mediaStateId}
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

        return (
            <li key={this.props.dataIndex} data-index={this.props.dataIndex} id={"mediaThumb" + this.props.dataIndex.toString()}>
                <p className="mediaLibraryThumbLbl">{fileName}</p>
            </li>
        );


        // return (
        //     <li className="flex-item mediaLibraryThumbDiv" key={this.props.mediaStateId} data-index={dataIndex} id={"mediaThumb" + dataIndex.toString()}>
        //         <img
        //             id={this.props.mediaStateId}
        //             src={thumb}
        //             className={className}
        //             data-index={this.props.dataIndex}
        //             onClick={() => self.onSelectMediaState(mediaState)}
        //             draggable={true}
        //             onDragStart={self.playlistDragStartHandler}
        //             data-name={fileName}
        //             data-path={filePath}
        //             data-type="image"
        //         />
        //         <p className="mediaLibraryThumbLbl" id={"mediaLbl" + dataIndex.toString()}>{fileName}</p>
        //     </li>
        // );
    }
}

function mapStateToProps(reduxState, ownProps) {

    const { app, badm } = reduxState;

    return {
        mediaState: baGetMediaStateById(badm, {id: ownProps.mediaStateId})
    };
}


MediaObject.propTypes = {
    mediaThumbs: React.PropTypes.object.isRequired,
    mediaStateId: React.PropTypes.string.isRequired,
    mediaState: React.PropTypes.object.isRequired,
    dataIndex: React.PropTypes.number.isRequired
};

export default connect(mapStateToProps)(MediaObject);
