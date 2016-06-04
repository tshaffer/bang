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

        let thumbs = "";

        if (this.props.thumbs && this.props.thumbs.length > 0) {
            thumbs = "Number of items in media library is: " + this.props.thumbs.length.toString();

            // let url = path.join(this.props.thumbsContents[0], this.props.thumbsContents[1]);
            // url = "file:///Users/tedshaffer/Pictures/SanMateoCoast2013/IMG_7094_thumb.JPG";
            // thumbsContents = <img src={url}/>;
            // thumbsContents = "File at: " + url;

        }
        else {
            thumbs = "Media Library is empty";
        }
        
        return (
            <div>
                {thumbs}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        thumbs: state.thumbs
    };
}


export default connect(mapStateToProps)(MediaLibrary);
