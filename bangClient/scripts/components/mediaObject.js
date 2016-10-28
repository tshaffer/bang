/**
 * Created by tedshaffer on 10/27/16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { baGetMediaStateById} from '@brightsign/badatamodel';
import { isMediaStateSelected } from '../reducers/reducerSelectedMediaStates';

import MediaObjectState from './mediaObjectState';

import { selectMediaState, deselectMediaState, deselectAllMediaStates } from '../actions/index';

class MediaObject extends Component {

    handleSelectMediaState(event, mediaStateId) {
        console.log("mediaObject.js::handleSelectMediaState invoked:", mediaStateId);

        const shiftDown = event.getModifierState("Shift");
        const controlDown = event.getModifierState("Control");
        const metaDown = event.getModifierState("Meta");

        console.log("shiftDown: ", shiftDown);
        console.log("controlDown: ", controlDown);
        console.log("commandDown: ", metaDown);

        this.props.selectMediaState(mediaStateId);
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
                selected={this.props.isSelected}
                mediaStateId={mediaState.id}
                onSelectMediaState={this.handleSelectMediaState.bind(this)}
            />
        );
    }
}

function mapStateToProps(reduxState, ownProps) {

    const { app, badm } = reduxState;

    return {
        mediaState: baGetMediaStateById(badm, {id: ownProps.mediaStateId}),
        isSelected: isMediaStateSelected(app, ownProps.mediaStateId)
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return bindActionCreators(
        { selectMediaState },
        dispatch);
}

MediaObject.propTypes = {
    mediaThumbs: React.PropTypes.object.isRequired,
    mediaStateId: React.PropTypes.string.isRequired,
    mediaState: React.PropTypes.object.isRequired,
    dataIndex: React.PropTypes.number.isRequired,
    isSelected: React.PropTypes.bool.isRequired,
    selectMediaState: React.PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MediaObject);
