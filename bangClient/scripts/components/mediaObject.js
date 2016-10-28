/**
 * Created by tedshaffer on 10/27/16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { baGetMediaStateById} from '@brightsign/badatamodel';

import MediaObjectState from './mediaObjectState';

class MediaObject extends Component {

    handleSelectMediaState(mediaStateId) {
        console.log("mediaObject.js::handleSelectMediaState invoked:", mediaStateId);
    }

    render() {

        if (!this.props.mediaState) {
            return (
                <div/>
            );
        }

        const mediaState = this.props.mediaState;
        const fileName = mediaState.name;

        const mediaObjectState = mediaState.contentItem.media;

        return (
            <MediaObjectState
                fileName={fileName}
                mediaObjectState={mediaObjectState}
                dataIndex={this.props.dataIndex}
                mediaThumbs={this.props.mediaThumbs}
                selected={true}
                mediaStateId={mediaState.id}
                onSelectMediaState={this.handleSelectMediaState.bind(this)}
            />
        );
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
