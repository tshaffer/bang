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

        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    }

    render() {
        return (
            <div>
                pizza
            </div>
        );
    }

}

export default InteractivePlaylist;


