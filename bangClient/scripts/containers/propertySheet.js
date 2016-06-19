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
        };
    }

    componentWillMount() {
        console.log("PropertySheet: componentWillMount invoked");
    }

    componentDidMount() {
        console.log("PropertySheet::componentDidMount invoked");
    }

    updateTimeOnScreen(event) {
        let selectedPlaylistItem = Object.assign({}, this.props.selectedPlaylistItem, { timeOnScreen: event.target.value} );
        this.props.updateSelectedPlaylistItem(selectedPlaylistItem);
    }

    updateTransition(event) {
        let selectedPlaylistItem = Object.assign({}, this.props.selectedPlaylistItem, { transition: event.target.value} );
        this.props.updateSelectedPlaylistItem(selectedPlaylistItem);
    }

    updateTransitionDuration(event) {
        let selectedPlaylistItem = Object.assign({}, this.props.selectedPlaylistItem, { transitionDuration: event.target.value} );
        this.props.updateSelectedPlaylistItem(selectedPlaylistItem);
    }

    render () {

        var self = this;

        let divContent = "Eat more pizza!";

        if (this.props.selectedPlaylistItem && this.props.selectedPlaylistItem.timeOnScreen > 0) {

            const imagePlaylistItem = this.props.selectedPlaylistItem;
            divContent =
                <div>
                    <p>{imagePlaylistItem.fileName}</p>
                    <p>
                        Time on screen: <input type="text" value={imagePlaylistItem.timeOnScreen} onChange={this.updateTimeOnScreen.bind(this)}></input>
                    </p>
                    <p>
                        Transition: <input type="text" value={imagePlaylistItem.transition} onChange={this.updateTransition.bind(this)}></input>
                    </p>
                    <p>
                        Transition duration: <input type="text" value={imagePlaylistItem.transitionDuration} onChange={this.updateTransitionDuration.bind(this)}></input>
                    </p>
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
