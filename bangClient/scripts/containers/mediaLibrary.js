/**
 * Created by tedshaffer on 6/4/16.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

const path = require('path');

class MediaLibrary extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {

        let mediaLibraryContents = "";

        if (this.props.mediaLibraryContents && this.props.mediaLibraryContents.length > 0) {
            // mediaLibraryContents = "Number of items in media library is: " + this.props.mediaLibraryContents.length.toString();

            let url = path.join(this.props.mediaLibraryContents[0], this.props.mediaLibraryContents[1]);
            url = "file:///Users/tedshaffer/Pictures/SanMateoCoast2013/IMG_7094_thumb.JPG";
            mediaLibraryContents = <img src={url}/>;
            // mediaLibraryContents = "File at: " + url;

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
