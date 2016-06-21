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

        this.transitionSpecs = [];

        this.transitionSpecs.push(
            {
                label: "No effect",
                value: 0
            }
        );
        this.transitionSpecs.push(
            {
                label: "Image wipe from top",
                value: 1
            }
        );
        this.transitionSpecs.push(
            {
                label: "Image wipe from bottom",
                value: 2
            }
        );
        this.transitionSpecs.push(
            {
                label: "Image wipe from left",
                value: 3
            }
        );
        this.transitionSpecs.push(
            {
                label: "Image wipe from right",
                value: 4
            }
        );
        this.transitionSpecs.push(
            {
                label: "Explode from center",
                value: 5
            }
        );
        this.transitionSpecs.push(
            {
                label: "Explode top left",
                value: 6
            }
        );
        this.transitionSpecs.push(
            {
                label: "Explode top right",
                value: 7
            }
        );
        this.transitionSpecs.push(
            {
                label: "Explode bottom left",
                value: 8
            }
        );

        // case 9:
        // slideTransitionSpec = "Explode bottom right";
        // break;
        // case 10:
        // slideTransitionSpec = "Venetian blinds - vertical";
        // break;
        // case 11:
        // slideTransitionSpec = "Venetian blinds - horizontal";
        // break;
        // case 12:
        // slideTransitionSpec = "Comb effect - vertical";
        // break;
        // case 13:
        // slideTransitionSpec = "Comb effect - horizontal";
        // break;
        // case 14:
        // slideTransitionSpec = "Fade to background color";
        // break;
        // case 15:
        // slideTransitionSpec = "Fade to new image";
        // break;
        // case 16:
        // slideTransitionSpec = "Slide from top";
        // break;
        // case 17:
        // slideTransitionSpec = "Slide from bottom";
        // break;
        // case 18:
        // slideTransitionSpec = "Slide from left";
        // break;
        // case 19:
        // slideTransitionSpec = "Slide from right";

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
        if (event !== undefined) {
            let selectedPlaylistItem = Object.assign({}, this.props.selectedPlaylistItem, { transition: event.target.value} );
            this.props.updateSelectedPlaylistItem(selectedPlaylistItem);

            console.log("selectedPlaylistItem.transition=", selectedPlaylistItem.transition);
            console.log("this.props.selectedPlaylistItem.transition=", this.props.selectedPlaylistItem.transition);
        }
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
            console.log("imagePlaylistItem.transition=", imagePlaylistItem.transition);

            let selectOptions = this.transitionSpecs.map(function(transitionSpec, index) {

                return (
                    <option value={transitionSpec.value} key={transitionSpec.value}>{transitionSpec.label}</option>
                );
            });

            divContent =
                <div>
                    <p>{imagePlaylistItem.fileName}</p>
                    <p>
                        Time on screen:
                        <input type="text" value={imagePlaylistItem.timeOnScreen} onChange={this.updateTimeOnScreen.bind(this)}></input>
                    </p>
                    <div>
                        Transition:
                        <select id="transitionsSelect" defaultValue={imagePlaylistItem.transition} onChange={this.updateTransition.bind(this)}>{selectOptions}</select>
                    </div>
                    <p>
                        Transition duration:
                        <input type="text" value={imagePlaylistItem.transitionDuration} onChange={this.updateTransitionDuration.bind(this)}></input>
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
