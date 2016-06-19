/**
 * Created by tedshaffer on 6/19/16.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ImagePlaylistItem from '../badm/imagePlaylistItem';

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

    render () {

        var self = this;

        let msg = "not here yet";

        if (this.props.selectedPlaylistItem) {
            msg = "selectedPlaylistItem=" + this.props.selectedPlaylistItem.fileName;
        }
        else {
            msg = "selectedPlaylistItem null or undefined";
        }

        return (
            <div className="propertySheetDiv">
                Eat more pizza!
                <p>{msg}</p>
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
    return bindActionCreators({  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertySheet);
