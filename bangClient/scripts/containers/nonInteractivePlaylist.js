import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { guid } from '../utilities/utils';

// import { getMediaStates } from 'bangDM/dist/reducers/reducerZone';

import { addMediaStateToNonInteractivePlaylist } from '../actions/index';
import { getThumb } from '../platform/actions';

class NonInteractivePlaylist extends Component {

    playlistDragStartHandler(ev) {

        ev.dataTransfer.setData("path", ev.target.dataset.path);
        ev.dataTransfer.setData("name", ev.target.dataset.name);
        ev.dataTransfer.setData("type", ev.target.dataset.type);
        ev.dataTransfer.setData("index", ev.target.dataset.index);

        ev.dataTransfer.dropEffect = "move";
        ev.dataTransfer.effectAllowed = 'move';
    }


    handlePlaylistDragOver (event) {

        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }

    handlePlaylistDrop (event) {

        event.preventDefault();

        // get dropped playlist item
        let stateName = event.dataTransfer.getData("name");
        const path = event.dataTransfer.getData("path");

        this.props.addMediaStateToNonInteractivePlaylist(stateName, path);
    }

    getMediaStatesJSX() {

        const self = this;

        if (self.props && self.props.allMediaStates && self.props.allMediaStates.length > 0) {

            let dataIndex = -1;

            let mediaStatesJSX = self.props.allMediaStates.map( (mediaState, index) => {

                dataIndex++;

                const id = mediaState.id;
                const fileName = mediaState.name;
                let filePath = "";

                let className = "";
                const contentItem = mediaState.contentItem;

                // how do I determine whether or not this is an image or a video?
                // why do I need to know?

                filePath = contentItem.path;
                if (self.props.mediaThumbs.hasOwnProperty(filePath)) {

                    const mediaItem = self.props.mediaThumbs[filePath];
                    const thumb = getThumb(mediaItem);
                    className += "mediaLibraryThumbImg";

                    const fileName = contentItem.name;

                    return (
                        <li className="flex-item mediaLibraryThumbDiv" key={index} data-index={dataIndex} id={"mediaThumb" + dataIndex.toString()}>
                            <img
                                id={id}
                                src={thumb}
                                className={className}
                                data-index={dataIndex}
                                onClick={() => self.onSelectMediaState(mediaState)}
                                draggable={true}
                                onDragStart={self.playlistDragStartHandler}
                                data-name={fileName}
                                data-path={filePath}
                                data-type="image"
                            />
                            <p className="mediaLibraryThumbLbl" id={"mediaLbl" + dataIndex.toString()}>{fileName}</p>
                        </li>
                    );

                }
                else {
                    return (
                        <li key={id} data-index={dataIndex} id={"mediaThumb" + dataIndex.toString()}>
                            <p className="mediaLibraryThumbLbl">{fileName}</p>
                        </li>
                    );
                }
            });

            return mediaStatesJSX;

        }

        return null;
    }

    render() {

        let mediaStatesJSX = null;

        let numberOfMediaStates = this.props.allMediaStates.length;

        if (numberOfMediaStates > 0) {
            mediaStatesJSX = this.getMediaStatesJSX();
        }
        else {
            mediaStatesJSX =
                (
                <li id="liDropItemHere" className="mediaLibraryThumbDiv" key={guid()}>
                    <p id="lblDropItemHere" className="mediaLibraryThumbLbl">Drop Item Here</p>
                </li>
                );
        }

        return (
            (
            <div
                className="playlistDiv"
                id="playlistDiv"
            >
                <div className="playlistHeaderDiv">
                </div>

                <ul id="playlistItemsUl" className="playlist-flex-container wrap" onDrop={this.handlePlaylistDrop.bind(this)} onDragOver={this.handlePlaylistDragOver.bind(this)}>
                    {mediaStatesJSX}
                </ul>
            </div>
            )
        );
    }
}


NonInteractivePlaylist.propTypes = {
    mediaThumbs: React.PropTypes.object.isRequired,
    addMediaStateToNonInteractivePlaylist: React.PropTypes.func.isRequired,
    allMediaStates: React.PropTypes.array.isRequired
};

function mapStateToProps(baState) {

    // const state = baState.reducers;
    const bangState = baState.bangReducer;

    return {
        // allMediaStates : getMediaStates(bangState),
        allMediaStates: [],
    };
}


function mapDispatchToProps(dispatch, ownProps) {
    return bindActionCreators(
        { addMediaStateToNonInteractivePlaylist },
        dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NonInteractivePlaylist);
