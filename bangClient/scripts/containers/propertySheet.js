/**
 * Created by tedshaffer on 6/19/16.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ImagePlaylistItem from '../badm/imagePlaylistItem';

import { updateSelectedPlaylistItem } from '../actions/index';

class PropertySheet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            term: ''
        };
    }

    componentWillMount() {
        console.log("PropertySheet: componentWillMount invoked");
    }

    componentDidMount() {
        console.log("PropertySheet::componentDidMount invoked");
    }

    updateTimeOnScreen(event) {
        console.log("updateTimeOnScreenInvoked");
        console.log("updateTimeOnScreenInvoked");
        console.log(event.target.value);

        // let selectedPlaylistItem = Object.assign({}, this.props.selectedPlaylistItem);
        // selectedPlaylistItem.timeOnScreen = event.target.value;
        let selectedPlaylistItem = Object.assign({}, this.props.selectedPlaylistItem, { timeOnScreen: event.target.value} );
        this.props.updateSelectedPlaylistItem(selectedPlaylistItem);
    }

    render () {

        var self = this;

        let divContent = "Eat more pizza!";

        if (this.props.selectedPlaylistItem && this.props.selectedPlaylistItem.timeOnScreen > 0) {
            console.log("stop here");
            console.log("and add more code");

            // <input type="text" id="imageTimeOnScreen" value={imagePlaylistItem.timeOnScreen} onChange={this.updateTimeOnScreen}></input>
            // <input type="text" id="imageTimeOnScreen" onChange={this.updateTimeOnScreen}></input>
            // <input onChange={ event => imagePlaylistItem.timeOnScreen = event.target.value}></input>

            // doesn't work
            // <input onChange={self.updateTimeOnScreen(imagePlaylistItem)} />

            // following works reasonably well
            // <input type="text" id="imageTimeOnScreen" value={imagePlaylistItem.timeOnScreen} onChange={this.updateTimeOnScreen.bind(this)}></input>

            // from video and it works as it does in the video
            // <input onChange={event => this.setState({ term: event.target.value })}/>
            // value of the input: {this.state.term}

            // <p>{imagePlaylistItem.timeOnScreen}</p>

            const imagePlaylistItem = this.props.selectedPlaylistItem;
            divContent =
                <div>
                    <p>{imagePlaylistItem.fileName}</p>
                    Time on screen: <input type="text" id="imageTimeOnScreen" value={imagePlaylistItem.timeOnScreen} onChange={this.updateTimeOnScreen.bind(this)}></input>
                    <p>{imagePlaylistItem.transition}</p>
                    <p>{imagePlaylistItem.transitionDuration}</p>
                </div>
            ;
        }

        return (
            <div className="propertySheetDiv">
                {divContent}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        selectedPlaylistItem: state.selectedPlaylistItem
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateSelectedPlaylistItem }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertySheet);
