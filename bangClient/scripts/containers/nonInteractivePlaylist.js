import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import $ from 'jquery';

// import { getZoneById } from 'bang/dist/reducers/reducerZone';

import { guid } from '../utilities/utils';

// import ContentItem from 'bangDM/dist/entities/contentItem';

import { getMediaStates } from 'bangDM/dist/reducers/reducerZone';

import { addMediaStateToNonInteractivePlaylist } from '../actions/index';
import { getThumb } from '../platform/actions';


class NonInteractivePlaylist extends Component {

    playlistDragStartHandler(ev) {

        ev.dataTransfer.setData("path", ev.target.dataset.path);
        ev.dataTransfer.setData("name", ev.target.dataset.name);
        ev.dataTransfer.setData("type", ev.target.dataset.type);
        ev.dataTransfer.setData("index", ev.target.dataset.index);

        // I don't think the following statement is necessarily correct
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
                if (self.props.selectedMediaStateId && self.props.selectedMediaStateId === id) {
                    className = "selectedImage ";
                }

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







        // const transitionsById = this.props.transitions.transitionsById;
        //
        // let mediaStates = [];
        //
        // let mediaStateId = selectedZonePlaylist.initialMediaStateId;
        // while (mediaStateId) {
        //     // let mediaState = selectedZonePlaylist.mediaStatesById[mediaStateId];
        //     let mediaState = this.props.mediaStates.mediaStatesById[mediaStateId];
        //     mediaStates.push(mediaState);
        //     if (mediaState.transitionOutIds.length === 1) {
        //         const transitionOutId = mediaState.transitionOutIds[0];
        //         const transition = transitionsById[transitionOutId];
        //         mediaStateId = transition.targetMediaStateId;
        //     }
        //     else {
        //         mediaStateId = null;
        //     }
        // }
        //
        // let dataIndex = -1;
        //
        // let mediaStatesJSX = mediaStates.map(function (mediaState, index) {
        //
        //     dataIndex++;
        //
        //     const id = mediaState.getId();
        //     const fileName = mediaState.getFileName();
        //     let filePath = "";
        //
        //     let className = "";
        //     if (self.props.selectedMediaStateId && self.props.selectedMediaStateId === id) {
        //         className = "selectedImage ";
        //     }
        //
        //     const mediaPlaylistItem = mediaState.getMediaPlaylistItem();
        //
        //     if (mediaPlaylistItem instanceof ImagePlaylistItem) {
        //         filePath = mediaPlaylistItem.getFilePath();
        //         if (self.props.mediaThumbs.hasOwnProperty(filePath)) {
        //
        //             const mediaItem = self.props.mediaThumbs[filePath];
        //             const thumb = getThumb(mediaItem);
        //             className += "mediaLibraryThumbImg";
        //
        //             // {/*draggable={true}*/}
        //             // {/*onDragStart={self.playlistDragStartHandler}*/}
        //             // {/*data-name={fileName}*/}
        //             // {/*data-path={filePath}*/}
        //             // {/*data-type="image"*/}
        //
        //             const fileName = mediaPlaylistItem.getFileName();
        //             // filePath already set
        //
        //             // indicate media state is selected by marking the entire <li rather htan just the <img ?
        //             return (
        //                 <li className="flex-item mediaLibraryThumbDiv" key={index} data-index={dataIndex} id={"mediaThumb" + dataIndex.toString()}>
        //                     <img
        //                         id={id}
        //                         src={thumb}
        //                         className={className}
        //                         data-index={dataIndex}
        //                         onClick={() => self.onSelectMediaState(mediaState)}
        //                         draggable={true}
        //                         onDragStart={self.playlistDragStartHandler}
        //                         data-name={fileName}
        //                         data-path={filePath}
        //                         data-type="image"
        //                     />
        //                     <p className="mediaLibraryThumbLbl" id={"mediaLbl" + dataIndex.toString()}>{fileName}</p>
        //                 </li>
        //             );
        //
        //         }
        //         else {
        //             return (
        //                 <li key={id} data-index={dataIndex} id={"mediaThumb" + dataIndex.toString()}>
        //                     <p className="mediaLibraryThumbLbl">{fileName}</p>
        //                 </li>
        //             );
        //         }
        //     }
        //     else if (mediaPlaylistItem instanceof HTML5PlaylistItem) {
        //         className += "otherThumbImg";
        //
        //         // draggable={true}
        //         // onDragStart={self.playlistDragStartHandler}
        //         // data-name={fileName}
        //         // data-path={filePath}
        //         // data-type="html5"
        //
        //         return (
        //             <li className="flex-item mediaLibraryThumbDiv" key={id} data-index={index} id={"mediaThumb" + dataIndex.toString()}>
        //                 <img
        //                     id={id}
        //                     src="images/html.png"
        //                     className={className}
        //                     data-index={dataIndex}
        //                     onClick={() => self.onSelectMediaState(mediaState)}
        //                 />
        //                 <p className="mediaLibraryThumbLbl" id={"mediaLbl" + dataIndex.toString()}>HTML5</p>
        //             </li>
        //         );
        //     }
        // });
        //
        // return mediaStatesJSX;
    }

