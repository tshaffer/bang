import React, { Component } from 'react';

class Toolbar extends Component {

    componentDidMount() {

        var self = this;

        const zoomValue = document.getElementById("zoomSlider");
        if (zoomValue != undefined) {
            zoomValue.addEventListener("input", function () {
                if (self.zoomValue != zoomValue.value) {
                    console.log("setState on zoomValue from interactivePlaylist");
                    self.props.onZoomValueChanged(zoomValue.value);
                }
            }, false);
        }
    }


    render() {

        let timeoutClassName = "unSelectedBSEvent";
        let mediaEndClassName = "unSelectedBSEvent";
        switch (this.props.activeBSEventType) {
            case "timeout":
                timeoutClassName = "selectedBSEvent";
                break;
            case "mediaEnd":
                mediaEndClassName = "selectedBSEvent";
                break;
        }

        let openCloseLabel = "=>";
        if (!this.props.propertySheetOpen) {
            openCloseLabel = "<=";
        }

        return (
            <div className="playlistHeaderDiv">
                <div>
                    <img src="images/36x36_timeout.png" className={timeoutClassName} onClick={this.props.onSelectTimeoutEvent}></img>
                    <img src="images/36x36_videoend.png" className={mediaEndClassName} onClick={this.props.onSelectMediaEndEvent}></img>
                </div>
                <button id="openCloseIcon" className="plainButton" type="button" onClick={this.props.onToggleOpenClosePropertySheet}>{openCloseLabel}</button>
                <input step="1" id="zoomSlider" type="range" min="0" max="100" defaultValue="100"></input>
            </div>
        );

    }
}

Toolbar.propTypes = {
    activeBSEventType: React.PropTypes.string.isRequired,
    propertySheetOpen: React.PropTypes.bool.isRequired,
    onSelectTimeoutEvent: React.PropTypes.func.isRequired,
    onSelectMediaEndEvent: React.PropTypes.func.isRequired,
    onToggleOpenClosePropertySheet: React.PropTypes.func.isRequired
};

export default Toolbar;