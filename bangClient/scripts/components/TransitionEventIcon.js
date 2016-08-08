import React, { Component } from 'react';

class TransitionEventIcon extends Component {

    constructor(props) {
        super(props);
    }

    onMouseDown(event, bsEvent) {
        console.log("TransitionEventIcon : onBSEventMouseDown");
        this.props.onMouseDown(bsEvent);
    }


    render() {

        var self = this;

        const transitionToRender = this.props.transitionToRender;

        const transitionCoordinate = transitionToRender.coordinates;
        const eventIconXCenter = transitionCoordinate.xCenter - 18; // center it around icon (width=36)
        const eventIconYCenter = transitionCoordinate.yCenter - 18; // center it around icon (height=36)

        let bsEventIconStyle = {};
        bsEventIconStyle.position = "absolute";
        bsEventIconStyle.left = eventIconXCenter.toString() + "px";
        bsEventIconStyle.top = eventIconYCenter.toString() + "px";

        let bsEventName = transitionToRender.transition.getUserEvent().getUserEventName();
        
        let srcPath = "";
        if (bsEventName == "timeout") {
            srcPath="images/36x36_timeout.png"
        }
        else if (bsEventName == "mediaEnd") {
            srcPath="images/36x36_videoend.png"
        }
        
        let className = "";
        if (self.props.selectedBSEventId && self.props.selectedBSEventId === transitionToRender.transition.getUserEvent().getId()) {
            className = "selectedBSEvent ";
        }
        else {
            className = "unSelectedBSEvent ";
        }

        return (
            <img
                src={srcPath}
                className={className}
                style={bsEventIconStyle}
                onMouseDown={(event) => self.onMouseDown(event, this.props.transitionToRender.transition.getUserEvent())}
            />
        );
    }
}

export default TransitionEventIcon;