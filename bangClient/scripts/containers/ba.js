/**
 * Created by tedshaffer on 5/2/16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import BAUI from '../platform/baUI';
import ImagePlaylistItem from '../badm/imagePlaylistItem';
import HTML5PlaylistItem from '../badm/html5PlaylistItem';
import MediaLibrary from '../components/mediaLibrary';
import NonInteractivePlaylist from './nonInteractivePlaylist';


import { createDefaultPresentation, loadAppData, selectMediaFolder } from '../actions/index';

class BA extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bsnPresentations: [],
            propertySheetOpen: false,
            selectedZone: null,
            selectedMediaStateId: "",
            selectedPlaylistItemId: "",
            open: false,
        };

        this.baUI = new BAUI(this);

    }

    componentWillMount() {

        this.props.createDefaultPresentation("Project 1");

        this.props.loadAppData();
    }

    componentDidMount() {

        var self = this;

        this.baUI.init();
    }

    render () {

        const openSavePresentationJSX = <div>pizza!!!</div>;

        return (

            <div>

                <div className="bangPageContainer">
                    <MediaLibrary
                        onBrowseForMediaLibrary={this.baUI.handleBrowseForMediaLibrary.bind(this.baUI)}
                        mediaLibraryPlaylistItems={this.props.mediaLibraryPlaylistItems}
                        mediaFolder={this.props.mediaFolder}
                        mediaThumbs={this.props.mediaThumbs}
                    />
                    <NonInteractivePlaylist
                        mediaThumbs={this.props.mediaThumbs}
                        selectedMediaStateId={this.state.selectedMediaStateId}
                    />
                </div>
            </div>
        );
    }
}

function mapStateToProps(baState) {

    const state = baState.reducers;

    return {
        mediaLibraryPlaylistItems: state.mediaLibraryPlaylistItems,
        mediaFolder: state.mediaFolder,
        mediaThumbs: state.mediaThumbs,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({createDefaultPresentation, loadAppData, selectMediaFolder
        },
        dispatch);
}


BA.propTypes = {
    createDefaultPresentation: React.PropTypes.func.isRequired,
    loadAppData: React.PropTypes.func.isRequired,
    mediaFolder: React.PropTypes.string.isRequired,
    mediaThumbs: React.PropTypes.object.isRequired,
    mediaLibraryPlaylistItems: React.PropTypes.array.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(BA);
