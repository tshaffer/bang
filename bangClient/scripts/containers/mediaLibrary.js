/**
 * Created by tedshaffer on 6/4/16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

class MediaLibrary extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {

        let mediaLibraryContents = "";

        if (this.props.mediaLibraryContents && this.props.mediaLibraryContents.length > 0) {
            mediaLibraryContents = "Number of items in media library is: " + this.props.mediaLibraryContents.length.toString();
        }
        else {
            mediaLibraryContents = "Media Library is empty";
        }
        
        return (
            <div>
                {mediaLibraryContents}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        mediaLibraryContents: state.mediaLibraryContents
    };
}


export default connect(mapStateToProps)(MediaLibrary);
