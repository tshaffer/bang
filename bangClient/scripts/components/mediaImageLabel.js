import React, { Component } from "react";

class MediaImageLabel extends Component {

    render() {

        return (
            <span
                id={this.props.id}
                className="playlistLbl smallFont"
                style={ { left: "0px", top: "0px" } }>
                {this.props.fileName}
            </span>
        );
    }
}

MediaImageLabel.propTypes = {
    fileName: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired
};

export default MediaImageLabel;