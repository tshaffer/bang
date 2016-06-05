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
        
        if (!this.props.thumbs || this.props.thumbs.length == 0) {
            return (
                <div>Pizza</div>
            );
        }

        let mediaLibraryThumbs = this.props.thumbs.map(function (thumb) {

            const thumbUrl = thumb.thumbFileName;
            
            // <img id={thumb.id} src={thumbUrl} className="mediaLibraryThumbImg" data-name={thumb.fileName} data-path={thumb.path} data-type={thumb.type} draggable={true} onDragStart={self.mediaLibraryDragStartHandler}/>
            return (
                <li className="flex-item mediaLibraryThumbDiv" key={thumb.id}>
                    <img src={thumbUrl} className="mediaLibraryThumbImg"/>
                    <p className="mediaLibraryThumbLbl">{thumb.fileName}</p>
                </li>
            );
        });

        return (
            <div className="mediaLibraryDiv">
                <ul className="flex-container wrap">
                    {mediaLibraryThumbs}
                </ul>
            </div>
        );

    }
}

function mapStateToProps(state) {
    return {
        thumbs: state.thumbs
    };
}


export default connect(mapStateToProps)(MediaLibrary);
