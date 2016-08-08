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

        return (
            <img
                src={this.props.srcPath}
                className={this.props.className}
                style={this.props.style}
                onMouseDown={(event) => self.onMouseDown(event, this.props.transitionToRender.transition.getUserEvent())}
            />
        );
    }
}

export default TransitionEventIcon;