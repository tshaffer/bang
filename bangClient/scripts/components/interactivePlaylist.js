import React, { Component } from 'react';

import $ from 'jquery';

class InteractivePlaylist extends Component {

    constructor(props) {
        super(props);

        this.mediaStateBtnWidth = 110;
        this.mediaStateBtnHeight = 90;
    }

    componentDidMount() {

        var self = this;

        this.playlistOffset = $("#interactiveCanvasDiv").offset();

        document.addEventListener('keydown', (event) => {
            if (event.keyCode == 8 || event.keyCode == 46) {       // delete key or backspace key
                // check to see if playlistItem has focus
                self.props.onDeleteMediaState();
            }
        });

        const zoomValue = document.getElementById("zoomSlider");
        if (zoomValue != undefined) {
            zoomValue.addEventListener("input", function () {
                if (self.state.zoomValue != zoomValue.value) {
                    self.setState ({ zoomValue: zoomValue.value });
                }
            }, false);
        }
    }

    playlistDragOverHandler (ev) {

        console.log("playlistDragOverHandler");
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    }


    render() {

        console.log("render");

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

        return (
            <div className="playlistDiv" id="playlistDiv">
                <div className="playlistHeaderDiv">
                    <div>
                        <img src="images/36x36_timeout.png" className={timeoutClassName} onClick={this.props.onSelectTimeoutEvent}></img>
                        <img src="images/36x36_videoend.png" className={mediaEndClassName} onClick={this.props.onSelectMediaEndEvent}></img>
                    </div>
                    <button id="openCloseIcon" className="plainButton" type="button" onClick={this.props.onToggleOpenClosePropertySheet}>{this.props.openCloseLabel}</button>
                    <input step="1" id="zoomSlider" type="range" min="0" max="100" defaultValue="100"></input>
                </div>
                <div className="interactiveCanvasDiv" id="interactiveCanvasDiv"
                     onDrop={this.props.playlistDropHandler}
                     onDragOver={self.playlistDragOverHandler}
                     onMouseMove={console.log("interactiveCanvasDiv::onMouseMove")}
                     onMouseUp={console.log("interactiveCanvasDiv::onMouseUp")}>
                </div>
            </div>
        );
    }

}

export default InteractivePlaylist;