    render() {

        let selectedZonePlaylist = null;
        let numberOfMediaStates = 0;
        let mediaStatesJSX = null;

        // selectedZonePlaylist = this.getSelectedZonePlaylist();
        // if (selectedZonePlaylist) {
        //     if (this.props.mediaStates) {
        //         numberOfMediaStates = Object.keys(this.props.mediaStates.mediaStatesById).length;
        //     }
        // }
        numberOfMediaStates = this.props.allMediaStates.length;

        let openCloseLabel = "=>";
        if (!this.props.propertySheetOpen) {
            openCloseLabel = "<=";
        }

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
                    <button id="openCloseIcon" className="plainButton" type="button" onClick={this.props.onToggleOpenClosePropertySheet.bind(this)}>{openCloseLabel}</button>
                    <input step="1" id="zoomSlider" type="range" min="0" max="100" defaultValue="100"></input>
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
    sign: React.PropTypes.object.isRequired,
    zones: React.PropTypes.object.isRequired,
    zonePlaylists: React.PropTypes.object.isRequired,
    mediaThumbs: React.PropTypes.object.isRequired,
    transitions: React.PropTypes.object.isRequired,
    mediaStates: React.PropTypes.object.isRequired,
    htmlSites: React.PropTypes.object.isRequired,
    onSelectMediaState: React.PropTypes.func.isRequired,
    addMediaStateToNonInteractivePlaylist: React.PropTypes.func.isRequired,
    selectedMediaStateId: React.PropTypes.string.isRequired,
    onToggleOpenClosePropertySheet: React.PropTypes.func.isRequired,
    propertySheetOpen : React.PropTypes.bool.isRequired,
    bangSign: React.PropTypes.object.isRequired,
    bangZones: React.PropTypes.object.isRequired,
    allMediaStates: React.PropTypes.array.isRequired
};

const getCurrentZone = (state) => {

    // debugger;
    //
    // if (state && state.zones && state.zones.allZones && state.zones.allZones.length > 0) {
    //     const zoneId = state.zones.allZones[0];
    //     const zone = getZoneById(state, {id: zoneId});
    //     return zone;
    // }

    return null;
};


function mapStateToProps(baState) {

    const state = baState.reducers;
    const bangState = baState.bangReducer;

    return {

        allMediaStates : getMediaStates(bangState),

        currentZone: getCurrentZone(baState.bangReducer),

        bangSign: bangState.sign,
        bangZones: bangState.zones,
        sign: state.sign,
        zones: state.zones,
        zonePlaylists: state.zonePlaylists,
        transitions: state.transitions,
        mediaStates: state.mediaStates,
        htmlSites: state.htmlSites,

        // selectedZone: getZoneById(baState, {id: currentZoneId});
        // sign: getSignMetadata(state),
        // zoneCount: getZoneCount(state),
        // zones: state.zones,

    };
}


function mapDispatchToProps(dispatch, ownProps) {
    return bindActionCreators(
        { addMediaStateToNonInteractivePlaylist },
        dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NonInteractivePlaylist);
